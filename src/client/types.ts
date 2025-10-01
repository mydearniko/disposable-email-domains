/**
 * Type definitions for email validation and checking
 */

/**
 * DNS record types for email validation
 */
export interface MxRecord {
  exchange: string;
  priority: number;
}

export interface DnsValidationResult {
  domain: string;
  hasMx: boolean;
  mxRecords: MxRecord[];
  hasSpf: boolean;
  hasDmarc: boolean;
  isConnectable: boolean;
  validationTime: number;
  errors: string[];
  warnings: string[];
}

/**
 * SMTP validation configuration and results
 */
export interface SmtpValidationConfig {
  timeout: number;
  port: number;
  fromEmail: string;
  helo: string;
  retries?: number;
  enableCaching?: boolean;
  cacheSize?: number;
  cacheTtl?: number;
}

export interface SmtpValidationResult {
  email: string;
  domain: string;
  isValid: boolean;
  isMailboxValid: boolean;
  mxRecord: string | null;
  responseCode: number | null;
  responseMessage: string | null;
  validationTime: number;
  errors: string[];
  warnings: string[];
}

export interface SmtpCache {
  result: boolean | null;
  timestamp: number;
  ttl: number;
}

/**
 * Email validation result with detailed information
 */
export interface EmailValidationResult {
  email: string;
  isValid: boolean;
  isDisposable: boolean;
  isAllowed: boolean;
  isBlacklisted: boolean;
  domain: string;
  localPart: string;
  matchType: "exact" | "subdomain" | "pattern" | "none";
  confidence: number; // 0-100
  source?: string;
  validationTime: number; // milliseconds
  errors: string[];
  warnings: string[];
  // DNS validation results (optional)
  dnsValidation?: {
    hasMx: boolean;
    mxRecords: Array<{ exchange: string; priority: number }>;
    hasSpf: boolean;
    hasDmarc: boolean;
    isConnectable: boolean;
    dnsValidationTime: number;
  };
  // SMTP validation results (optional)
  smtpValidation?: {
    isValid: boolean;
    isDeliverable: boolean;
    responseCode: number | null;
    responseMessage: string | null;
    smtpValidationTime: number;
    serverTested: string | null;
  };
}

/**
 * Performance metrics for tracking validation operations
 */
export interface PerformanceMetrics {
  totalValidations: number;
  successfulValidations: number;
  failedValidations: number;
  disposableDetected: number;
  allowedOverrides: number;
  blacklistedDetected: number;
  averageValidationTime: number;
  cacheHitRate: number;
  indexSize: number;
  lastUpdated: string;
  throughputPerSecond: number;
  // DNS metrics
  dnsValidations?: number;
  dnsSuccessRate?: number;
  averageDnsTime?: number;
  // SMTP metrics
  smtpValidations?: number;
  smtpSuccessRate?: number;
  averageSmtpTime?: number;
}

/**
 * Configuration options for the email checker
 */
export interface EmailCheckerConfig {
  // Data sources
  disposableDomainsUrl?: string;
  localDataPath?: string;
  allowlistPath?: string;
  blacklistPath?: string;

  // Validation options
  strictValidation?: boolean;
  checkMxRecord?: boolean;
  checkSmtpDeliverability?: boolean;
  enableSubdomainChecking?: boolean;
  enablePatternMatching?: boolean;

  // Advanced DNS validation options
  dnsValidation?: {
    timeout?: number;
    retries?: number;
    enableCaching?: boolean;
    cacheSize?: number;
    cacheTtl?: number;
    concurrency?: number;
    validateMxConnectivity?: boolean;
    checkSpfRecord?: boolean;
    checkDmarcRecord?: boolean;
    customDnsServers?: string[];
    fallbackDnsServers?: string[];
  };

  // SMTP validation options
  smtpValidation?: {
    timeout?: number;
    port?: number;
    fromEmail?: string;
    helo?: string;
    retries?: number;
    enableCaching?: boolean;
    cacheSize?: number;
    cacheTtl?: number;
  };

  // Performance options
  enableCaching?: boolean;
  cacheSize?: number;
  enableIndexing?: boolean;
  indexingStrategy?: "trie" | "hash" | "bloom" | "hybrid";

  // Cache options
  cacheType?: string;
  cacheConfig?: {
    maxSize?: number;
    defaultTtl?: number;
    cleanupInterval?: number;
    [key: string]: any;
  };
  customCache?: any;

  // Update options
  autoUpdate?: boolean;
  updateInterval?: number;

  // Custom options
  customPatterns?: RegExp[];
  trustedDomains?: string[];
  suspiciousPatterns?: string[];
}

/**
 * Cache entry for validation results
 */
export interface CacheEntry {
  result: EmailValidationResult;
  timestamp: number;
  hitCount: number;
}

/**
 * Validation report structure
 */
export interface ValidationReport {
  summary: {
    total: number;
    valid: number;
    invalid: number;
    disposable: number;
    allowed: number;
    blacklisted: number;
  };
  details: EmailValidationResult[];
  performance: {
    totalTime: number;
    averageTimePerEmail: number;
    throughput: number;
  };
}

/**
 * Domain insights structure
 */
export interface DomainInsights {
  topLevelDomains: Map<string, number>;
  suspiciousPatterns: Map<string, number>;
  domainLengthDistribution: Map<string, number>;
  mostCommonSubdomains: Map<string, number>;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  size: number;
  hitRate: number;
  entries: number;
}

/**
 * Performance benchmark results
 */
export interface BenchmarkResults {
  hash: number;
  trie: number;
  bloom: number;
  hybrid: number;
}

/**
 * DNS Resolver Configuration
 */
export interface DnsResolverConfig {
  timeout: number;
  retries: number;
  enableCaching: boolean;
  cacheSize: number;
  cacheTtl: number;
  concurrency: number;
  validateMxConnectivity: boolean;
  checkSpfRecord: boolean;
  checkDmarcRecord: boolean;
  customDnsServers?: string[];
  fallbackDnsServers: string[];
}
