import type { EmailValidationResult } from "./types";
import { DnsResolver, type DnsResolverConfig, type DnsValidationResult } from "./dns-resolver";
import { SmtpValidator } from "./smtp";
import type { SmtpValidationConfig, SmtpValidationResult } from "./types";

// Pre-compiled patterns for better performance
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const STRICT_EMAIL_REGEX =
  /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const AT_SYMBOL = "@";

// Frozen arrays for performance
const SUSPICIOUS_PATTERNS = Object.freeze([
  /^\d+@/, // Starts with numbers
  /temp|throw|fake|trash|junk|spam|test|demo/i, // Common disposable keywords
  /^\w{1,3}@/, // Very short local part
  /\+.*@/, // Plus addressing (often used for disposables)
  /^(no-?reply|noreply)@/i, // No-reply addresses
  /\d{10,}@/, // Long numeric sequences
]);

const SUSPICIOUS_DOMAIN_PATTERNS = Object.freeze([/-temp-/, /-fake-/, /temp\d+/, /\d{5,}/]);

/**
 * Email validator for format validation and parsing with DNS and SMTP validation
 */
export class EmailValidator {
  private strictValidation: boolean;
  private compiledCustomPatterns: RegExp[] = [];
  private dnsResolver: DnsResolver;
  private smtpValidator: SmtpValidator;

  constructor(
    strictValidation = false,
    dnsConfig?: Partial<DnsResolverConfig>,
    smtpConfig?: Partial<SmtpValidationConfig>,
  ) {
    this.strictValidation = strictValidation;
    this.dnsResolver = new DnsResolver(dnsConfig);
    this.smtpValidator = new SmtpValidator(smtpConfig);
  }

  /**
   * Validate email format using regex patterns
   */
  validateEmailFormat(email: string, result: EmailValidationResult): boolean {
    // Quick length check first
    if (email.length > 254) {
      result.errors.push("Email address too long (max 254 characters)");
      return false;
    }

    // Find @ symbol position for faster parsing
    const atIndex = email.indexOf(AT_SYMBOL);
    if (atIndex === -1 || atIndex === 0 || atIndex === email.length - 1) {
      result.errors.push("Invalid email format - missing or misplaced @ symbol");
      return false;
    }

    // Check for multiple @ symbols
    if (email.indexOf(AT_SYMBOL, atIndex + 1) !== -1) {
      result.errors.push("Invalid email format - multiple @ symbols");
      return false;
    }

    const localPart = email.slice(0, atIndex);
    const domain = email.slice(atIndex + 1);

    // Length checks
    if (localPart.length > 64) {
      result.errors.push("Local part too long (max 64 characters)");
      return false;
    }

    if (domain.length > 253) {
      result.errors.push("Domain too long (max 253 characters)");
      return false;
    }

    // Regex validation
    const regex = this.strictValidation ? STRICT_EMAIL_REGEX : EMAIL_REGEX;
    if (!regex.test(email)) {
      result.errors.push("Invalid email format");
      return false;
    }

    return true;
  }

  /**
   * Parse email into components with caching
   */
  parseEmail(email: string): { localPart: string; domain: string } {
    const atIndex = email.indexOf(AT_SYMBOL);
    const localPart = email.slice(0, atIndex);
    const domain = email.slice(atIndex + 1).toLowerCase();

    return { localPart, domain };
  }

  /**
   * Batch parse multiple emails
   */
  parseEmailsBatch(emails: string[]): Array<{ localPart: string; domain: string }> {
    return emails.map((email) => this.parseEmail(email));
  }

  /**
   * Analyze email patterns for suspicious behavior
   */
  analyzePatterns(
    email: string,
    localPart: string,
    domain: string,
    customPatterns: RegExp[] = [],
  ): { suspiciousScore: number; warnings: string[] } {
    let suspiciousScore = 0;
    const warnings: string[] = [];

    // Update compiled custom patterns if needed
    if (customPatterns !== this.compiledCustomPatterns) {
      this.compiledCustomPatterns = customPatterns;
    }

    // Check built-in suspicious patterns
    for (let i = 0; i < SUSPICIOUS_PATTERNS.length; i++) {
      const pattern = SUSPICIOUS_PATTERNS[i];
      if (pattern.test(email)) {
        suspiciousScore += 20;
        warnings.push(`Matches suspicious pattern: ${pattern.source}`);
      }
    }

    // Check custom patterns
    for (let i = 0; i < this.compiledCustomPatterns.length; i++) {
      const pattern = this.compiledCustomPatterns[i];
      if (pattern.test(email)) {
        suspiciousScore += 25;
        warnings.push(`Matches custom pattern: ${pattern.source}`);
      }
    }

    // Additional heuristics
    if (localPart.length <= 2) {
      suspiciousScore += 15;
      warnings.push("Very short local part");
    }

    // Check domain patterns
    for (let i = 0; i < SUSPICIOUS_DOMAIN_PATTERNS.length; i++) {
      const pattern = SUSPICIOUS_DOMAIN_PATTERNS[i];
      if (pattern.test(domain)) {
        suspiciousScore += 30;
        warnings.push("Domain contains suspicious keywords");
        break; // Only add this warning once
      }
    }

    // Check for numeric-heavy local parts
    const numericRatio = (localPart.match(/\d/g) || []).length / localPart.length;
    if (numericRatio > 0.7) {
      suspiciousScore += 20;
      warnings.push("Local part is mostly numeric");
    }

    // Check for consecutive dots or dashes
    if (domain.includes("..") || domain.includes("--")) {
      suspiciousScore += 25;
      warnings.push("Domain has consecutive dots or dashes");
    }

    return { suspiciousScore: Math.min(suspiciousScore, 100), warnings };
  }

  /**
   *  MX record validation with detailed results
   */
  async validateMxRecord(domain: string): Promise<DnsValidationResult> {
    return this.dnsResolver.validateMxRecord(domain);
  }

  /**
   * Batch MX record validation
   */
  async validateMxRecordsBatch(domains: string[]): Promise<Map<string, DnsValidationResult>> {
    return this.dnsResolver.validateMxRecordsBatch(domains);
  }

  /**
   * Simple MX record check (backward compatibility)
   */
  async checkMxRecord(domain: string): Promise<boolean> {
    return this.dnsResolver.checkMxRecord(domain);
  }

  /**
   * Batch simple MX record checking
   */
  async checkMxRecordsBatch(domains: string[]): Promise<Map<string, boolean>> {
    return this.dnsResolver.checkMxRecordsBatch(domains);
  }

  /**
   * SMTP validation for email deliverability
   */
  async validateSmtpDeliverability(
    email: string,
    mxRecords?: Array<{ exchange: string; priority: number }>,
  ): Promise<SmtpValidationResult> {
    const mxRecordsFormatted = mxRecords?.map((mx) => ({
      exchange: mx.exchange,
      priority: mx.priority,
    }));
    return this.smtpValidator.validateEmail(email, mxRecordsFormatted);
  }

  /**
   * Batch SMTP validation
   */
  async validateSmtpDeliverabilityBatch(
    emails: string[],
    mxRecordsMap?: Map<string, Array<{ exchange: string; priority: number }>>,
  ): Promise<Map<string, SmtpValidationResult>> {
    const results = new Map<string, SmtpValidationResult>();

    // Process emails in chunks to avoid overwhelming mail servers
    const chunkSize = 5;
    for (let i = 0; i < emails.length; i += chunkSize) {
      const chunk = emails.slice(i, i + chunkSize);
      const chunkPromises = chunk.map((email) => {
        const domain = email.split("@")[1];
        const mxRecords = mxRecordsMap?.get(domain);
        return this.validateSmtpDeliverability(email, mxRecords);
      });

      const chunkResults = await Promise.all(chunkPromises);
      for (let j = 0; j < chunk.length; j++) {
        results.set(chunk[j], chunkResults[j]);
      }

      // Add delay between chunks to be respectful to mail servers
      if (i + chunkSize < emails.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Combined DNS and SMTP validation
   */
  async validateEmailDeliverability(email: string): Promise<{
    email: string;
    dnsValidation: DnsValidationResult;
    smtpValidation?: SmtpValidationResult;
    overallValid: boolean;
  }> {
    const domain = email.split("@")[1];
    if (!domain) {
      throw new Error("Invalid email format");
    }

    // First, perform DNS validation
    const dnsResult = await this.dnsResolver.validateMxRecord(domain);

    let smtpResult: SmtpValidationResult | undefined;
    let overallValid = dnsResult.hasMx;

    // If DNS validation passes and we have MX records, perform SMTP validation
    if (dnsResult.hasMx && dnsResult.mxRecords.length > 0) {
      try {
        smtpResult = await this.validateSmtpDeliverability(email, dnsResult.mxRecords);
        overallValid = dnsResult.hasMx && smtpResult.isMailboxValid;
      } catch (error) {
        // SMTP validation failed, but we still have DNS validation
        overallValid = dnsResult.hasMx;
      }
    }

    return {
      email,
      dnsValidation: dnsResult,
      smtpValidation: smtpResult,
      overallValid,
    };
  }

  /**
   * Set strict validation mode
   */
  setStrictValidation(strict: boolean): void {
    this.strictValidation = strict;
  }

  /**
   * Update DNS resolver configuration
   */
  updateDnsConfig(newConfig: Partial<DnsResolverConfig>): void {
    this.dnsResolver.updateConfig(newConfig);
  }

  /**
   * Update SMTP validator configuration
   */
  updateSmtpConfig(newConfig: Partial<SmtpValidationConfig>): void {
    this.smtpValidator.updateConfig(newConfig);
  }

  /**
   * Get validation statistics including DNS and SMTP stats
   */
  getStats(): {
    dnsStats: {
      cacheSize: number;
      activeRequests: number;
      queuedRequests: number;
      cacheHitRate: number;
    };
    smtpStats: {
      cacheSize: number;
      activeRequests: number;
      queuedRequests: number;
      cacheHitRate: number;
    };
  } {
    return {
      dnsStats: this.dnsResolver.getStats(),
      smtpStats: this.smtpValidator.getStats(),
    };
  }

  /**
   * Clear all caches
   */
  clearAllCaches(): void {
    this.dnsResolver.clearCache();
    this.smtpValidator.clearCache();
  }
}
