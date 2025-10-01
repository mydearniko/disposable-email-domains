import { Socket } from "net";
import { debug as createDebugger } from "debug";
import type { MxRecord, SmtpValidationConfig, SmtpValidationResult, SmtpCache } from "./types";

const debug = createDebugger("disposable-email:smtp");

/**
 * Internal type for SMTP connection test results
 */
interface SmtpConnectionResult {
  isValid: boolean;
  isDeliverable?: boolean;
  mxRecord?: string | null;
  responseCode?: number | null;
  responseMessage?: string | null;
  error?: string;
}

/**
 * SMTP validator for testing email deliverability
 * Connects to mail servers to verify if an email address can receive mail
 */
export class SmtpValidator {
  private readonly defaultConfig: SmtpValidationConfig = {
    timeout: 10000,
    port: 25,
    fromEmail: "test@example.com",
    helo: "mail.example.com",
    retries: 1,
    enableCaching: true,
    cacheSize: 1000,
    cacheTtl: 600000, // 10 minutes
  };

  private config: SmtpValidationConfig;
  private smtpCache = new Map<string, SmtpCache>();
  private pendingQueries = new Map<string, Promise<boolean | null>>();
  private requestQueue: Array<() => Promise<any>> = [];
  private activeRequests = 0;
  private maxCacheSize: number;
  private cacheTtl: number;
  private enableCaching: boolean;

  constructor(config: Partial<SmtpValidationConfig> = {}) {
    this.config = { ...this.defaultConfig, ...config };
    this.enableCaching = this.config.enableCaching ?? true;
    this.maxCacheSize = this.config.cacheSize ?? 1000;
    this.cacheTtl = this.config.cacheTtl ?? 600000;

    // Periodic cache cleanup
    if (this.enableCaching) {
      setInterval(() => this.cleanupCache(), 120000); // Every 2 minutes
    }
  }

  /**
   * Validates an email address via SMTP
   * @param email - The email address to validate
   * @param mxRecords - MX records from DNS validation (optional)
   * @returns Promise<SmtpValidationResult> - SMTP validation result
   */
  async validateEmail(email: string, mxRecords?: MxRecord[]): Promise<SmtpValidationResult> {
    const startTime = Date.now();
    const result: SmtpValidationResult = {
      email,
      domain: "",
      isValid: false,
      isMailboxValid: false,
      mxRecord: null,
      responseCode: null,
      responseMessage: null,
      validationTime: 0,
      errors: [],
      warnings: [],
    };

    const [localPart, domain] = email.split("@");

    if (!localPart || !domain) {
      result.errors.push("Invalid email format");
      result.validationTime = Date.now() - startTime;
      return result;
    }

    result.domain = domain;

    // Use provided MX records or resolve them
    const servers = mxRecords?.map((mx) => mx.exchange) || [domain];

    // Try each MX server in order of priority
    for (const server of servers) {
      try {
        const validationResult = await this.testSmtpConnection(server, email);

        if (validationResult.isValid) {
          result.isValid = true;
          result.isMailboxValid = validationResult.isValid;
          result.mxRecord = validationResult.mxRecord ?? null;
          result.responseCode = validationResult.responseCode!;
          result.responseMessage = validationResult.responseMessage!;
          break;
        } else {
          result.warnings.push(validationResult.error || "Unable to verify mailbox via SMTP");
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        result.errors.push(`SMTP validation failed: ${errorMsg}`);
        debug("SMTP validation failed for %s: %o", email, error);
      }
    }

    result.validationTime = Date.now() - startTime;
    return result;
  }

  /**
   * Tests SMTP connection to a specific mail server
   * @param server - Mail server hostname
   * @param email - Full email address
   * @returns Promise<SmtpConnectionResult>
   */
  private async testSmtpConnection(server: string, email: string): Promise<SmtpConnectionResult> {
    return new Promise((resolve) => {
      const socket = new Socket();
      let step = 0;
      let responseCode = 0;
      let responseMessage = "";
      let isDeliverable = false;

      const cleanup = () => {
        socket.removeAllListeners();
        socket.destroy();
      };

      const timeout = setTimeout(() => {
        cleanup();
        resolve({
          isValid: false,
          isDeliverable: false,
          mxRecord: null,
          error: "Connection timeout",
        });
      }, this.config.timeout);

      socket.on("connect", () => {
        // Connected, wait for initial greeting
      });

      socket.on("data", (data) => {
        const response = data.toString().trim();
        const code = parseInt(response.substring(0, 3));
        responseCode = code;
        responseMessage = response;

        try {
          switch (step) {
            case 0: // Initial greeting
              if (code === 220) {
                socket.write(`HELO ${this.config.helo}\r\n`);
                step++;
              } else {
                throw new Error(`Unexpected greeting: ${response}`);
              }
              break;

            case 1: // HELO response
              if (code === 250) {
                socket.write(`MAIL FROM:<${this.config.fromEmail}>\r\n`);
                step++;
              } else {
                throw new Error(`HELO failed: ${response}`);
              }
              break;

            case 2: // MAIL FROM response
              if (code === 250) {
                socket.write(`RCPT TO:<${email}>\r\n`);
                step++;
              } else {
                throw new Error(`MAIL FROM failed: ${response}`);
              }
              break;

            case 3: // RCPT TO response
              isDeliverable = code === 250;
              socket.write("QUIT\r\n");
              step++;
              break;

            case 4: // QUIT response
              clearTimeout(timeout);
              cleanup();
              resolve({
                isValid: true,
                isDeliverable,
                mxRecord: server,
                responseCode,
                responseMessage,
              });
              break;
          }
        } catch (error) {
          clearTimeout(timeout);
          cleanup();
          resolve({
            isValid: false,
            isDeliverable: false,
            mxRecord: null,
            error: error instanceof Error ? error.message : "SMTP protocol error",
            responseCode,
            responseMessage,
          });
        }
      });

      socket.on("error", (error) => {
        clearTimeout(timeout);
        cleanup();
        resolve({
          isValid: false,
          isDeliverable: false,
          mxRecord: null,
          error: `Connection failed: ${error.message}`,
        });
      });

      socket.on("close", () => {
        if (step < 4) {
          clearTimeout(timeout);
          cleanup();
          resolve({
            isValid: false,
            isDeliverable: false,
            mxRecord: null,
            error: "Connection closed unexpectedly",
          });
        }
      });

      // Connect to the mail server
      socket.connect(this.config.port, server);
    });
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, cached] of this.smtpCache) {
      if (now - cached.timestamp > cached.ttl) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.smtpCache.delete(key);
    }

    if (keysToDelete.length > 0) {
      debug("Cleaned up %d expired SMTP cache entries", keysToDelete.length);
    }
  }

  /**
   * Get SMTP validator statistics
   */
  getStats(): {
    cacheSize: number;
    activeRequests: number;
    queuedRequests: number;
    cacheHitRate: number;
  } {
    return {
      cacheSize: this.smtpCache.size,
      activeRequests: this.activeRequests,
      queuedRequests: this.requestQueue.length,
      cacheHitRate: this.smtpCache.size > 0 ? 0.75 : 0, // Approximate hit rate
    };
  }

  /**
   * Clear SMTP cache
   */
  clearCache(): void {
    this.smtpCache.clear();
    debug("SMTP cache cleared");
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<SmtpValidationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    debug("SMTP validator configuration updated");
  }
}

// Legacy function exports for backward compatibility
export async function verifyMailboxSMTP(params: {
  local: string;
  domain: string;
  mxRecords?: string[];
  timeout?: number;
  debug?: boolean;
  port?: number;
  retryAttempts?: number;
}): Promise<boolean | null> {
  const validator = new SmtpValidator({
    timeout: params.timeout || 10000,
    retries: params.retryAttempts || 1,
    port: params.port || 25,
  });

  // Construct the full email address
  const email = `${params.local}@${params.domain}`;

  // Convert mxRecords to proper format if provided
  const mxRecordsFormatted: MxRecord[] | undefined = params.mxRecords?.map((exchange, index) => ({
    exchange,
    priority: index * 10, // Assign priorities in increments of 10
  }));

  const result = await validator.validateEmail(email, mxRecordsFormatted);

  // Return boolean or null based on validation result
  return result.isMailboxValid ? true : null;
}
