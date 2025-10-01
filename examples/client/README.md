# Disposable Email Domains SDK - Examples

This directory contains comprehensive examples demonstrating all features of the Disposable Email Domains SDK.

## 📚 Available Examples

### [01-basic-checking.ts](./01-basic-checking.ts)
**Basic Disposable Email Detection**

Learn the fundamentals of disposable email checking with simple, practical examples.

**What you'll learn:**
- Simple quick email validation
- Checking multiple emails
- Real-world form validation scenarios
- Understanding match types (exact, subdomain, pattern)
- Proper error handling

**Run:**
```bash
bun run examples/client/01-basic-checking.ts
```

---

### [02-dns-validation.ts](./02-dns-validation.ts)
**DNS and MX Record Validation**

Master DNS-based email validation including MX records, SPF, and DMARC checks.

**What you'll learn:**
- Basic MX record validation
- Detailed MX record information
- SPF and DMARC validation with security scoring
- MX server connectivity testing
- Batch DNS validation
- DNS caching performance

**Run:**
```bash
bun run examples/client/02-dns-validation.ts
```

---

### [03-smtp-validation.ts](./03-smtp-validation.ts)
**SMTP Deliverability Testing**

Understand SMTP-based email verification to test actual mailbox deliverability.

**What you'll learn:**
- Standalone SMTP validation
- Testing multiple emails via SMTP
- SMTP response code analysis
- Custom SMTP configuration
- Combined DNS + SMTP validation
- Batch SMTP validation
- Error handling for SMTP connections

**Run:**
```bash
bun run examples/client/03-smtp-validation.ts
```

**Note:** SMTP validation may take longer and some mail servers may block validation attempts.

---

### [04-batch-processing.ts](./04-batch-processing.ts)
**Batch Email Validation**

Learn efficient batch processing techniques for validating multiple emails.

**What you'll learn:**
- Basic batch validation
- Large-scale processing (50+ emails)
- Progress tracking with visual indicators
- Batch processing with DNS validation
- Batch processing with SMTP validation
- Error handling in batch operations
- Performance comparison: Sequential vs Batch

**Run:**
```bash
bun run examples/client/04-batch-processing.ts
```

---

### [05-advanced-configuration.ts](./05-advanced-configuration.ts)
**Advanced Configuration Options**

Explore all configuration options for fine-tuning the SDK to your needs.

**What you'll learn:**
- Basic configuration options
- Custom pattern matching
- Trusted domains configuration
- Strict vs standard validation modes
- Advanced DNS validation configuration
- Advanced SMTP validation configuration
- Indexing strategy comparison (Trie, Bloom, Hybrid)
- Cache configuration options
- Complete configuration example

**Run:**
```bash
bun run examples/client/05-advanced-configuration.ts
```

---

### [06-performance-monitoring.ts](./06-performance-monitoring.ts)
**Performance Monitoring and Optimization**

Master performance tracking, analysis, and optimization techniques.

**What you'll learn:**
- Basic performance metrics tracking
- Cache performance analysis
- DNS and SMTP statistics
- Throughput measurement
- Performance comparison of different configurations
- Real-time monitoring
- Memory and resource monitoring
- Optimization recommendations

**Run:**
```bash
bun run examples/client/06-performance-monitoring.ts
```

---

### [basic-usage.ts](./basic-usage.ts)
**Complete All-in-One Example**

A comprehensive example combining all features in one file (legacy format).

**Run:**
```bash
bun run examples/client/basic-usage.ts
```

---

## 🚀 Quick Start

### Run All Examples
```bash
# Run a specific example
bun run examples/client/01-basic-checking.ts

# Or run all examples sequentially
for file in examples/client/0*.ts; do
  echo "Running $file..."
  bun run "$file"
done
```

### Run Individual Functions
Each example file exports its functions, so you can import and run them selectively:

```typescript
import { simpleCheck, formValidationExample } from './examples/client/01-basic-checking';

// Run only specific examples
await simpleCheck();
await formValidationExample();
```

---

## 📖 Learning Path

We recommend following this learning path:

1. **Start Here:** [01-basic-checking.ts](./01-basic-checking.ts)
   - Get familiar with basic disposable email detection
   - Understand the core concepts

2. **Add DNS Validation:** [02-dns-validation.ts](./02-dns-validation.ts)
   - Learn about MX records and domain validation
   - Understand SPF and DMARC

3. **Explore SMTP:** [03-smtp-validation.ts](./03-smtp-validation.ts)
   - Test actual mailbox deliverability
   - Understand SMTP response codes

4. **Scale Up:** [04-batch-processing.ts](./04-batch-processing.ts)
   - Process multiple emails efficiently
   - Learn batch optimization techniques

5. **Fine-Tune:** [05-advanced-configuration.ts](./05-advanced-configuration.ts)
   - Configure the SDK for your specific needs
   - Optimize for your use case

6. **Optimize:** [06-performance-monitoring.ts](./06-performance-monitoring.ts)
   - Monitor and improve performance
   - Understand resource usage

---

## 💡 Common Use Cases

### Form Validation
```typescript
import { DisposableEmailChecker } from '@usex/disposable-email-domains';

const checker = new DisposableEmailChecker();
const result = await checker.checkEmail(userEmail);

if (result.isDisposable) {
  throw new Error('Disposable email addresses are not allowed');
}
```

### Batch User Import
```typescript
const checker = new DisposableEmailChecker({
  enableCaching: true,
  enableIndexing: true,
});

const results = await checker.checkEmailsBatch(emailList);
const validEmails = results.filter(r => !r.isDisposable);
```

### High-Security Validation
```typescript
const checker = new DisposableEmailChecker({
  strictValidation: true,
  checkMxRecord: true,
  checkSmtpDeliverability: true,
  dnsValidation: {
    checkSpfRecord: true,
    checkDmarcRecord: true,
  },
});
```

---

## 🔧 Configuration Templates

### Development/Testing
```typescript
const checker = new DisposableEmailChecker({
  strictValidation: false,
  checkMxRecord: false,
  enableCaching: true,
  enableIndexing: true,
});
```

### Production - Balanced
```typescript
const checker = new DisposableEmailChecker({
  strictValidation: false,
  checkMxRecord: true,
  enableCaching: true,
  cacheSize: 10000,
  enableIndexing: true,
  indexingStrategy: 'hybrid',
  dnsValidation: {
    timeout: 5000,
    retries: 3,
    enableCaching: true,
  },
});
```

### Production - Maximum Security
```typescript
const checker = new DisposableEmailChecker({
  strictValidation: true,
  checkMxRecord: true,
  checkSmtpDeliverability: true,
  enableSubdomainChecking: true,
  enablePatternMatching: true,
  enableCaching: true,
  cacheSize: 10000,
  dnsValidation: {
    timeout: 5000,
    retries: 3,
    validateMxConnectivity: true,
    checkSpfRecord: true,
    checkDmarcRecord: true,
  },
  smtpValidation: {
    timeout: 10000,
    retries: 2,
  },
});
```

---

## 📊 Performance Benchmarks

Based on the examples in [06-performance-monitoring.ts](./06-performance-monitoring.ts):

| Configuration | Throughput | Use Case |
|--------------|------------|----------|
| Minimal (no cache/index) | ~50-100 emails/sec | Development |
| With Caching | ~200-500 emails/sec | Standard validation |
| With Indexing | ~300-800 emails/sec | Large-scale processing |
| Full Optimization | ~500-1000 emails/sec | Production |

*Benchmarks may vary based on hardware and network conditions*

---

## 🛠️ Troubleshooting

### SMTP Validation Issues
If SMTP validation fails or times out:
- Some mail servers block SMTP validation attempts
- Consider increasing timeout values
- Use SMTP validation sparingly or disable for initial validation
- Implement retry logic with exponential backoff

### DNS Validation Issues
If DNS validation is slow:
- Increase DNS cache size
- Adjust concurrency settings
- Use custom DNS servers
- Consider disabling SPF/DMARC checks if not needed

### Performance Issues
If validation is slow:
- Enable caching and indexing
- Use batch processing for multiple emails
- Disable SMTP validation for initial checks
- Monitor cache hit rate and adjust size

---

## 📝 Example Output

Each example includes detailed, formatted output with:
- 📧 Email indicators
- ✅ Success indicators
- ❌ Error indicators
- 🚫 Disposable indicators
- 📊 Statistics and metrics
- ⏱️ Timing information
- 🔍 Detailed validation results

---

## 🤝 Contributing

Have a useful example or use case? Feel free to contribute!

1. Create your example file following the naming convention
2. Include comprehensive comments and documentation
3. Add it to this README
4. Submit a pull request

---

## 📚 Additional Resources

- [Main Documentation](../../README.md)
- [API Reference](../../docs/api.md)
- [GitHub Repository](https://github.com/ali-master/disposable-email-domains)
- [NPM Package](https://www.npmjs.com/package/@usex/disposable-email-domains)

---

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details
