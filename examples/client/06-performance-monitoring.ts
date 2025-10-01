import { DisposableEmailChecker } from "../../src/client";

/**
 * Example 6: Performance Monitoring
 * 
 * This example demonstrates performance monitoring and optimization:
 * - Performance metrics tracking
 * - Cache statistics
 * - Throughput measurement
 * - Memory usage monitoring
 * - Optimization techniques
 * - Benchmarking
 */

// ============================================================================
// Basic Performance Metrics
// ============================================================================

async function basicPerformanceMetrics() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 6.1: Basic Performance Metrics               ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker({
    enableCaching: true,
    enableIndexing: true,
  });

  // Perform some validations
  const emails = [
    "user@gmail.com",
    "test@10minutemail.com",
    "admin@outlook.com",
    "temp@tempmail.org",
  ];

  console.log("🔍 Processing emails...\n");

  for (const email of emails) {
    await checker.checkEmail(email);
  }

  // Get performance statistics
  const stats = checker.getStats();

  console.log("📊 Performance Metrics:");
  console.log(`   Total Validations: ${stats.performance.totalValidations}`);
  console.log(`   Successful: ${stats.performance.successfulValidations}`);
  console.log(`   Failed: ${stats.performance.failedValidations}`);
  console.log(`   Disposable Detected: ${stats.performance.disposableDetected}`);
  console.log(`   Average Validation Time: ${stats.performance.averageValidationTime.toFixed(2)}ms`);
  console.log(`   Throughput: ${stats.performance.throughputPerSecond.toFixed(2)} emails/sec`);
  console.log(`   Cache Hit Rate: ${(stats.performance.cacheHitRate * 100).toFixed(1)}%`);
}

// ============================================================================
// Cache Performance Analysis
// ============================================================================

async function cachePerformanceAnalysis() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 6.2: Cache Performance Analysis              ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker({
    enableCaching: true,
    cacheSize: 1000,
  });

  const email = "user@gmail.com";

  console.log("🚀 Testing cache performance:\n");

  // First validation (uncached)
  console.log("1️⃣  First validation (cache miss):");
  const start1 = Date.now();
  await checker.checkEmail(email);
  const time1 = Date.now() - start1;
  console.log(`   Time: ${time1}ms\n`);

  // Second validation (cached)
  console.log("2️⃣  Second validation (cache hit):");
  const start2 = Date.now();
  await checker.checkEmail(email);
  const time2 = Date.now() - start2;
  console.log(`   Time: ${time2}ms\n`);

  // Third validation (cached)
  console.log("3️⃣  Third validation (cache hit):");
  const start3 = Date.now();
  await checker.checkEmail(email);
  const time3 = Date.now() - start3;
  console.log(`   Time: ${time3}ms\n`);

  // Get cache statistics
  const stats = checker.getStats();
  const cacheStats = await stats.cache;

  console.log("📈 Cache Statistics:");
  console.log(`   Cache Entries: ${cacheStats.entries}`);
  console.log(`   Cache Hits: ${cacheStats.hits}`);
  console.log(`   Cache Misses: ${cacheStats.misses}`);
  console.log(`   Hit Rate: ${(cacheStats.hitRate * 100).toFixed(1)}%`);
  console.log(`   Average Hit Time: ${cacheStats.averageHitTime.toFixed(2)}ms`);
  console.log(`   Average Miss Time: ${cacheStats.averageMissTime.toFixed(2)}ms`);

  const speedup = ((time1 - time2) / time1 * 100).toFixed(1);
  console.log(`\n⚡ Performance Gain: ${speedup}% faster with cache`);
}

// ============================================================================
// DNS and SMTP Statistics
// ============================================================================

async function dnsSmtpStatistics() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 6.3: DNS and SMTP Statistics                 ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker({
    checkMxRecord: true,
    checkSmtpDeliverability: false, // Disabled for faster testing
    dnsValidation: {
      timeout: 5000,
      retries: 3,
      enableCaching: true,
      checkSpfRecord: true,
      checkDmarcRecord: true,
    },
  });

  const emails = [
    "user@gmail.com",
    "test@outlook.com",
    "admin@yahoo.com",
  ];

  console.log("🔍 Validating emails with DNS checks...\n");

  for (const email of emails) {
    await checker.checkEmail(email);
  }

  const stats = checker.getStats();

  console.log("📊 Overall Performance:");
  console.log(`   Total Validations: ${stats.performance.totalValidations}`);
  console.log(`   Average Time: ${stats.performance.averageValidationTime.toFixed(2)}ms\n`);

  if (stats.performance.dnsValidations) {
    console.log("🌐 DNS Statistics:");
    console.log(`   DNS Validations: ${stats.performance.dnsValidations}`);
    console.log(`   Success Rate: ${(stats.performance.dnsSuccessRate! * 100).toFixed(1)}%`);
    console.log(`   Average DNS Time: ${stats.performance.averageDnsTime?.toFixed(2)}ms\n`);
  }

  console.log("📈 DNS Resolver Stats:");
  console.log(`   Cache Size: ${stats.dns.cacheSize}`);
  console.log(`   Active Requests: ${stats.dns.activeRequests}`);
  console.log(`   Queued Requests: ${stats.dns.queuedRequests}`);
  console.log(`   Cache Hit Rate: ${(stats.dns.cacheHitRate * 100).toFixed(1)}%`);
}

// ============================================================================
// Throughput Measurement
// ============================================================================

async function throughputMeasurement() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 6.4: Throughput Measurement                  ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker({
    enableCaching: true,
    enableIndexing: true,
  });

  // Generate test emails
  const testSizes = [10, 50, 100];

  console.log("📊 Measuring throughput for different batch sizes:\n");

  for (const size of testSizes) {
    const emails = Array.from({ length: size }, (_, i) => 
      `user${i}@${i % 2 === 0 ? 'gmail.com' : '10minutemail.com'}`
    );

    const startTime = Date.now();
    await checker.checkEmailsBatch(emails);
    const endTime = Date.now();

    const totalTime = endTime - startTime;
    const throughput = (size / (totalTime / 1000)).toFixed(2);
    const avgTime = (totalTime / size).toFixed(2);

    console.log(`📦 Batch Size: ${size} emails`);
    console.log(`   Total Time: ${totalTime}ms`);
    console.log(`   Average per email: ${avgTime}ms`);
    console.log(`   Throughput: ${throughput} emails/sec\n`);
  }

  const stats = checker.getStats();
  console.log("🎯 Overall Throughput:");
  console.log(`   ${stats.performance.throughputPerSecond.toFixed(2)} emails/sec`);
}

// ============================================================================
// Performance Comparison
// ============================================================================

async function performanceComparison() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 6.5: Performance Comparison                  ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const emails = Array.from({ length: 20 }, (_, i) => 
    `user${i}@${i % 3 === 0 ? '10minutemail.com' : 'gmail.com'}`
  );

  console.log("📊 Comparing different configurations:\n");

  // Configuration 1: Minimal (no cache, no indexing)
  console.log("1️⃣  Minimal Configuration:");
  const checker1 = new DisposableEmailChecker({
    enableCaching: false,
    enableIndexing: false,
  });
  const start1 = Date.now();
  await checker1.checkEmailsBatch(emails);
  const time1 = Date.now() - start1;
  console.log(`   Time: ${time1}ms\n`);

  // Configuration 2: With caching
  console.log("2️⃣  With Caching:");
  const checker2 = new DisposableEmailChecker({
    enableCaching: true,
    enableIndexing: false,
  });
  const start2 = Date.now();
  await checker2.checkEmailsBatch(emails);
  const time2 = Date.now() - start2;
  console.log(`   Time: ${time2}ms\n`);

  // Configuration 3: With indexing
  console.log("3️⃣  With Indexing:");
  const checker3 = new DisposableEmailChecker({
    enableCaching: false,
    enableIndexing: true,
  });
  const start3 = Date.now();
  await checker3.checkEmailsBatch(emails);
  const time3 = Date.now() - start3;
  console.log(`   Time: ${time3}ms\n`);

  // Configuration 4: Full optimization
  console.log("4️⃣  Full Optimization (Cache + Indexing):");
  const checker4 = new DisposableEmailChecker({
    enableCaching: true,
    enableIndexing: true,
  });
  const start4 = Date.now();
  await checker4.checkEmailsBatch(emails);
  const time4 = Date.now() - start4;
  console.log(`   Time: ${time4}ms\n`);

  // Comparison
  console.log("📈 Performance Comparison:");
  console.log(`   Minimal: ${time1}ms (baseline)`);
  console.log(`   With Cache: ${time2}ms (${((time1 - time2) / time1 * 100).toFixed(1)}% faster)`);
  console.log(`   With Indexing: ${time3}ms (${((time1 - time3) / time1 * 100).toFixed(1)}% faster)`);
  console.log(`   Full Optimization: ${time4}ms (${((time1 - time4) / time1 * 100).toFixed(1)}% faster)`);
}

// ============================================================================
// Real-time Monitoring
// ============================================================================

async function realTimeMonitoring() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 6.6: Real-time Performance Monitoring        ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker({
    enableCaching: true,
    enableIndexing: true,
  });

  const emails = Array.from({ length: 30 }, (_, i) => 
    `user${i}@${i % 4 === 0 ? 'tempmail.org' : 'gmail.com'}`
  );

  console.log("📊 Processing with real-time monitoring:\n");

  let processed = 0;
  const startTime = Date.now();

  for (const email of emails) {
    await checker.checkEmail(email);
    processed++;

    // Display progress every 10 emails
    if (processed % 10 === 0) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const currentThroughput = (processed / (elapsedTime / 1000)).toFixed(2);
      const stats = checker.getStats();
      const cacheStats = await stats.cache;

      console.log(`   Processed: ${processed}/${emails.length}`);
      console.log(`   Elapsed: ${elapsedTime}ms`);
      console.log(`   Throughput: ${currentThroughput} emails/sec`);
      console.log(`   Cache Hit Rate: ${(cacheStats.hitRate * 100).toFixed(1)}%`);
      console.log(`   Disposable: ${stats.performance.disposableDetected}\n`);
    }
  }

  const totalTime = Date.now() - startTime;
  console.log(`✅ Completed ${processed} validations in ${totalTime}ms`);
}

// ============================================================================
// Memory and Resource Monitoring
// ============================================================================

async function memoryMonitoring() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 6.7: Memory and Resource Monitoring          ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker({
    enableCaching: true,
    cacheSize: 1000,
    enableIndexing: true,
  });

  // Process emails
  const emails = Array.from({ length: 100 }, (_, i) => 
    `user${i}@gmail.com`
  );

  console.log("🔍 Processing 100 emails...\n");

  await checker.checkEmailsBatch(emails);

  const stats = checker.getStats();
  const cacheStats = await stats.cache;

  console.log("📊 Resource Usage:");
  console.log(`   Cache Entries: ${cacheStats.entries}`);
  console.log(`   Index Size: ${stats.performance.indexSize} domains`);
  console.log(`   Total Validations: ${stats.performance.totalValidations}`);
  console.log(`   Average Validation Time: ${stats.performance.averageValidationTime.toFixed(2)}ms`);

  console.log(`\n💾 Cache Efficiency:`);
  console.log(`   Hits: ${cacheStats.hits}`);
  console.log(`   Misses: ${cacheStats.misses}`);
  console.log(`   Hit Rate: ${(cacheStats.hitRate * 100).toFixed(1)}%`);
  console.log(`   Memory Efficiency: ${((cacheStats.entries / 1000) * 100).toFixed(1)}% of max capacity`);
}

// ============================================================================
// Optimization Recommendations
// ============================================================================

async function optimizationRecommendations() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 6.8: Optimization Recommendations            ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker({
    enableCaching: true,
    enableIndexing: true,
  });

  // Process some emails
  const emails = Array.from({ length: 50 }, (_, i) => 
    `user${i}@${i % 5 === 0 ? '10minutemail.com' : 'gmail.com'}`
  );

  await checker.checkEmailsBatch(emails);

  const stats = checker.getStats();
  const cacheStats = await stats.cache;

  console.log("📊 Performance Analysis:\n");
  console.log(`Current Configuration:`);
  console.log(`   Total Validations: ${stats.performance.totalValidations}`);
  console.log(`   Average Time: ${stats.performance.averageValidationTime.toFixed(2)}ms`);
  console.log(`   Throughput: ${stats.performance.throughputPerSecond.toFixed(2)} emails/sec`);
  console.log(`   Cache Hit Rate: ${(cacheStats.hitRate * 100).toFixed(1)}%`);

  console.log(`\n💡 Optimization Recommendations:\n`);

  // Cache recommendations
  if (cacheStats.hitRate < 0.5) {
    console.log(`⚠️  Low cache hit rate (${(cacheStats.hitRate * 100).toFixed(1)}%)`);
    console.log(`   → Consider increasing cache size`);
    console.log(`   → Increase cache TTL for stable domains\n`);
  } else {
    console.log(`✅ Good cache hit rate (${(cacheStats.hitRate * 100).toFixed(1)}%)\n`);
  }

  // Throughput recommendations
  if (stats.performance.throughputPerSecond < 100) {
    console.log(`⚠️  Low throughput (${stats.performance.throughputPerSecond.toFixed(2)} emails/sec)`);
    console.log(`   → Enable batch processing for multiple emails`);
    console.log(`   → Ensure indexing is enabled`);
    console.log(`   → Consider disabling SMTP validation for initial checks\n`);
  } else {
    console.log(`✅ Good throughput (${stats.performance.throughputPerSecond.toFixed(2)} emails/sec)\n`);
  }

  // DNS recommendations
  if (stats.performance.dnsValidations && stats.performance.averageDnsTime! > 100) {
    console.log(`⚠️  Slow DNS validation (${stats.performance.averageDnsTime?.toFixed(2)}ms avg)`);
    console.log(`   → Increase DNS cache size`);
    console.log(`   → Reduce DNS timeout`);
    console.log(`   → Increase concurrency\n`);
  }

  console.log(`✨ Best Practices:`);
  console.log(`   • Use batch processing for multiple emails`);
  console.log(`   • Enable caching for frequently checked domains`);
  console.log(`   • Use hybrid indexing strategy`);
  console.log(`   • Monitor cache hit rate and adjust size accordingly`);
  console.log(`   • Consider disabling SMTP for initial validation`);
}

// ============================================================================
// Main Execution
// ============================================================================

async function runAllExamples() {
  console.log("\n🚀 Performance Monitoring Examples");
  console.log("=" .repeat(60));

  try {
    await basicPerformanceMetrics();
    await cachePerformanceAnalysis();
    await dnsSmtpStatistics();
    await throughputMeasurement();
    await performanceComparison();
    await realTimeMonitoring();
    await memoryMonitoring();
    await optimizationRecommendations();

    console.log("\n✅ All performance monitoring examples completed!");
    console.log("=" .repeat(60) + "\n");
  } catch (error) {
    console.error("\n❌ Error running examples:", error);
    process.exit(1);
  }
}

// Export functions for selective usage
export {
  basicPerformanceMetrics,
  cachePerformanceAnalysis,
  dnsSmtpStatistics,
  throughputMeasurement,
  performanceComparison,
  realTimeMonitoring,
  memoryMonitoring,
  optimizationRecommendations,
  runAllExamples,
};

// Run all examples if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples().catch(console.error);
}
