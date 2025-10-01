import { DisposableEmailChecker } from "../../src/client";

/**
 * Example 1: Basic Disposable Email Detection
 * 
 * This example demonstrates the simplest way to check if an email
 * is from a disposable domain. Perfect for form validation and
 * user registration flows.
 */

// ============================================================================
// Simple Quick Check
// ============================================================================

async function simpleCheck() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 1.1: Simple Disposable Email Check           ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  // Initialize checker with default settings
  const checker = new DisposableEmailChecker();

  const email = "test@10minutemail.com";
  
  console.log(`🔍 Checking: ${email}\n`);
  
  const result = await checker.checkEmail(email);
  
  console.log("📊 Results:");
  console.log(`   ✅ Valid Format: ${result.isValid}`);
  console.log(`   🚫 Is Disposable: ${result.isDisposable}`);
  console.log(`   📈 Confidence: ${result.confidence}%`);
  console.log(`   🎯 Match Type: ${result.matchType}`);
  console.log(`   ⏱️  Validation Time: ${result.validationTime}ms\n`);

  if (result.isDisposable) {
    console.log("⚠️  Warning: This email is from a disposable domain!");
    console.log("   Consider blocking or requiring additional verification.\n");
  }
}

// ============================================================================
// Multiple Email Validation
// ============================================================================

async function checkMultipleEmails() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 1.2: Checking Multiple Emails                ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker();

  const testEmails = [
    "john.doe@gmail.com",           // Legitimate email
    "test@10minutemail.com",        // Disposable
    "admin@tempmail.org",           // Disposable
    "contact@microsoft.com",        // Legitimate
    "user@guerrillamail.com",       // Disposable
    "alice@outlook.com",            // Legitimate
  ];

  console.log("📧 Testing emails:\n");

  for (const email of testEmails) {
    const result = await checker.checkEmail(email);
    
    const statusIcon = result.isDisposable ? "🚫" : "✅";
    const status = result.isDisposable ? "DISPOSABLE" : "LEGITIMATE";
    
    console.log(`${statusIcon} ${email}`);
    console.log(`   Status: ${status} (${result.confidence}% confidence)`);
    console.log(`   Match: ${result.matchType}\n`);
  }
}

// ============================================================================
// Form Validation Scenario
// ============================================================================

async function formValidationExample() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 1.3: Real-World Form Validation              ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker();

  // Simulate form submissions
  const formSubmissions = [
    { name: "John Doe", email: "john@gmail.com" },
    { name: "Temp User", email: "temp@10minutemail.com" },
    { name: "Alice Smith", email: "alice@company.com" },
  ];

  console.log("🎯 Processing form submissions:\n");

  for (let i = 0; i < formSubmissions.length; i++) {
    const submission = formSubmissions[i];
    const result = await checker.checkEmail(submission.email);

    console.log(`📝 Submission #${i + 1}: ${submission.name}`);
    console.log(`   Email: ${submission.email}`);

    if (!result.isValid) {
      console.log(`   ❌ REJECTED: Invalid email format`);
      console.log(`   Errors: ${result.errors.join(", ")}\n`);
      continue;
    }

    if (result.isDisposable) {
      console.log(`   ⚠️  FLAGGED: Disposable email detected`);
      console.log(`   Action: Request alternative email or additional verification`);
      console.log(`   Confidence: ${result.confidence}%\n`);
    } else {
      console.log(`   ✅ ACCEPTED: Email looks legitimate`);
      console.log(`   Proceed with registration\n`);
    }
  }
}

// ============================================================================
// Understanding Match Types
// ============================================================================

async function matchTypesDemo() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 1.4: Understanding Match Types               ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker();

  const examples = [
    { email: "test@10minutemail.com", expectedType: "exact" },
    { email: "user@mail.10minutemail.com", expectedType: "subdomain" },
    { email: "test@temp-mail-123.com", expectedType: "pattern" },
  ];

  console.log("🔍 Different types of disposable domain detection:\n");

  for (const example of examples) {
    const result = await checker.checkEmail(example.email);

    console.log(`📧 ${example.email}`);
    console.log(`   Match Type: ${result.matchType}`);
    console.log(`   Is Disposable: ${result.isDisposable}`);
    console.log(`   Confidence: ${result.confidence}%`);
    
    if (result.matchType === "exact") {
      console.log(`   📌 Exact match found in disposable domains list`);
    } else if (result.matchType === "subdomain") {
      console.log(`   📌 Subdomain of a known disposable domain`);
    } else if (result.matchType === "pattern") {
      console.log(`   📌 Matches suspicious pattern (e.g., temp, fake, etc.)`);
    }
    console.log("");
  }
}

// ============================================================================
// Error Handling
// ============================================================================

async function errorHandlingExample() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Example 1.5: Proper Error Handling                   ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const checker = new DisposableEmailChecker();

  const testCases = [
    "valid@example.com",
    "invalid-email",
    "@nodomain.com",
    "no-at-sign.com",
    "",
  ];

  console.log("🛡️  Testing various inputs with error handling:\n");

  for (const email of testCases) {
    try {
      console.log(`Testing: "${email}"`);
      
      const result = await checker.checkEmail(email);

      if (result.isValid) {
        console.log(`   ✅ Valid: ${result.isDisposable ? "Disposable" : "Legitimate"}`);
      } else {
        console.log(`   ❌ Invalid email format`);
        if (result.errors.length > 0) {
          console.log(`   Errors: ${result.errors.join(", ")}`);
        }
      }

      if (result.warnings.length > 0) {
        console.log(`   ⚠️  Warnings: ${result.warnings.join(", ")}`);
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
  console.log("\n🚀 Basic Disposable Email Checking Examples");
  console.log("=" .repeat(60));

  try {
    await simpleCheck();
    await checkMultipleEmails();
    await formValidationExample();
    await matchTypesDemo();
    await errorHandlingExample();

    console.log("\n✅ All basic checking examples completed!");
    console.log("=" .repeat(60) + "\n");
  } catch (error) {
    console.error("\n❌ Error running examples:", error);
    process.exit(1);
  }
}

// Export functions for selective usage
export {
  simpleCheck,
  checkMultipleEmails,
  formValidationExample,
  matchTypesDemo,
  errorHandlingExample,
  runAllExamples,
};

// Run all examples if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples().catch(console.error);
}
