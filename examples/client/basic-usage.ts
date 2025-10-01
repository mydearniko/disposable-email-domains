import { DisposableEmailChecker, EmailValidator, SmtpValidator } from "../../src/client";

/**
 * Basic Usage Examples for Disposable Email Domains SDK
 * 
 * ⚠️  NOTE: This is a comprehensive all-in-one example file.
 * For better learning experience, check out the organized examples in separate files:
 * 
 * 📚 Recommended Examples:
 *   - 01-basic-checking.ts       → Simple disposable email detection
 *   - 02-dns-validation.ts       → DNS/MX record validation
 *   - 03-smtp-validation.ts      → SMTP deliverability testing
 *   - 04-batch-processing.ts     → Batch operations & performance
 *   - 05-advanced-configuration.ts → Advanced configuration options
 *   - 06-performance-monitoring.ts → Performance & optimization
 * 
 * 📖 See examples/client/README.md for detailed documentation
 * 
 * This file includes SMTP validation examples and comprehensive usage patterns.
 */

// =============================================================================
// 1. BASIC DISPOSABLE EMAIL CHECKING
// =============================================================================

async function basicDisposableCheck() {
  console.log("\n🔍 Basic Disposable Email Checking");
  console.log("=====================================");

  const checker = new DisposableEmailChecker();

  const emails = [
    "user@gmail.com",
    "test@10minutemail.com",
    "admin@tempmail.org",
    "contact@company.com",
  ];

  for (const email of emails) {
    const result = await checker.checkEmail(email);
    console.log(`📧 ${email}`);
    console.log(`   Valid: ${result.isValid}`);
    console.log(`   Disposable: ${result.isDisposable}`);
    console.log(`   Confidence: ${result.confidence}%`);
    console.log(`   Match Type: ${result.matchType}`);
    console.log("");
  }
}

// =============================================================================
// 2. STANDALONE SMTP VALIDATOR USAGE
// =============================================================================

async function standaloneSmtpValidation() {
  console.log("\n📨 Standalone SMTP Validation");
  console.log("===============================");

  // Initialize SMTP validator with custom configuration
  const smtpValidator = new SmtpValidator({
    timeout: 10000,
    port: 25,
    fromEmail: "test@yourdomain.com",
    helo: "mail.yourdomain.com",
  });

  const emails = [
    "real.user@gmail.com",
    "nonexistent@gmail.com",
    "test@fakefakedomaindoesnotexist.com",
  ];

  console.log("Testing email deliverability via SMTP...\n");

  for (const email of emails) {
    try {
      const result = await smtpValidator.validateEmail(email);

      console.log(`📧 ${email}`);
      console.log(`   SMTP Valid: ${result.isValid}`);
      console.log(`   Deliverable: ${result.isMailboxValid}`);
      console.log(`   Response Code: ${result.responseCode || "N/A"}`);
      console.log(`   Server Response: ${result.responseMessage || "N/A"}`);
      console.log(`   Validation Time: ${result.validationTime}ms`);

      if (result.errors.length > 0) {
        console.log(`   Errors: ${result.errors.join(", ")}`);
      }

      if (result.warnings.length > 0) {
        console.log(`   Warnings: ${result.warnings.join(", ")}`);
      }

      console.log("");
    } catch (error) {
      console.log(
        `📧 ${email} - Error: ${error instanceof Error ? error.message : "Unknown error"}\n`,
      );
    }
  }
}

// =============================================================================
// 3. DNS + SMTP VALIDATION WITH EMAIL VALIDATOR
// =============================================================================

async function dnsAndSmtpValidation() {
  console.log("\n🌐 Combined DNS + SMTP Validation");
  console.log("===================================");

  // Initialize EmailValidator with both DNS and SMTP configuration
  const emailValidator = new EmailValidator(
    false, // strict validation
    {
      timeout: 5000,
      retries: 2,
      validateMxConnectivity: true,
      checkSpfRecord: true,
      checkDmarcRecord: true,
    },
    {
      timeout: 8000,
      port: 25,
      fromEmail: "test@yourdomain.com",
      helo: "mail.yourdomain.com",
    },
  );

  const testEmails = ["valid@gmail.com", "test@microsoft.com", "fake@nonexistentdomain12345.com"];

  for (const email of testEmails) {
    try {
      console.log(`🔍 Validating: ${email}`);

      const result = await emailValidator.validateEmailDeliverability(email);

      console.log(`   Overall Valid: ${result.overallValid}`);

      // DNS Validation Results
      console.log(`   DNS Results:`);
      console.log(`     Has MX: ${result.dnsValidation.hasMx}`);
      console.log(`     MX Records: ${result.dnsValidation.mxRecords.length}`);
      console.log(`     Has SPF: ${result.dnsValidation.hasSpf}`);
      console.log(`     Has DMARC: ${result.dnsValidation.hasDmarc}`);
      console.log(`     Is Connectable: ${result.dnsValidation.isConnectable}`);

      // SMTP Validation Results (if available)
      if (result.smtpValidation) {
        console.log(`   SMTP Results:`);
        console.log(`     Is Valid: ${result.smtpValidation.isValid}`);
        console.log(`     Is Deliverable: ${result.smtpValidation.isMailboxValid}`);
        console.log(`     Response Code: ${result.smtpValidation.responseCode || "N/A"}`);
        console.log(`     Server Tested: ${result.smtpValidation.mxRecord || "N/A"}`);
      }

      console.log("");
    } catch (error) {
      console.log(`   Error: ${error instanceof Error ? error.message : "Unknown error"}\n`);
    }
  }
}

// =============================================================================
// 4. DISPOSABLE EMAIL CHECKER WITH SMTP VALIDATION
// =============================================================================

async function disposableCheckerWithSmtp() {
  console.log("\n🛡️ Disposable Email Checker with SMTP Validation");
  console.log("==================================================");

  // Initialize with comprehensive configuration including SMTP
  const checker = new DisposableEmailChecker({
    strictValidation: false,
    checkMxRecord: true,
    checkSmtpDeliverability: true,
    enableSubdomainChecking: true,
    enablePatternMatching: true,

    // DNS validation configuration
    dnsValidation: {
      timeout: 5000,
      retries: 3,
      enableCaching: true,
      cacheSize: 5000,
      cacheTtl: 300000, // 5 minutes
      validateMxConnectivity: true,
      checkSpfRecord: true,
      checkDmarcRecord: true,
    },

    // SMTP validation configuration
    smtpValidation: {
      timeout: 10000,
      port: 25,
      fromEmail: "test@yourdomain.com",
      helo: "mail.yourdomain.com",
      retries: 2,
      enableCaching: true,
      cacheSize: 1000,
      cacheTtl: 600000, // 10 minutes
    },

    // Performance optimization
    enableCaching: true,
    cacheSize: 10000,
    enableIndexing: true,
    indexingStrategy: "hybrid",
  });

  const testEmails = [
    "user@gmail.com", // Valid email
    "test@10minutemail.com", // Disposable email
    "admin@tempmail.org", // Disposable email
    "contact@microsoft.com", // Valid corporate email
    "fake@nonexistent123.com", // Invalid domain
    "test@guerrillamail.com", // Disposable email
  ];

  console.log("Comprehensive email validation with disposable checking and SMTP verification...\n");

  for (const email of testEmails) {
    try {
      const result = await checker.checkEmail(email);

      console.log(`📧 ${email}`);
      console.log(`   ✅ Valid Format: ${result.isValid}`);
      console.log(`   🚫 Is Disposable: ${result.isDisposable}`);
      console.log(`   ✅ Is Allowed: ${result.isAllowed}`);
      console.log(`   🚫 Is Blacklisted: ${result.isBlacklisted}`);
      console.log(`   🎯 Confidence: ${result.confidence}%`);
      console.log(`   🔍 Match Type: ${result.matchType}`);
      console.log(`   ⏱️ Validation Time: ${result.validationTime.toFixed(2)}ms`);

      // DNS validation details
      if (result.dnsValidation) {
        console.log(`   🌐 DNS Validation:`);
        console.log(`     Has MX: ${result.dnsValidation.hasMx}`);
        console.log(`     MX Records: ${result.dnsValidation.mxRecords.length}`);
        if (result.dnsValidation.mxRecords.length > 0) {
          result.dnsValidation.mxRecords.forEach((mx) => {
            console.log(`       - ${mx.exchange} (priority: ${mx.priority})`);
          });
        }
        console.log(`     Has SPF: ${result.dnsValidation.hasSpf}`);
        console.log(`     Has DMARC: ${result.dnsValidation.hasDmarc}`);
        console.log(`     Is Connectable: ${result.dnsValidation.isConnectable}`);
      }

      // SMTP validation details
      if (result.smtpValidation) {
        console.log(`   📨 SMTP Validation:`);
        console.log(`     Is Valid: ${result.smtpValidation.isValid}`);
        console.log(`     Is Deliverable: ${result.smtpValidation.isDeliverable}`);
        console.log(`     Response Code: ${result.smtpValidation.responseCode || "N/A"}`);
        console.log(`     Server Tested: ${result.smtpValidation.serverTested || "N/A"}`);
        console.log(`     SMTP Time: ${result.smtpValidation.smtpValidationTime}ms`);
      }

      // Warnings and errors
      if (result.warnings.length > 0) {
        console.log(`   ⚠️ Warnings: ${result.warnings.join(", ")}`);
      }

      if (result.errors.length > 0) {
        console.log(`   ❌ Errors: ${result.errors.join(", ")}`);
      }

      console.log("");
    } catch (error) {
      console.log(
        `📧 ${email} - Error: ${error instanceof Error ? error.message : "Unknown error"}\n`,
      );
    }
  }
}

// =============================================================================
// 5. BATCH PROCESSING WITH SMTP
// =============================================================================

async function batchProcessingWithSmtp() {
  console.log("\n📦 Batch Processing with SMTP Validation");
  console.log("==========================================");

  const checker = new DisposableEmailChecker({
    checkMxRecord: true,
    checkSmtpDeliverability: true,
    smtpValidation: {
      timeout: 8000,
      retries: 1,
    },
  });

  const emailBatch = [
    "user1@gmail.com",
    "user2@outlook.com",
    "temp@10minutemail.com",
    "test@guerrillamail.com",
    "contact@microsoft.com",
    "fake@nonexistent.com",
  ];

  console.log(`Processing batch of ${emailBatch.length} emails...\n`);

  const startTime = Date.now();
  const results = await checker.checkEmailsBatch(emailBatch);
  const endTime = Date.now();

  console.log(`Batch processing completed in ${endTime - startTime}ms\n`);

  // Summary statistics
  let validCount = 0;
  let disposableCount = 0;
  let deliverableCount = 0;

  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.email}`);
    console.log(`   Valid: ${result.isValid}, Disposable: ${result.isDisposable}`);

    if (result.smtpValidation) {
      console.log(`   Deliverable: ${result.smtpValidation.isDeliverable}`);
      if (result.smtpValidation.isDeliverable) deliverableCount++;
    }

    if (result.isValid) validCount++;
    if (result.isDisposable) disposableCount++;
    console.log("");
  });

  console.log("📊 Batch Summary:");
  console.log(`   Total emails: ${emailBatch.length}`);
  console.log(`   Valid format: ${validCount}`);
  console.log(`   Disposable detected: ${disposableCount}`);
  console.log(`   SMTP deliverable: ${deliverableCount}`);
  console.log(`   Processing time: ${endTime - startTime}ms`);
}

// =============================================================================
// 6. PERFORMANCE MONITORING
// =============================================================================

async function performanceMonitoring() {
  console.log("\n📈 Performance Monitoring");
  console.log("==========================");

  const checker = new DisposableEmailChecker({
    checkMxRecord: true,
    checkSmtpDeliverability: true,
    enableCaching: true,
  });

  // Process some emails first
  await checker.checkEmail("test@gmail.com");
  await checker.checkEmail("temp@10minutemail.com");
  await checker.checkEmail("user@outlook.com");

  // Get comprehensive statistics
  const stats = checker.getStats();

  console.log("Performance Metrics:");
  console.log(`  Total validations: ${stats.performance.totalValidations}`);
  console.log(`  Successful validations: ${stats.performance.successfulValidations}`);
  console.log(`  Disposable detected: ${stats.performance.disposableDetected}`);
  console.log(`  Average validation time: ${stats.performance.averageValidationTime.toFixed(2)}ms`);
  console.log(`  Cache hit rate: ${(stats.performance.cacheHitRate * 100).toFixed(1)}%`);

  if (stats.performance.dnsValidations) {
    console.log(`  DNS validations: ${stats.performance.dnsValidations}`);
    console.log(`  DNS success rate: ${(stats.performance.dnsSuccessRate! * 100).toFixed(1)}%`);
    console.log(`  Average DNS time: ${stats.performance.averageDnsTime?.toFixed(2)}ms`);
  }

  if (stats.performance.smtpValidations) {
    console.log(`  SMTP validations: ${stats.performance.smtpValidations}`);
    console.log(`  SMTP success rate: ${(stats.performance.smtpSuccessRate! * 100).toFixed(1)}%`);
    console.log(`  Average SMTP time: ${stats.performance.averageSmtpTime?.toFixed(2)}ms`);
  }

  console.log("\nDNS Statistics:");
  console.log(`  Cache size: ${stats.dns.cacheSize}`);
  console.log(`  Active requests: ${stats.dns.activeRequests}`);
  console.log(`  Cache hit rate: ${(stats.dns.cacheHitRate * 100).toFixed(1)}%`);

  console.log("\nSMTP Statistics:");
  console.log(`  Cache size: ${stats.smtp.cacheSize}`);
  console.log(`  Active requests: ${stats.smtp.activeRequests}`);
  console.log(`  Cache hit rate: ${(stats.smtp.cacheHitRate * 100).toFixed(1)}%`);

  // Cache statistics
  const cacheStats = await stats.cache;
  console.log("\nCache Statistics:");
  console.log(`  Cache entries: ${cacheStats.entries}`);
  console.log(`  Hit rate: ${(cacheStats.hitRate * 100).toFixed(1)}%`);
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

async function runAllExamples() {
  console.log("🚀 Disposable Email Domains SDK - Basic Usage Examples");
  console.log("========================================================");

  try {
    await basicDisposableCheck();
    await standaloneSmtpValidation();
    await dnsAndSmtpValidation();
    await disposableCheckerWithSmtp();
    await batchProcessingWithSmtp();
    await performanceMonitoring();

    console.log("\n✅ All examples completed successfully!");
  } catch (error) {
    console.error("\n❌ Error running examples:", error);
  }
}

// Export individual functions for selective usage
export {
  basicDisposableCheck,
  standaloneSmtpValidation,
  dnsAndSmtpValidation,
  disposableCheckerWithSmtp,
  batchProcessingWithSmtp,
  performanceMonitoring,
  runAllExamples,
};

// Run all examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples().catch(console.error);
}
