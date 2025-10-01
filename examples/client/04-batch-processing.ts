import { DisposableEmailChecker } from "../../src/client";

/**
 * Example 4: Batch Processing
 * 
 * This example demonstrates efficient batch email validation:
 * - Basic batch validation
 * - Large-scale processing
 * - Performance optimization
 * - Progress tracking
 * - Error handling in batches
 */

// ============================================================================
// Basic Batch Validation
// ============================================================================

async function basicBatchValidation() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 4.1: Basic Batch Validation                  ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker();

  const emails = [
    "user1@gmail.com",
    "temp1@10minutemail.com",
    "alice@outlook.com",
    "test@guerrillamail.com",
    "bob@yahoo.com",
    "disposable@tempmail.org",
  ];

  console.log(`📦 Processing batch of ${emails.length} emails:\n`);

  const startTime = Date.now();
  const results = await checker.checkEmailsBatch(emails);
  const endTime = Date.now();

  console.log("📊 Results:\n");

  results.forEach((result, index) => {
    const statusIcon = result.isDisposable ? "🚫" : "✅";
    console.log(`${index + 1}. ${statusIcon} ${result.email}`);
    console.log(`   Valid: ${result.isValid}, Disposable: ${result.isDisposable}`);
    console.log(`   Confidence: ${result.confidence}%, Time: ${result.validationTime}ms`);
  });

  console.log(`\n⏱️  Total processing time: ${endTime - startTime}ms`);
  console.log(`   Average per email: ${((endTime - startTime) / emails.length).toFixed(2)}ms`);
}

// ============================================================================
// Large-Scale Batch Processing
// ============================================================================

async function largeScaleBatch() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 4.2: Large-Scale Batch Processing            ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker({
    enableCaching: true,
    enableIndexing: true,
  });

  // Generate a larger list of test emails
  const domains = [
    "gmail.com", "outlook.com", "yahoo.com",
    "10minutemail.com", "tempmail.org", "guerrillamail.com",
    "hotmail.com", "icloud.com",
  ];

  const emails: string[] = [];
  for (let i = 0; i < 50; i++) {
    const domain = domains[i % domains.length];
    emails.push(`user${i}@${domain}`);
  }

  console.log(`📦 Processing ${emails.length} emails in batch:\n`);
  console.log("⏳ Starting batch validation...\n");

  const startTime = Date.now();
  const results = await checker.checkEmailsBatch(emails);
  const endTime = Date.now();

  // Analyze results
  let validCount = 0;
  let disposableCount = 0;
  let legitimateCount = 0;

  results.forEach(result => {
    if (result.isValid) validCount++;
    if (result.isDisposable) disposableCount++;
    if (result.isValid && !result.isDisposable) legitimateCount++;
  });

  console.log("✅ Batch processing completed!\n");
  console.log("📈 Summary Statistics:");
  console.log(`   Total emails processed: ${emails.length}`);
  console.log(`   Valid format: ${validCount} (${((validCount / emails.length) * 100).toFixed(1)}%)`);
  console.log(`   Disposable detected: ${disposableCount} (${((disposableCount / emails.length) * 100).toFixed(1)}%)`);
  console.log(`   Legitimate emails: ${legitimateCount} (${((legitimateCount / emails.length) * 100).toFixed(1)}%)`);
  console.log(`\n⏱️  Performance Metrics:`);
  console.log(`   Total time: ${endTime - startTime}ms`);
  console.log(`   Average per email: ${((endTime - startTime) / emails.length).toFixed(2)}ms`);
  console.log(`   Throughput: ${(emails.length / ((endTime - startTime) / 1000)).toFixed(2)} emails/sec`);
}

// ============================================================================
// Batch with Progress Tracking
// ============================================================================

async function batchWithProgress() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 4.3: Batch Processing with Progress          ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker();

  const emails = Array.from({ length: 20 }, (_, i) => 
    `user${i}@${i % 2 === 0 ? 'gmail.com' : '10minutemail.com'}`
  );

  console.log(`📦 Processing ${emails.length} emails with progress tracking:\n`);

  const chunkSize = 5;
  const results: any[] = [];
  let processed = 0;

  for (let i = 0; i < emails.length; i += chunkSize) {
    const chunk = emails.slice(i, i + chunkSize);
    const chunkResults = await checker.checkEmailsBatch(chunk);
    results.push(...chunkResults);
    
    processed += chunk.length;
    const progress = ((processed / emails.length) * 100).toFixed(0);
    const progressBar = "█".repeat(Math.floor(processed / emails.length * 20)) + 
                        "░".repeat(20 - Math.floor(processed / emails.length * 20));
    
    console.log(`   [${progressBar}] ${progress}% (${processed}/${emails.length})`);
  }

  console.log("\n✅ Processing complete!");

  // Summary
  const disposableCount = results.filter(r => r.isDisposable).length;
  console.log(`\n📊 Results: ${disposableCount} disposable, ${results.length - disposableCount} legitimate`);
}

// ============================================================================
// Batch with DNS Validation
// ============================================================================

async function batchWithDns() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 4.4: Batch Processing with DNS Validation    ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker({
    checkMxRecord: true,
    dnsValidation: {
      timeout: 5000,
      retries: 2,
      concurrency: 10,
      enableCaching: true,
    },
  });

  const emails = [
    "user1@gmail.com",
    "user2@outlook.com",
    "test@nonexistent-domain-xyz.com",
    "admin@yahoo.com",
    "temp@10minutemail.com",
  ];

  console.log(`📦 Validating ${emails.length} emails with DNS checks:\n`);

  const startTime = Date.now();
  const results = await checker.checkEmailsBatch(emails);
  const endTime = Date.now();

  console.log("📊 Detailed Results:\n");

  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.email}`);
    console.log(`   Valid: ${result.isValid ? "✅" : "❌"}`);
    console.log(`   Disposable: ${result.isDisposable ? "🚫 Yes" : "✅ No"}`);
    
    if (result.dnsValidation) {
      console.log(`   DNS: MX=${result.dnsValidation.hasMx ? "✅" : "❌"} (${result.dnsValidation.mxRecords.length} records)`);
    }
    console.log("");
  });

  console.log(`⏱️  Total time: ${endTime - startTime}ms`);
}

// ============================================================================
// Batch with SMTP Validation
// ============================================================================

async function batchWithSmtp() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 4.5: Batch Processing with SMTP Validation   ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker({
    checkMxRecord: true,
    checkSmtpDeliverability: true,
    smtpValidation: {
      timeout: 8000,
      retries: 1,
    },
  });

  const emails = [
    "user@gmail.com",
    "test@outlook.com",
    "temp@10minutemail.com",
  ];

  console.log(`📦 Validating ${emails.length} emails with SMTP checks:\n`);
  console.log("⚠️  Note: SMTP validation may take longer and some servers may block it.\n");

  const startTime = Date.now();
  const results = await checker.checkEmailsBatch(emails);
  const endTime = Date.now();

  console.log("📊 Results:\n");

  let deliverableCount = 0;

  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.email}`);
    console.log(`   Format Valid: ${result.isValid ? "✅" : "❌"}`);
    console.log(`   Disposable: ${result.isDisposable ? "🚫 Yes" : "✅ No"}`);
    
    if (result.smtpValidation) {
      console.log(`   SMTP Deliverable: ${result.smtpValidation.isDeliverable ? "✅ Yes" : "❌ No"}`);
      if (result.smtpValidation.isDeliverable) deliverableCount++;
    }
    console.log("");
  });

  console.log(`📈 Summary:`);
  console.log(`   Total: ${emails.length}`);
  console.log(`   Deliverable: ${deliverableCount}`);
  console.log(`   Processing time: ${endTime - startTime}ms`);
}

// ============================================================================
// Error Handling in Batch Processing
// ============================================================================

async function batchErrorHandling() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 4.6: Batch Error Handling                    ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker();

  const emails = [
    "valid@gmail.com",
    "invalid-email",
    "test@domain.com",
    "@nodomain.com",
    "user@validomain.org",
    "",
    "another@test.com",
  ];

  console.log(`📦 Processing ${emails.length} emails (including invalid ones):\n`);

  try {
    const results = await checker.checkEmailsBatch(emails);

    console.log("📊 Results:\n");

    let validCount = 0;
    let invalidCount = 0;
    let disposableCount = 0;

    results.forEach((result, index) => {
      const statusIcon = result.isValid ? "✅" : "❌";
      console.log(`${index + 1}. ${statusIcon} "${result.email || '(empty)'}"`);
      
      if (result.isValid) {
        validCount++;
        console.log(`   Status: Valid${result.isDisposable ? " (Disposable)" : ""}`);
        if (result.isDisposable) disposableCount++;
      } else {
        invalidCount++;
        console.log(`   Status: Invalid`);
        if (result.errors.length > 0) {
          console.log(`   Errors: ${result.errors.join(", ")}`);
        }
      }
      console.log("");
    });

    console.log("📈 Summary:");
    console.log(`   Total processed: ${results.length}`);
    console.log(`   Valid: ${validCount}`);
    console.log(`   Invalid: ${invalidCount}`);
    console.log(`   Disposable: ${disposableCount}`);

  } catch (error) {
    console.error(`💥 Batch processing error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// ============================================================================
// Performance Comparison: Sequential vs Batch
// ============================================================================

async function performanceComparison() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 4.7: Performance Comparison                  ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker({
    enableCaching: true,
  });

  const emails = [
    "user1@gmail.com",
    "user2@outlook.com",
    "test1@10minutemail.com",
    "user3@yahoo.com",
    "test2@tempmail.org",
    "user4@hotmail.com",
  ];

  // Sequential processing
  console.log("1️⃣  Sequential Processing:");
  const seqStart = Date.now();
  for (const email of emails) {
    await checker.checkEmail(email);
  }
  const seqEnd = Date.now();
  const seqTime = seqEnd - seqStart;
  console.log(`   Time: ${seqTime}ms\n`);

  // Clear cache for fair comparison
  checker.clearCache();

  // Batch processing
  console.log("2️⃣  Batch Processing:");
  const batchStart = Date.now();
  await checker.checkEmailsBatch(emails);
  const batchEnd = Date.now();
  const batchTime = batchEnd - batchStart;
  console.log(`   Time: ${batchTime}ms\n`);

  // Comparison
  const speedup = ((seqTime - batchTime) / seqTime * 100).toFixed(1);
  console.log("📊 Performance Analysis:");
  console.log(`   Sequential: ${seqTime}ms`);
  console.log(`   Batch: ${batchTime}ms`);
  console.log(`   Speedup: ${speedup}% faster with batch processing`);
  console.log(`   Sequential avg: ${(seqTime / emails.length).toFixed(2)}ms per email`);
  console.log(`   Batch avg: ${(batchTime / emails.length).toFixed(2)}ms per email`);
}

// ============================================================================
// Main Execution
// ============================================================================

async function runAllExamples() {
  console.log("\n🚀 Batch Processing Examples");
  console.log("=" .repeat(60));

  try {
    await basicBatchValidation();
    await largeScaleBatch();
    await batchWithProgress();
    await batchWithDns();
    await batchWithSmtp();
    await batchErrorHandling();
    await performanceComparison();

    console.log("\n✅ All batch processing examples completed!");
    console.log("=" .repeat(60) + "\n");
  } catch (error) {
    console.error("\n❌ Error running examples:", error);
    process.exit(1);
  }
}

// Export functions for selective usage
export {
  basicBatchValidation,
  largeScaleBatch,
  batchWithProgress,
  batchWithDns,
  batchWithSmtp,
  batchErrorHandling,
  performanceComparison,
  runAllExamples,
};

// Run all examples if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples().catch(console.error);
}
