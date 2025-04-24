/**
 * Parse E2E Test Results
 * 
 * This script parses the JSON test results from Playwright and outputs a summary.
 * It's designed to be used by agents to quickly understand test results.
 */

const fs = require('fs');
const path = require('path');

// Path to the test results file
const resultsPath = path.join(__dirname, '..', 'test-results', 'e2e-results.json');

// Check if the file exists
if (!fs.existsSync(resultsPath)) {
  console.error('Test results file not found. Run tests with npm run test:e2e:agent first.');
  process.exit(1);
}

// Read and parse the results
try {
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  
  // Extract test statistics
  const totalTests = results.suites.reduce((count, suite) => count + suite.specs.length, 0);
  const passedTests = results.suites.reduce((count, suite) => {
    return count + suite.specs.filter(spec => 
      spec.tests.every(test => test.results.every(result => result.status === 'passed'))
    ).length;
  }, 0);
  const failedTests = totalTests - passedTests;
  
  // Create a summary
  console.log('=== E2E Test Results Summary ===');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log('===============================');
  
  // List failed tests if any
  if (failedTests > 0) {
    console.log('\nFailed Tests:');
    results.suites.forEach(suite => {
      suite.specs.forEach(spec => {
        const hasFailure = spec.tests.some(test => 
          test.results.some(result => result.status !== 'passed')
        );
        
        if (hasFailure) {
          console.log(`- ${spec.title}`);
          spec.tests.forEach(test => {
            test.results.forEach(result => {
              if (result.status !== 'passed') {
                console.log(`  • ${result.status}: ${result.error?.message || 'Unknown error'}`);
              }
            });
          });
        }
      });
    });
  }
  
  // Exit with appropriate code
  process.exit(failedTests > 0 ? 1 : 0);
} catch (error) {
  console.error('Error parsing test results:', error);
  process.exit(1);
}
