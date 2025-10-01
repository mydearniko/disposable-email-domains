import { DisposableEmailChecker, DnsResolver } from "../../src/client";

/**
 * Example 2: DNS Validation
 * 
 * This example demonstrates DNS-based email validation including:
 * - MX record checking
 * - SPF record validation
 * - DMARC policy checking
 * - Domain connectivity testing
 */

// ============================================================================
// Basic MX Record Validation
// ============================================================================

async function basicMxValidation() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 2.1: Basic MX Record Validation              ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker({
    checkMxRecord: true,
  });

  const emails = [
    "user@gmail.com",              // Should have MX records
    "test@nonexistentdomain12345.com", // No MX records
    "admin@microsoft.com",         // Should have MX records
  ];

  console.log("🌐 Checking MX records for domains:\n");

  for (const email of emails) {
    const result = await checker.checkEmail(email);

    console.log(`📧 ${email}`);
    console.log(`   Domain: ${result.domain}`);

    if (result.dnsValidation) {
      console.log(`   Has MX Records: ${result.dnsValidation.hasMx ? "✅ Yes" : "❌ No"}`);
      
      if (result.dnsValidation.hasMx) {
        console.log(`   MX Record Count: ${result.dnsValidation.mxRecords.length}`);
        console.log(`   Primary MX Server: ${result.dnsValidation.mxRecords[0]?.exchange || "N/A"}`);
      }
      
      console.log(`   DNS Validation Time: ${result.dnsValidation.dnsValidationTime}ms`);
    } else {
      console.log(`   ⚠️  DNS validation not performed`);
    }
    console.log("");
  }
}

// ============================================================================
// Detailed MX Record Information
// ============================================================================

async function detailedMxInfo() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 2.2: Detailed MX Record Information          ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  // Use DnsResolver directly for more control
  const dnsResolver = new DnsResolver({
    timeout: 5000,
    retries: 3,
  });

  const domains = ["gmail.com", "outlook.com", "yahoo.com"];

  console.log("🔍 Fetching detailed MX records:\n");

  for (const domain of domains) {
    try {
      const result = await dnsResolver.validateMxRecord(domain);

      console.log(`🌐 ${domain}`);
      console.log(`   Has MX: ${result.hasMx ? "✅ Yes" : "❌ No"}`);
      
      if (result.hasMx && result.mxRecords.length > 0) {
        console.log(`   MX Records (${result.mxRecords.length} total):`);
        result.mxRecords.forEach((mx, index) => {
          console.log(`      ${index + 1}. ${mx.exchange} (Priority: ${mx.priority})`);
        });
      }

      console.log(`   Validation Time: ${result.validationTime}ms`);
      
      if (result.warnings.length > 0) {
        console.log(`   ⚠️  Warnings: ${result.warnings.join(", ")}`);
      }
      
      if (result.errors.length > 0) {
        console.log(`   ❌ Errors: ${result.errors.join(", ")}`);
      }

    } catch (error) {
      console.log(`   💥 Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
    console.log("");
  }
}

// ============================================================================
// SPF and DMARC Validation
// ============================================================================

async function spfDmarcValidation() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 2.3: SPF and DMARC Validation                ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker({
    checkMxRecord: true,
    dnsValidation: {
      timeout: 5000,
      retries: 3,
      checkSpfRecord: true,
      checkDmarcRecord: true,
    },
  });

  const emails = [
    "user@gmail.com",
    "test@microsoft.com",
    "admin@yahoo.com",
  ];

  console.log("🔒 Checking email security policies (SPF & DMARC):\n");

  for (const email of emails) {
    const result = await checker.checkEmail(email);

    console.log(`📧 ${email}`);
    console.log(`   Domain: ${result.domain}`);

    if (result.dnsValidation) {
      console.log(`   Security Status:`);
      console.log(`      MX Records: ${result.dnsValidation.hasMx ? "✅ Present" : "❌ Missing"}`);
      console.log(`      SPF Record: ${result.dnsValidation.hasSpf ? "✅ Present" : "❌ Missing"}`);
      console.log(`      DMARC Policy: ${result.dnsValidation.hasDmarc ? "✅ Present" : "❌ Missing"}`);

      // Security score based on DNS records
      let securityScore = 0;
      if (result.dnsValidation.hasMx) securityScore += 40;
      if (result.dnsValidation.hasSpf) securityScore += 30;
      if (result.dnsValidation.hasDmarc) securityScore += 30;

      const scoreEmoji = securityScore >= 80 ? "🟢" : securityScore >= 50 ? "🟡" : "🔴";
      console.log(`   ${scoreEmoji} Security Score: ${securityScore}/100`);
    }
    console.log("");
  }
}

// ============================================================================
// MX Connectivity Testing
// ============================================================================

async function mxConnectivityTest() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 2.4: MX Server Connectivity Testing          ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker({
    checkMxRecord: true,
    dnsValidation: {
      timeout: 5000,
      retries: 3,
      validateMxConnectivity: true, // Test actual connection to MX server
    },
  });

  const emails = [
    "user@gmail.com",
    "test@outlook.com",
    "admin@yahoo.com",
  ];

  console.log("🔌 Testing MX server connectivity:\n");

  for (const email of emails) {
    const result = await checker.checkEmail(email);

    console.log(`📧 ${email}`);

    if (result.dnsValidation) {
      console.log(`   Has MX: ${result.dnsValidation.hasMx ? "✅ Yes" : "❌ No"}`);
      console.log(`   Is Connectable: ${result.dnsValidation.isConnectable ? "✅ Yes" : "❌ No"}`);
      
      if (result.dnsValidation.hasMx && result.dnsValidation.mxRecords.length > 0) {
        console.log(`   Primary MX: ${result.dnsValidation.mxRecords[0].exchange}`);
      }

      if (result.dnsValidation.isConnectable) {
        console.log(`   ✅ Mail server is reachable on port 25`);
      } else {
        console.log(`   ⚠️  Mail server connectivity could not be verified`);
      }
    }
    console.log("");
  }
}

// ============================================================================
// Batch DNS Validation
// ============================================================================

async function batchDnsValidation() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 2.5: Batch DNS Validation                    ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const dnsResolver = new DnsResolver({
    timeout: 5000,
    retries: 3,
    concurrency: 5, // Process 5 domains concurrently
    checkSpfRecord: true,
    checkDmarcRecord: true,
  });

  const domains = [
    "gmail.com",
    "outlook.com",
    "yahoo.com",
    "microsoft.com",
    "apple.com",
    "amazon.com",
    "facebook.com",
    "twitter.com",
  ];

  console.log(`📦 Validating ${domains.length} domains in batch:\n`);

  const startTime = Date.now();
  const results = await dnsResolver.validateMxRecordsBatch(domains);
  const endTime = Date.now();

  console.log(`✅ Batch validation completed in ${endTime - startTime}ms\n`);
  console.log("📊 Results:\n");

  let validCount = 0;
  let spfCount = 0;
  let dmarcCount = 0;

  results.forEach((result, domain) => {
    console.log(`🌐 ${domain}`);
    console.log(`   MX: ${result.hasMx ? "✅" : "❌"}  SPF: ${result.hasSpf ? "✅" : "❌"}  DMARC: ${result.hasDmarc ? "✅" : "❌"}`);
    console.log(`   MX Records: ${result.mxRecords.length}`);
    
    if (result.hasMx) validCount++;
    if (result.hasSpf) spfCount++;
    if (result.hasDmarc) dmarcCount++;
  });

  console.log("\n📈 Summary:");
  console.log(`   Total domains: ${domains.length}`);
  console.log(`   With MX records: ${validCount}`);
  console.log(`   With SPF: ${spfCount}`);
  console.log(`   With DMARC: ${dmarcCount}`);
  console.log(`   Processing time: ${endTime - startTime}ms`);
  console.log(`   Average per domain: ${((endTime - startTime) / domains.length).toFixed(2)}ms`);
}

// ============================================================================
// DNS Caching Demonstration
// ============================================================================

async function dnsCachingDemo() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 2.6: DNS Caching Performance                 ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const dnsResolver = new DnsResolver({
    enableCaching: true,
    cacheSize: 1000,
    cacheTtl: 300000, // 5 minutes
  });

  const domain = "gmail.com";

  console.log("🚀 Testing DNS caching performance:\n");

  // First query (uncached)
  console.log("1️⃣  First query (uncached):");
  const start1 = Date.now();
  await dnsResolver.validateMxRecord(domain);
  const time1 = Date.now() - start1;
  console.log(`   ⏱️  Time: ${time1}ms\n`);

  // Second query (cached)
  console.log("2️⃣  Second query (cached):");
  const start2 = Date.now();
  await dnsResolver.validateMxRecord(domain);
  const time2 = Date.now() - start2;
  console.log(`   ⏱️  Time: ${time2}ms\n`);

  // Third query (cached)
  console.log("3️⃣  Third query (cached):");
  const start3 = Date.now();
  await dnsResolver.validateMxRecord(domain);
  const time3 = Date.now() - start3;
  console.log(`   ⏱️  Time: ${time3}ms\n`);

  const speedup = ((time1 - time2) / time1 * 100).toFixed(1);
  console.log(`📊 Performance improvement: ${speedup}% faster with cache`);

  const stats = dnsResolver.getStats();
  console.log(`\n📈 DNS Resolver Stats:`);
  console.log(`   Cache size: ${stats.cacheSize}`);
  console.log(`   Cache hit rate: ${(stats.cacheHitRate * 100).toFixed(1)}%`);
}

// ============================================================================
// Main Execution
// ============================================================================

async function runAllExamples() {
  console.log("\n🚀 DNS Validation Examples");
  console.log("=" .repeat(60));

  try {
    await basicMxValidation();
    await detailedMxInfo();
    await spfDmarcValidation();
    await mxConnectivityTest();
    await batchDnsValidation();
    await dnsCachingDemo();

    console.log("\n✅ All DNS validation examples completed!");
    console.log("=" .repeat(60) + "\n");
  } catch (error) {
    console.error("\n❌ Error running examples:", error);
    process.exit(1);
  }
}

// Export functions for selective usage
export {
  basicMxValidation,
  detailedMxInfo,
  spfDmarcValidation,
  mxConnectivityTest,
  batchDnsValidation,
  dnsCachingDemo,
  runAllExamples,
};

// Run all examples if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples().catch(console.error);
}
