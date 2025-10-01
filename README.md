# Disposable Email Domains - TypeScript SDK

<div align="center">
  <img src="assets/logo.svg" alt="Disposable Email Domains Logo" width="120" height="120">
  
  <p><strong>A powerful TypeScript SDK for detecting disposable email addresses with DNS and SMTP validation</strong></p>
  
  [![npm version](https://badge.fury.io/js/%40usex%2Fdisposable-email-domains.svg)](https://www.npmjs.com/package/@usex/disposable-email-domains)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<a href="https://www.producthunt.com/products/github-192?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-detecting&#0045;disposable&#0045;email&#0045;addresses" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1021628&theme=light&t=1759345731657" alt="Detecting&#0032;disposable&#0032;email&#0032;addresses - A&#0032;powerful&#0032;SDK&#0032;for&#0032;detecting&#0032;disposable&#0032;email&#0032;addresses | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
</div>

---

## ✨ Features

- **🎯 119K+ Disposable Domains** - Real-time updates from 15+ sources
- **⚡ High Performance** - Advanced caching, Trie indexing, Bloom filters
- **🔧 TypeScript-First** - Fully typed with strict type definitions
- **🛡️ Advanced Validation** - Format, MX records, SPF, DMARC, SMTP deliverability
- **📊 Analytics & Insights** - Built-in metrics and performance monitoring
- **💾 Flexible Caching** - Memory, Redis, Database, or custom adapters
- **🎨 Extensible** - Plugin system for custom validation rules

<!-- START STATS -->
## 📊 Current Statistics

> **Last Updated**: September 25, 2025 at 05:57 PM GMT+3:30 | **Next Sync**: Automated twice daily (6 AM & 6 PM UTC)
> 📋 **[View Detailed Report](data/report.md)** | Last sync analysis and insights

<div align="center">

### 🎯 Domain Coverage

| 📧 **Total Domains** | 🆕 **Recent Additions** | 🗑️ **Recent Removals** | 📈 **Growth Rate** |
|:---:|:---:|:---:|:---:|
| **119,617** | **0** | **0** | **0.00%** |

### ⚡ Performance Metrics

| 🚀 **Sync Time** | ✅ **Success Rate** | 📦 **File Size** | 🔄 **Deduplication** |
|:---:|:---:|:---:|:---:|
| **0.84s** | **100.0%** | **1.8 MB** | **164,496 removed** |

</div>

### 🏆 Top Contributing Sources

| Repository | Domains | Success | Performance |
|------------|---------|---------|-------------|
| [kslr/disposable-email-domains](https://github.com/kslr/disposable-email-domains) | 110,498 | ✅ | 0.31s (1.6 MB) |
| [FGRibreau/mailchecker](https://github.com/FGRibreau/mailchecker) | 55,857 | ✅ | 0.24s (838.3 KB) |
| [wesbos/burner-email-providers](https://github.com/wesbos/burner-email-providers) | 27,284 | ✅ | 0.19s (388.1 KB) |
| [groundcat/disposable-email-domain-list](https://github.com/groundcat/disposable-email-domain-list) | 27,120 | ✅ | 0.14s (401.7 KB) |
| [disposable/disposable-email-domains](https://github.com/disposable/disposable-email-domains) | 27,038 | ✅ | 0.15s (381.4 KB) |
| [sublime-security/static-files](https://github.com/sublime-security/static-files) | 10,523 | ✅ | 0.27s (144.0 KB) |
| [7c/fakefilter](https://github.com/7c/fakefilter) | 8,784 | ✅ | 0.08s (126.7 KB) |
| [disposable-email-domains/disposable-email-domains](https://github.com/disposable-email-domains/disposable-email-domains) | 4,725 | ✅ | 0.09s (59.7 KB) |
| [willwhite/freemail](https://github.com/willwhite/freemail) | 4,462 | ✅ | 0.05s (61.8 KB) |
| [eser/sanitizer-svc](https://github.com/eser/sanitizer-svc) | 3,855 | ✅ | 0.13s (48.9 KB) |

<details>
<summary>📈 <strong>Detailed Metrics</strong></summary>

#### 🔍 Sync Analysis
- **Total Sources**: 15 repositories monitored
- **Active Sources**: 15 successfully synchronized
- **Failed Sources**: 0 temporary failures
- **Processing Efficiency**: 142063 domains/second
- **Average Download Time**: 0.14s per repository
- **Total Data Processed**: 4.1 MB

#### 🎯 Quality Metrics
- **Duplicate Detection**: 164,496 duplicates identified and removed
- **Data Integrity**: 100.0% repository success rate
- **Coverage Efficiency**: 42.1% unique domains retained

</details>

---
<!-- END STATS -->

## 📦 Installation

```bash
# Using bun (recommended)
bun add @usex/disposable-email-domains

# Using npm
npm install @usex/disposable-email-domains

# Using yarn
yarn add @usex/disposable-email-domains
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { DisposableEmailChecker } from '@usex/disposable-email-domains';

const checker = new DisposableEmailChecker();

// Single email check
const result = await checker.checkEmail('test@mailinator.com');
console.log(result.isDisposable); // true
console.log(result.confidence);   // 95

// Batch validation
const emails = ['user@gmail.com', 'temp@10minutemail.com'];
const results = await checker.checkEmailsBatch(emails);
```

### DNS Validation

```typescript
const checker = new DisposableEmailChecker({
  checkMxRecord: true,
  dnsValidation: {
    validateMxConnectivity: true,
    checkSpfRecord: true,
    checkDmarcRecord: true,
    timeout: 5000,
    retries: 3
  }
});

const result = await checker.checkEmail('user@example.com');

// Access DNS validation results
console.log(result.dnsValidation?.hasMx);          // true
console.log(result.dnsValidation?.mxRecords);      // [{ exchange: 'mail.example.com', priority: 10 }]
console.log(result.dnsValidation?.hasSpf);         // true
console.log(result.dnsValidation?.hasDmarc);       // true
console.log(result.dnsValidation?.isConnectable);  // true
```

### SMTP Validation

```typescript
const checker = new DisposableEmailChecker({
  checkMxRecord: true,
  checkSmtpDeliverability: true,
  smtpValidation: {
    timeout: 10000,
    port: 25,
    fromEmail: 'test@yourdomain.com',
    helo: 'mail.yourdomain.com'
  }
});

const result = await checker.checkEmail('user@example.com');

// Access SMTP validation results
console.log(result.smtpValidation?.isDeliverable);      // true
console.log(result.smtpValidation?.responseCode);       // 250
console.log(result.smtpValidation?.responseMessage);    // '2.1.5 Recipient OK'
console.log(result.smtpValidation?.serverTested);       // 'mail.example.com'
```

### Combined DNS + SMTP Validation

```typescript
// When both are enabled, MX records from DNS are passed to SMTP (no duplicate lookups)
const checker = new DisposableEmailChecker({
  checkMxRecord: true,
  checkSmtpDeliverability: true,
  dnsValidation: {
    validateMxConnectivity: true,
    checkSpfRecord: true,
    checkDmarcRecord: true
  },
  smtpValidation: {
    timeout: 8000,
    fromEmail: 'test@yourdomain.com'
  }
});

const result = await checker.checkEmail('user@example.com');

// Get complete validation picture
console.log({
  isValid: result.isValid,
  isDisposable: result.isDisposable,
  hasMx: result.dnsValidation?.hasMx,
  isDeliverable: result.smtpValidation?.isDeliverable,
  confidence: result.confidence
});
```

## 📋 Configuration

### DisposableEmailChecker Options

```typescript
interface EmailCheckerConfig {
  // Validation Options
  strictValidation?: boolean;              // Strict RFC validation (default: false)
  checkMxRecord?: boolean;                 // Enable MX checking (default: false)
  checkSmtpDeliverability?: boolean;       // Enable SMTP testing (default: false)
  enableSubdomainChecking?: boolean;       // Check subdomains (default: true)
  enablePatternMatching?: boolean;         // Use regex patterns (default: true)
  
  // Performance Options
  enableCaching?: boolean;                 // Enable caching (default: true)
  cacheSize?: number;                      // Cache size (default: 10000)
  enableIndexing?: boolean;                // Use Trie/Bloom filters (default: true)
  indexingStrategy?: 'trie' | 'bloom' | 'hybrid'; // Indexing strategy (default: 'hybrid')
  
  // DNS Validation
  dnsValidation?: {
    timeout?: number;                      // DNS timeout in ms (default: 5000)
    retries?: number;                      // Retry attempts (default: 3)
    enableCaching?: boolean;               // Cache DNS results (default: true)
    cacheSize?: number;                    // DNS cache size (default: 5000)
    cacheTtl?: number;                     // DNS cache TTL in ms (default: 300000)
    concurrency?: number;                  // Max concurrent queries (default: 10)
    validateMxConnectivity?: boolean;      // Test SMTP connectivity (default: false)
    checkSpfRecord?: boolean;              // Check SPF records (default: false)
    checkDmarcRecord?: boolean;            // Check DMARC records (default: false)
    customDnsServers?: string[];           // Custom DNS servers
    fallbackDnsServers?: string[];         // Fallback DNS servers
  };
  
  // SMTP Validation
  smtpValidation?: {
    timeout?: number;                      // SMTP timeout in ms (default: 10000)
    port?: number;                         // SMTP port (default: 25)
    fromEmail?: string;                    // FROM address (default: 'test@example.com')
    helo?: string;                         // HELO hostname (default: 'mail.example.com')
    retries?: number;                      // Retry attempts (default: 2)
    enableCaching?: boolean;               // Cache SMTP results (default: true)
    cacheSize?: number;                    // SMTP cache size (default: 1000)
    cacheTtl?: number;                     // SMTP cache TTL in ms (default: 600000)
  };
  
  // Data Sources
  disposableDomainsUrl?: string;           // Remote domain list URL
  localDataPath?: string;                  // Local domain list path
  allowlistPath?: string;                  // Allowlist file path
  blacklistPath?: string;                  // Blacklist file path
  
  // Custom Configuration
  customPatterns?: RegExp[];               // Custom regex patterns
  trustedDomains?: string[];               // Trusted domains (always valid)
  suspiciousPatterns?: RegExp[];           // Suspicious patterns
  customCache?: any;                       // Custom cache implementation
}
```

## 🎯 API Reference

### Core Methods

#### `checkEmail(email: string): Promise<EmailValidationResult>`
Validates a single email address with all enabled checks.

#### `checkEmailsBatch(emails: string[]): Promise<EmailValidationResult[]>`
Validates multiple emails efficiently with batch processing.

#### `validateDomain(domain: string): Promise<DnsValidationResult>`
Performs DNS validation for a domain (requires `checkMxRecord: true`).

#### `addToAllowlist(domain: string): void`
Adds a domain to the allowlist (always considered valid).

#### `addToBlacklist(domain: string): void`
Adds a domain to the blacklist (always considered invalid).

#### `getStats(): object`
Retrieves comprehensive statistics including DNS and SMTP metrics.

#### `getMetrics(): PerformanceMetrics`
Retrieves detailed performance metrics for all validation operations.

#### `clearAllCaches(): Promise<void>`
Clears all caches (email validation, DNS, and SMTP).

### Result Interfaces

```typescript
interface EmailValidationResult {
  email: string;
  isValid: boolean;
  isDisposable: boolean;
  isAllowed: boolean;
  isBlacklisted: boolean;
  domain: string;
  localPart: string;
  matchType: 'exact' | 'subdomain' | 'pattern' | 'none';
  confidence: number;           // 0-100
  validationTime: number;       // milliseconds
  errors: string[];
  warnings: string[];
  
  // DNS validation results (when enabled)
  dnsValidation?: {
    hasMx: boolean;
    mxRecords: Array<{ exchange: string; priority: number }>;
    hasSpf: boolean;
    hasDmarc: boolean;
    isConnectable: boolean;
    dnsValidationTime: number;
  };
  
  // SMTP validation results (when enabled)
  smtpValidation?: {
    isValid: boolean;
    isDeliverable: boolean;
    responseCode: number | null;
    responseMessage: string | null;
    smtpValidationTime: number;
    serverTested: string | null;
  };
}
```

## 🔧 Advanced Usage

### Standalone Components

```typescript
import { EmailValidator, DnsResolver, SmtpValidator } from '@usex/disposable-email-domains';

// Standalone DNS resolver
const dnsResolver = new DnsResolver({
  timeout: 5000,
  retries: 3,
  validateMxConnectivity: true
});
const dnsResult = await dnsResolver.validateMxRecord('gmail.com');

// Standalone SMTP validator
const smtpValidator = new SmtpValidator({
  timeout: 10000,
  fromEmail: 'test@yourdomain.com'
});
const smtpResult = await smtpValidator.validateEmail('user@example.com');

// Email validator with DNS and SMTP
const emailValidator = new EmailValidator(
  false, // strict mode
  { timeout: 5000, validateMxConnectivity: true }, // DNS config
  { timeout: 10000, fromEmail: 'test@yourdomain.com' } // SMTP config
);
const validation = await emailValidator.validateEmailDeliverability('user@example.com');
```

### Custom Cache Implementation

```typescript
import { DisposableEmailChecker, type ICache } from '@usex/disposable-email-domains';

class RedisCache implements ICache {
  async get(key: string): Promise<any> { /* ... */ }
  async set(key: string, value: any, ttl?: number): Promise<void> { /* ... */ }
  async has(key: string): Promise<boolean> { /* ... */ }
  async delete(key: string): Promise<boolean> { /* ... */ }
  async clear(): Promise<void> { /* ... */ }
  async size(): Promise<number> { /* ... */ }
}

const checker = new DisposableEmailChecker({
  customCache: new RedisCache()
});
```

### Performance Monitoring

```typescript
const checker = new DisposableEmailChecker({
  checkMxRecord: true,
  checkSmtpDeliverability: true,
  enableCaching: true
});

// Process some emails
await checker.checkEmail('test@gmail.com');
await checker.checkEmail('temp@10minutemail.com');

// Get comprehensive statistics
const stats = checker.getStats();
console.log('Performance:', {
  totalValidations: stats.performance.totalValidations,
  avgTime: stats.performance.averageValidationTime,
  cacheHitRate: stats.performance.cacheHitRate,
  dnsStats: stats.dns,
  smtpStats: stats.smtp
});
```

### High-Volume Batch Processing

```typescript
async function validateLargeList(emails: string[]) {
  const checker = new DisposableEmailChecker({
    enableCaching: true,
    cacheSize: 50000,
    checkMxRecord: true,
    checkSmtpDeliverability: true,
    dnsValidation: {
      enableCaching: true,
      cacheSize: 20000,
      concurrency: 25
    },
    smtpValidation: {
      enableCaching: true,
      cacheSize: 10000
    }
  });

  const batchSize = 50;
  const results = [];
  
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    const batchResults = await checker.checkEmailsBatch(batch);
    results.push(...batchResults);
    
    // Add delay for SMTP validation to respect mail servers
    if (i + batchSize < emails.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  return results;
}
```

## ⚡ Performance

### Benchmarks

| Operation | Time | Cache Hit Rate | Memory |
|-----------|------|----------------|--------|
| Single email validation | ~1-5ms | 90%+ | <5MB |
| Batch validation (100 emails) | ~50-200ms | 90%+ | <10MB |
| DNS validation | ~50-200ms | 90%+ | <10MB |
| SMTP validation | ~500-2000ms | 75%+ | <5MB |
| Combined DNS+SMTP | ~600-2200ms | 85%+ | <15MB |

### Optimization Tips

1. **Enable caching** for all validation types (DNS, SMTP, email)
2. **Use appropriate batch sizes**: 100-200 for DNS, 25-50 for SMTP
3. **Set reasonable timeouts**: 5s for DNS, 10s for SMTP
4. **Add delays between SMTP batches** (1-2s) to respect mail servers
5. **Use hybrid indexing** for optimal performance with large domain lists

Run benchmarks locally:
```bash
bun run test:bench
```

## 🧪 Testing

```bash
# Run all tests
bun run test

# Type checking
bun run test:types

# Coverage report
bun run test:coverage

# Benchmarks
bun run test:bench
```

## 🔄 Domain Synchronization

The domain database is automatically synchronized from 15+ trusted sources twice daily (6 AM & 6 PM UTC). See [Syncer Documentation](./docs/syncer.md) for advanced synchronization features.

## 📚 Documentation

- **[API Reference](./docs/api.md)** - Complete API documentation
- **[Configuration Guide](./docs/configuration.md)** - Detailed configuration options
- **[Performance Guide](./docs/performance.md)** - Optimization techniques
- **[Examples](./examples)** - More usage examples
- **[Syncer Documentation](./docs/syncer.md)** - Domain synchronization details

## 📄 License

MIT © [Ali Torki](https://github.com/ali-master)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/ali-master">Ali Torki</a></p>
</div>
