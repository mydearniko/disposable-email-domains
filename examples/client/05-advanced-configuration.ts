import { DisposableEmailChecker } from "../../src/client";

/**
 * Example 5: Advanced Configuration
 * 
 * This example demonstrates advanced configuration options:
 * - Custom patterns for detection
 * - Allowlist and blacklist management
 * - Strict validation modes
 * - Custom caching strategies
 * - Trusted domains configuration
 * - Indexing strategies
 */

// ============================================================================
// Basic Configuration Options
// ============================================================================

async function basicConfiguration() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 5.1: Basic Configuration Options             ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker({
    strictValidation: true,           // Enforce strict email format
    checkMxRecord: true,              // Verify MX records
    enableSubdomainChecking: true,    // Check subdomains
    enablePatternMatching: true,      // Use pattern matching
    enableCaching: true,              // Enable result caching
    cacheSize: 5000,                  // Cache up to 5000 results
  });

  console.log("⚙️  Configuration:");
  console.log("   Strict Validation: ✅ Enabled");
  console.log("   MX Record Check: ✅ Enabled");
  console.log("   Subdomain Checking: ✅ Enabled");
  console.log("   Pattern Matching: ✅ Enabled");
  console.log("   Caching: ✅ Enabled (5000 entries)\n");

  const testEmails = [
    "user@gmail.com",
    "test@mail.10minutemail.com",  // Subdomain
    "temp123@fakeemail.com",        // Pattern match
  ];

  console.log("🔍 Testing emails with configuration:\n");

  for (const email of testEmails) {
    const result = await checker.checkEmail(email);
    console.log(`📧 ${email}`);
    console.log(`   Valid: ${result.isValid ? "✅" : "❌"}`);
    console.log(`   Disposable: ${result.isDisposable ? "🚫 Yes" : "✅ No"}`);
    console.log(`   Match Type: ${result.matchType}`);
    console.log(`   Confidence: ${result.confidence}%\n`);
  }
}

// ============================================================================
// Custom Patterns Configuration
// ============================================================================

async function customPatterns() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 5.2: Custom Pattern Matching                 ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  // Define custom suspicious patterns
  const customPatterns = [
    /test\d+@/i,           // test123@, test456@, etc.
    /^tmp.*@/i,            // tmp, tmpuser, etc.
    /throwaway/i,          // throwaway in any part
    /^delete.*@/i,         // delete, deleteme, etc.
    /nospam\d+@/i,         // nospam123@, etc.
  ];

  const checker = new DisposableEmailChecker({
    enablePatternMatching: true,
    customPatterns,
  });

  console.log("📝 Custom patterns configured:");
  customPatterns.forEach((pattern, index) => {
    console.log(`   ${index + 1}. ${pattern.source}`);
  });

  const testEmails = [
    "test123@example.com",
    "tmpuser@company.com",
    "throwaway@domain.com",
    "deleteme@service.com",
    "nospam456@site.com",
    "regular.user@company.com",
  ];

  console.log("\n🔍 Testing emails against custom patterns:\n");

  for (const email of testEmails) {
    const result = await checker.checkEmail(email);
    const matchedPattern = result.matchType === "pattern";
    
    console.log(`📧 ${email}`);
    console.log(`   Match Type: ${result.matchType}`);
    console.log(`   Is Suspicious: ${matchedPattern ? "⚠️  Yes" : "✅ No"}`);
    console.log(`   Confidence: ${result.confidence}%`);
    
    if (result.warnings.length > 0) {
      console.log(`   Warnings: ${result.warnings.join(", ")}`);
    }
    console.log("");
  }
}

// ============================================================================
// Trusted Domains Configuration
// ============================================================================

async function trustedDomains() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 5.3: Trusted Domains Configuration           ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const trustedDomains = [
    "gmail.com",
    "outlook.com",
    "yahoo.com",
    "company.com",
    "enterprise.org",
  ];

  const checker = new DisposableEmailChecker({
    trustedDomains,
  });

  console.log("🛡️  Trusted domains configured:");
  trustedDomains.forEach((domain, index) => {
    console.log(`   ${index + 1}. ${domain}`);
  });

  const testEmails = [
    "user@gmail.com",         // Trusted
    "test@company.com",       // Trusted
    "temp@10minutemail.com",  // Disposable
    "admin@untrusted.com",    // Unknown
  ];

  console.log("\n🔍 Testing emails:\n");

  for (const email of testEmails) {
    const result = await checker.checkEmail(email);
    const domain = email.split("@")[1];
    const isTrusted = trustedDomains.includes(domain);
    
    console.log(`📧 ${email}`);
    console.log(`   Trusted: ${isTrusted ? "✅ Yes" : "❌ No"}`);
    console.log(`   Disposable: ${result.isDisposable ? "🚫 Yes" : "✅ No"}`);
    console.log(`   Confidence: ${result.confidence}%\n`);
  }
}

// ============================================================================
// Strict Validation Mode
// ============================================================================

async function strictValidationMode() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 5.4: Strict vs Standard Validation           ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const standardChecker = new DisposableEmailChecker({
    strictValidation: false,
  });

  const strictChecker = new DisposableEmailChecker({
    strictValidation: true,
  });

  const testEmails = [
    "user@example.com",
    "user..dots@example.com",
    "user@sub.example.com",
    ".user@example.com",
  ];

  console.log("🔍 Comparing validation modes:\n");

  for (const email of testEmails) {
    console.log(`📧 ${email}`);
    
    const standardResult = await standardChecker.checkEmail(email);
    const strictResult = await strictChecker.checkEmail(email);
    
    console.log(`   Standard mode: ${standardResult.isValid ? "✅ Valid" : "❌ Invalid"}`);
    console.log(`   Strict mode: ${strictResult.isValid ? "✅ Valid" : "❌ Invalid"}`);
    
    if (standardResult.isValid !== strictResult.isValid) {
      console.log(`   ⚠️  Different results! Strict mode is more restrictive.`);
    }
    console.log("");
  }
}

// ============================================================================
// DNS Validation Configuration
// ============================================================================

async function dnsValidationConfig() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 5.5: Advanced DNS Validation Config          ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker({
    checkMxRecord: true,
    dnsValidation: {
      timeout: 5000,                    // 5 second timeout
      retries: 3,                       // Retry up to 3 times
      concurrency: 10,                  // Process 10 domains concurrently
      enableCaching: true,              // Cache DNS results
      cacheSize: 5000,                  // Cache up to 5000 entries
      cacheTtl: 300000,                 // 5 minute TTL
      validateMxConnectivity: true,     // Test actual connectivity
      checkSpfRecord: true,             // Check SPF records
      checkDmarcRecord: true,           // Check DMARC records
    },
  });

  console.log("⚙️  DNS Validation Configuration:");
  console.log("   Timeout: 5000ms");
  console.log("   Retries: 3");
  console.log("   Concurrency: 10");
  console.log("   Caching: Enabled (5000 entries, 5min TTL)");
  console.log("   MX Connectivity: ✅ Enabled");
  console.log("   SPF Check: ✅ Enabled");
  console.log("   DMARC Check: ✅ Enabled\n");

  const email = "user@gmail.com";

  console.log(`🔍 Testing with advanced DNS validation: ${email}\n`);

  const result = await checker.checkEmail(email);

  console.log("📊 Results:");
  if (result.dnsValidation) {
    console.log(`   MX Records: ${result.dnsValidation.hasMx ? "✅" : "❌"} (${result.dnsValidation.mxRecords.length} found)`);
    console.log(`   SPF Record: ${result.dnsValidation.hasSpf ? "✅" : "❌"}`);
    console.log(`   DMARC Record: ${result.dnsValidation.hasDmarc ? "✅" : "❌"}`);
    console.log(`   Connectable: ${result.dnsValidation.isConnectable ? "✅" : "❌"}`);
    console.log(`   Validation Time: ${result.dnsValidation.dnsValidationTime}ms`);
  }
}

// ============================================================================
// SMTP Validation Configuration
// ============================================================================

async function smtpValidationConfig() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 5.6: Advanced SMTP Validation Config         ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker({
    checkSmtpDeliverability: true,
    smtpValidation: {
      timeout: 15000,                   // 15 second timeout
      port: 25,                         // SMTP port
      fromEmail: "noreply@yourdomain.com",
      helo: "mail.yourdomain.com",
      retries: 2,                       // Retry up to 2 times
      enableCaching: true,              // Cache SMTP results
      cacheSize: 1000,                  // Cache up to 1000 entries
      cacheTtl: 600000,                 // 10 minute TTL
    },
  });

  console.log("⚙️  SMTP Validation Configuration:");
  console.log("   Timeout: 15000ms");
  console.log("   Port: 25");
  console.log("   From Email: noreply@yourdomain.com");
  console.log("   HELO: mail.yourdomain.com");
  console.log("   Retries: 2");
  console.log("   Caching: Enabled (1000 entries, 10min TTL)\n");

  const email = "test@gmail.com";

  console.log(`🔍 Testing with SMTP validation: ${email}\n`);
  console.log("⚠️  Note: Some mail servers may block SMTP validation attempts.\n");

  const result = await checker.checkEmail(email);

  console.log("📊 Results:");
  console.log(`   Format Valid: ${result.isValid ? "✅" : "❌"}`);
  console.log(`   Disposable: ${result.isDisposable ? "🚫 Yes" : "✅ No"}`);
  
  if (result.smtpValidation) {
    console.log(`   SMTP Valid: ${result.smtpValidation.isValid ? "✅" : "❌"}`);
    console.log(`   Deliverable: ${result.smtpValidation.isDeliverable ? "✅" : "❌"}`);
    console.log(`   Response Code: ${result.smtpValidation.responseCode || "N/A"}`);
    console.log(`   Validation Time: ${result.smtpValidation.smtpValidationTime}ms`);
  }
}

// ============================================================================
// Indexing Strategy Configuration
// ============================================================================

async function indexingStrategies() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 5.7: Indexing Strategy Comparison            ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  console.log("📊 Testing different indexing strategies:\n");

  // Trie indexing
  console.log("1️⃣  Trie Indexing Strategy:");
  const trieChecker = new DisposableEmailChecker({
    enableIndexing: true,
    indexingStrategy: "trie",
  });
  
  const trieStart = Date.now();
  await trieChecker.checkEmail("test@10minutemail.com");
  const trieTime = Date.now() - trieStart;
  console.log(`   Initialization + Check: ${trieTime}ms`);
  console.log(`   Best for: Prefix matching, memory efficient\n`);

  // Bloom filter
  console.log("2️⃣  Bloom Filter Strategy:");
  const bloomChecker = new DisposableEmailChecker({
    enableIndexing: true,
    indexingStrategy: "bloom",
  });
  
  const bloomStart = Date.now();
  await bloomChecker.checkEmail("test@10minutemail.com");
  const bloomTime = Date.now() - bloomStart;
  console.log(`   Initialization + Check: ${bloomTime}ms`);
  console.log(`   Best for: Fast lookups, probabilistic\n`);

  // Hybrid approach
  console.log("3️⃣  Hybrid Strategy:");
  const hybridChecker = new DisposableEmailChecker({
    enableIndexing: true,
    indexingStrategy: "hybrid",
  });
  
  const hybridStart = Date.now();
  await hybridChecker.checkEmail("test@10minutemail.com");
  const hybridTime = Date.now() - hybridStart;
  console.log(`   Initialization + Check: ${hybridTime}ms`);
  console.log(`   Best for: Balanced performance and accuracy\n`);

  console.log("💡 Recommendation: Use hybrid for most use cases");
}

// ============================================================================
// Cache Configuration
// ============================================================================

async function cacheConfiguration() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 5.8: Advanced Cache Configuration            ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker({
    enableCaching: true,
    cacheSize: 10000,
    cacheType: "memory",
    cacheConfig: {
      maxSize: 10000,
      defaultTtl: 86400000,      // 24 hours
      cleanupInterval: 3600000,  // 1 hour
    },
  });

  console.log("⚙️  Cache Configuration:");
  console.log("   Type: Memory");
  console.log("   Max Size: 10,000 entries");
  console.log("   Default TTL: 24 hours");
  console.log("   Cleanup Interval: 1 hour\n");

  const email = "test@gmail.com";

  // First check (uncached)
  console.log("1️⃣  First check (uncached):");
  const start1 = Date.now();
  await checker.checkEmail(email);
  const time1 = Date.now() - start1;
  console.log(`   Time: ${time1}ms\n`);

  // Second check (cached)
  console.log("2️⃣  Second check (cached):");
  const start2 = Date.now();
  await checker.checkEmail(email);
  const time2 = Date.now() - start2;
  console.log(`   Time: ${time2}ms\n`);

  const speedup = ((time1 - time2) / time1 * 100).toFixed(1);
  console.log(`📊 Cache Performance: ${speedup}% faster`);
}

// ============================================================================
// Complete Configuration Example
// ============================================================================

async function completeConfiguration() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 5.9: Complete Configuration                  ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker({
    // Validation options
    strictValidation: false,
    checkMxRecord: true,
    checkSmtpDeliverability: false,
    enableSubdomainChecking: true,
    enablePatternMatching: true,

    // Custom patterns
    customPatterns: [
      /test\d+@/i,
      /temp.*@/i,
    ],

    // Trusted domains
    trustedDomains: [
      "gmail.com",
      "outlook.com",
      "yahoo.com",
    ],

    // Performance options
    enableCaching: true,
    cacheSize: 10000,
    enableIndexing: true,
    indexingStrategy: "hybrid",

    // DNS configuration
    dnsValidation: {
      timeout: 5000,
      retries: 3,
      concurrency: 10,
      enableCaching: true,
      cacheSize: 5000,
      cacheTtl: 300000,
      validateMxConnectivity: true,
      checkSpfRecord: true,
      checkDmarcRecord: true,
    },

    // SMTP configuration (disabled but configured for future use)
    smtpValidation: {
      timeout: 10000,
      port: 25,
      fromEmail: "noreply@yourdomain.com",
      helo: "mail.yourdomain.com",
      retries: 2,
    },
  });

  console.log("⚙️  Complete configuration loaded successfully!\n");
  console.log("🔍 Testing comprehensive validation:\n");

  const email = "user@gmail.com";
  const result = await checker.checkEmail(email);

  console.log(`📧 Email: ${email}`);
  console.log(`   Valid: ${result.isValid ? "✅" : "❌"}`);
  console.log(`   Disposable: ${result.isDisposable ? "🚫 Yes" : "✅ No"}`);
  console.log(`   Confidence: ${result.confidence}%`);
  console.log(`   Match Type: ${result.matchType}`);
  console.log(`   Validation Time: ${result.validationTime}ms`);

  if (result.dnsValidation) {
    console.log(`\n   DNS Validation:`);
    console.log(`     MX: ${result.dnsValidation.hasMx ? "✅" : "❌"}`);
    console.log(`     SPF: ${result.dnsValidation.hasSpf ? "✅" : "❌"}`);
    console.log(`     DMARC: ${result.dnsValidation.hasDmarc ? "✅" : "❌"}`);
  }
}

// ============================================================================
// Main Execution
// ============================================================================

async function runAllExamples() {
  console.log("\n🚀 Advanced Configuration Examples");
  console.log("=" .repeat(60));

  try {
    await basicConfiguration();
    await customPatterns();
    await trustedDomains();
    await strictValidationMode();
    await dnsValidationConfig();
    await smtpValidationConfig();
    await indexingStrategies();
    await cacheConfiguration();
    await completeConfiguration();

    console.log("\n✅ All advanced configuration examples completed!");
    console.log("=" .repeat(60) + "\n");
  } catch (error) {
    console.error("\n❌ Error running examples:", error);
    process.exit(1);
  }
}

// Export functions for selective usage
export {
  basicConfiguration,
  customPatterns,
  trustedDomains,
  strictValidationMode,
  dnsValidationConfig,
  smtpValidationConfig,
  indexingStrategies,
  cacheConfiguration,
  completeConfiguration,
  runAllExamples,
};

// Run all examples if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples().catch(console.error);
}
