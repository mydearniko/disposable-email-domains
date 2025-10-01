import { SmtpValidator, EmailValidator } from "../../src/client";

/**
 * Example 3: SMTP Validation
 * 
 * This example demonstrates SMTP-based email deliverability testing:
 * - Standalone SMTP validation
 * - Mailbox verification
 * - Server response analysis
 * - Batch SMTP testing
 * - Error handling for SMTP connections
 */

// ============================================================================
// Basic SMTP Validation
// ============================================================================

async function basicSmtpValidation() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 3.1: Basic SMTP Validation                   ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  // Initialize SMTP validator with custom configuration
  const smtpValidator = new SmtpValidator({
    timeout: 10000,
    port: 25,
    fromEmail: "verify@yourdomain.com",
    helo: "mail.yourdomain.com",
  });

  const email = "test@gmail.com";

  console.log(`📧 Testing SMTP deliverability for: ${email}\n`);

  try {
    const result = await smtpValidator.validateEmail(email);

    console.log("📊 SMTP Validation Results:");
    console.log(`   Email: ${result.email}`);
    console.log(`   Domain: ${result.domain}`);
    console.log(`   Is Valid: ${result.isValid ? "✅ Yes" : "❌ No"}`);
    console.log(`   Mailbox Valid: ${result.isMailboxValid ? "✅ Yes" : "❌ No"}`);
    console.log(`   MX Server: ${result.mxRecord || "N/A"}`);
    console.log(`   Response Code: ${result.responseCode || "N/A"}`);
    console.log(`   Response Message: ${result.responseMessage || "N/A"}`);
    console.log(`   Validation Time: ${result.validationTime}ms`);

    if (result.errors.length > 0) {
      console.log(`\n   ❌ Errors:`);
      result.errors.forEach(error => console.log(`      - ${error}`));
    }

    if (result.warnings.length > 0) {
      console.log(`\n   ⚠️  Warnings:`);
      result.warnings.forEach(warning => console.log(`      - ${warning}`));
    }

  } catch (error) {
    console.error(`   💥 Error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// ============================================================================
// Multiple Email SMTP Testing
// ============================================================================

async function multipleSmtpTests() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 3.2: Testing Multiple Emails via SMTP        ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const smtpValidator = new SmtpValidator({
    timeout: 8000,
    retries: 2,
    fromEmail: "verify@yourdomain.com",
    helo: "mail.yourdomain.com",
  });

  const testEmails = [
    "valid.user@gmail.com",
    "nonexistent.user.xyz123@gmail.com",
    "test@fakefakedomaindoesnotexist.com",
  ];

  console.log("🔍 Testing email deliverability:\n");

  for (const email of testEmails) {
    console.log(`📧 ${email}`);
    
    try {
      const result = await smtpValidator.validateEmail(email);

      const statusIcon = result.isMailboxValid ? "✅" : "❌";
      const status = result.isMailboxValid ? "DELIVERABLE" : "NOT DELIVERABLE";
      
      console.log(`   ${statusIcon} Status: ${status}`);
      console.log(`   Response: [${result.responseCode}] ${result.responseMessage || "N/A"}`);
      console.log(`   Server: ${result.mxRecord || "N/A"}`);
      console.log(`   Time: ${result.validationTime}ms`);

    } catch (error) {
      console.log(`   💥 Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
    console.log("");
  }
}

// ============================================================================
// SMTP Response Code Analysis
// ============================================================================

async function smtpResponseAnalysis() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 3.3: SMTP Response Code Analysis             ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const smtpValidator = new SmtpValidator({
    timeout: 10000,
    fromEmail: "verify@example.com",
    helo: "mail.example.com",
  });

  const testCases = [
    { email: "user@gmail.com", expectedCode: 250 },
    { email: "test@nonexistentxyz123.com", expectedCode: null },
  ];

  console.log("🔬 Analyzing SMTP response codes:\n");

  for (const testCase of testCases) {
    console.log(`📧 Testing: ${testCase.email}`);
    
    try {
      const result = await smtpValidator.validateEmail(testCase.email);

      console.log(`   Response Code: ${result.responseCode || "N/A"}`);
      console.log(`   Message: ${result.responseMessage || "N/A"}`);

      // Explain response codes
      if (result.responseCode) {
        if (result.responseCode === 250) {
          console.log(`   ✅ Code 250: Mailbox exists and can receive email`);
        } else if (result.responseCode >= 400 && result.responseCode < 500) {
          console.log(`   ⚠️  Code ${result.responseCode}: Temporary failure, retry may succeed`);
        } else if (result.responseCode >= 500) {
          console.log(`   ❌ Code ${result.responseCode}: Permanent failure, mailbox doesn't exist`);
        }
      } else {
        console.log(`   ⚠️  No response code: Server may be unreachable or blocking validation`);
      }

    } catch (error) {
      console.log(`   💥 Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
    console.log("");
  }
}

// ============================================================================
// SMTP with Custom Configuration
// ============================================================================

async function customSmtpConfiguration() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 3.4: Custom SMTP Configuration               ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  console.log("📝 Configuring SMTP validator with custom settings:\n");

  const smtpValidator = new SmtpValidator({
    timeout: 15000,              // 15 second timeout
    port: 25,                    // Standard SMTP port
    fromEmail: "noreply@yourdomain.com",  // Your sender email
    helo: "mail.yourdomain.com", // Your mail server hostname
    retries: 3,                  // Retry up to 3 times
    enableCaching: true,         // Enable result caching
    cacheSize: 1000,             // Cache up to 1000 results
    cacheTtl: 600000,            // Cache for 10 minutes
  });

  console.log("   ⚙️  Configuration:");
  console.log(`      Timeout: 15000ms`);
  console.log(`      Port: 25`);
  console.log(`      From Email: noreply@yourdomain.com`);
  console.log(`      HELO: mail.yourdomain.com`);
  console.log(`      Retries: 3`);
  console.log(`      Caching: Enabled (1000 entries, 10min TTL)`);

  const email = "test@outlook.com";

  console.log(`\n🔍 Testing with custom configuration: ${email}\n`);

  const result = await smtpValidator.validateEmail(email);

  console.log("📊 Results:");
  console.log(`   Valid: ${result.isValid ? "✅" : "❌"}`);
  console.log(`   Deliverable: ${result.isMailboxValid ? "✅" : "❌"}`);
  console.log(`   Time: ${result.validationTime}ms`);

  // Get validator statistics
  const stats = smtpValidator.getStats();
  console.log(`\n📈 Validator Stats:`);
  console.log(`   Cache size: ${stats.cacheSize}`);
  console.log(`   Active requests: ${stats.activeRequests}`);
  console.log(`   Cache hit rate: ${(stats.cacheHitRate * 100).toFixed(1)}%`);
}

// ============================================================================
// Combined Email Validator (DNS + SMTP)
// ============================================================================

async function combinedEmailValidation() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 3.5: Combined Email Validation (DNS+SMTP)    ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  // EmailValidator provides both DNS and SMTP validation
  const emailValidator = new EmailValidator(
    false, // not strict
    {
      timeout: 5000,
      retries: 3,
      validateMxConnectivity: true,
    },
    {
      timeout: 10000,
      port: 25,
      fromEmail: "verify@yourdomain.com",
      helo: "mail.yourdomain.com",
    }
  );

  const email = "user@gmail.com";

  console.log(`🔍 Performing comprehensive validation for: ${email}\n`);

  try {
    const result = await emailValidator.validateEmailDeliverability(email);

    console.log("📊 Comprehensive Validation Results:");
    console.log(`   Email: ${result.email}`);
    console.log(`   Overall Valid: ${result.overallValid ? "✅ Yes" : "❌ No"}`);

    console.log(`\n   🌐 DNS Validation:`);
    console.log(`      Has MX: ${result.dnsValidation.hasMx ? "✅" : "❌"}`);
    console.log(`      MX Records: ${result.dnsValidation.mxRecords.length}`);
    if (result.dnsValidation.mxRecords.length > 0) {
      console.log(`      Primary MX: ${result.dnsValidation.mxRecords[0].exchange}`);
    }
    console.log(`      Is Connectable: ${result.dnsValidation.isConnectable ? "✅" : "❌"}`);
    console.log(`      DNS Time: ${result.dnsValidation.validationTime}ms`);

    if (result.smtpValidation) {
      console.log(`\n   📨 SMTP Validation:`);
      console.log(`      Is Valid: ${result.smtpValidation.isValid ? "✅" : "❌"}`);
      console.log(`      Mailbox Valid: ${result.smtpValidation.isMailboxValid ? "✅" : "❌"}`);
      console.log(`      Response: [${result.smtpValidation.responseCode}] ${result.smtpValidation.responseMessage}`);
      console.log(`      Server: ${result.smtpValidation.mxRecord}`);
      console.log(`      SMTP Time: ${result.smtpValidation.validationTime}ms`);
    }

  } catch (error) {
    console.error(`   💥 Error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// ============================================================================
// Batch SMTP Validation
// ============================================================================

async function batchSmtpValidation() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 3.6: Batch SMTP Validation                   ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const emailValidator = new EmailValidator(
    false,
    { timeout: 5000, retries: 2 },
    { timeout: 8000, retries: 1 }
  );

  const emails = [
    "user1@gmail.com",
    "user2@outlook.com",
    "test@yahoo.com",
    "admin@microsoft.com",
  ];

  console.log(`📦 Validating ${emails.length} emails in batch:\n`);

  const startTime = Date.now();
  const results = await emailValidator.validateSmtpDeliverabilityBatch(emails);
  const endTime = Date.now();

  console.log(`✅ Batch validation completed in ${endTime - startTime}ms\n`);
  console.log("📊 Results:\n");

  let deliverableCount = 0;

  results.forEach((result, email) => {
    const statusIcon = result.isMailboxValid ? "✅" : "❌";
    console.log(`${statusIcon} ${email}`);
    console.log(`   Deliverable: ${result.isMailboxValid ? "Yes" : "No"}`);
    console.log(`   Response: [${result.responseCode}] ${result.responseMessage || "N/A"}`);
    console.log(`   Time: ${result.validationTime}ms`);
    console.log("");

    if (result.isMailboxValid) deliverableCount++;
  });

  console.log("📈 Summary:");
  console.log(`   Total emails: ${emails.length}`);
  console.log(`   Deliverable: ${deliverableCount}`);
  console.log(`   Not deliverable: ${emails.length - deliverableCount}`);
  console.log(`   Total time: ${endTime - startTime}ms`);
  console.log(`   Average per email: ${((endTime - startTime) / emails.length).toFixed(2)}ms`);
}

// ============================================================================
// Error Handling and Edge Cases
// ============================================================================

async function smtpErrorHandling() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 3.7: SMTP Error Handling                     ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const smtpValidator = new SmtpValidator({
    timeout: 5000,
    retries: 1,
  });

  const edgeCases = [
    { email: "valid@gmail.com", description: "Valid email" },
    { email: "test@nonexistent-domain-xyz123.com", description: "Non-existent domain" },
    { email: "invalid-email", description: "Invalid format" },
    { email: "test@localhost", description: "Local domain" },
  ];

  console.log("🛡️  Testing error handling with edge cases:\n");

  for (const testCase of edgeCases) {
    console.log(`📧 ${testCase.description}: ${testCase.email}`);
    
    try {
      const result = await smtpValidator.validateEmail(testCase.email);

      console.log(`   Valid: ${result.isValid ? "✅" : "❌"}`);
      console.log(`   Deliverable: ${result.isMailboxValid ? "✅" : "❌"}`);

      if (result.errors.length > 0) {
        console.log(`   Errors: ${result.errors.join(", ")}`);
      }

      if (result.warnings.length > 0) {
        console.log(`   Warnings: ${result.warnings.join(", ")}`);
      }

    } catch (error) {
      console.log(`   💥 Exception: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
    console.log("");
  }
}

// ============================================================================
// Main Execution
// ============================================================================

async function runAllExamples() {
  console.log("\n🚀 SMTP Validation Examples");
  console.log("=" .repeat(60));

  try {
    await basicSmtpValidation();
    await multipleSmtpTests();
    await smtpResponseAnalysis();
    await customSmtpConfiguration();
    await combinedEmailValidation();
    await batchSmtpValidation();
    await smtpErrorHandling();

    console.log("\n✅ All SMTP validation examples completed!");
    console.log("=" .repeat(60) + "\n");
  } catch (error) {
    console.error("\n❌ Error running examples:", error);
    process.exit(1);
  }
}

// Export functions for selective usage
export {
  basicSmtpValidation,
  multipleSmtpTests,
  smtpResponseAnalysis,
  customSmtpConfiguration,
  combinedEmailValidation,
  batchSmtpValidation,
  smtpErrorHandling,
  runAllExamples,
};

// Run all examples if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples().catch(console.error);
}
