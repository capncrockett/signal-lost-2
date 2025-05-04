#!/usr/bin/env node

/**
 * GitHub Pages Deployment Monitor
 * 
 * This script checks the status of the GitHub Pages deployment and reports any issues.
 * It can be run manually or as part of a scheduled CI job.
 */

const https = require('https');
const { execSync } = require('child_process');

// Configuration
const SITE_URL = 'https://capncrockett.github.io/signal-lost-2/';
const REQUIRED_FILES = ['index.html', 'assets/index.js'];
const TIMEOUT_MS = 10000;

// ANSI color codes for terminal output
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Check if a URL is accessible
 */
function checkUrl(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, {
      timeout: TIMEOUT_MS,
    }, (response) => {
      const { statusCode } = response;
      
      // Any status code that is not 2xx is considered an error
      if (statusCode < 200 || statusCode >= 300) {
        reject(new Error(`Request failed with status code ${statusCode}`));
        return;
      }
      
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        resolve({
          statusCode,
          data,
          headers: response.headers,
        });
      });
    });
    
    request.on('error', (error) => {
      reject(error);
    });
    
    request.on('timeout', () => {
      request.destroy();
      reject(new Error(`Request timed out after ${TIMEOUT_MS}ms`));
    });
  });
}

/**
 * Check if all required files are accessible
 */
async function checkRequiredFiles() {
  const results = [];
  
  for (const file of REQUIRED_FILES) {
    const url = `${SITE_URL}${file}`;
    
    try {
      const response = await checkUrl(url);
      results.push({
        file,
        url,
        success: true,
        statusCode: response.statusCode,
      });
    } catch (error) {
      results.push({
        file,
        url,
        success: false,
        error: error.message,
      });
    }
  }
  
  return results;
}

/**
 * Check the MIME types of critical files
 */
async function checkMimeTypes() {
  const results = [];
  
  // Check index.html
  try {
    const response = await checkUrl(`${SITE_URL}index.html`);
    const contentType = response.headers['content-type'];
    
    results.push({
      file: 'index.html',
      success: contentType.includes('text/html'),
      contentType,
      expected: 'text/html',
    });
  } catch (error) {
    results.push({
      file: 'index.html',
      success: false,
      error: error.message,
    });
  }
  
  // Check JavaScript files
  try {
    const response = await checkUrl(`${SITE_URL}assets/index.js`);
    const contentType = response.headers['content-type'];
    
    results.push({
      file: 'assets/index.js',
      success: contentType.includes('application/javascript') || contentType.includes('text/javascript'),
      contentType,
      expected: 'application/javascript or text/javascript',
    });
  } catch (error) {
    results.push({
      file: 'assets/index.js',
      success: false,
      error: error.message,
    });
  }
  
  return results;
}

/**
 * Get the latest deployment information
 */
function getLatestDeployment() {
  try {
    const output = execSync('gh api repos/capncrockett/signal-lost-2/deployments --jq ".[0]"', { encoding: 'utf8' });
    return JSON.parse(output);
  } catch (error) {
    console.error(`${COLORS.red}Error getting deployment info: ${error.message}${COLORS.reset}`);
    return null;
  }
}

/**
 * Main function to monitor the deployment
 */
async function monitorDeployment() {
  console.log(`${COLORS.cyan}Monitoring GitHub Pages deployment for ${SITE_URL}${COLORS.reset}\n`);
  
  // Check if the site is accessible
  console.log(`${COLORS.blue}Checking if the site is accessible...${COLORS.reset}`);
  try {
    const response = await checkUrl(SITE_URL);
    console.log(`${COLORS.green}✓ Site is accessible (Status: ${response.statusCode})${COLORS.reset}`);
  } catch (error) {
    console.error(`${COLORS.red}✗ Site is not accessible: ${error.message}${COLORS.reset}`);
    return 1;
  }
  
  // Check required files
  console.log(`\n${COLORS.blue}Checking required files...${COLORS.reset}`);
  const fileResults = await checkRequiredFiles();
  
  let allFilesAccessible = true;
  
  fileResults.forEach(result => {
    if (result.success) {
      console.log(`${COLORS.green}✓ ${result.file} is accessible${COLORS.reset}`);
    } else {
      console.error(`${COLORS.red}✗ ${result.file} is not accessible: ${result.error}${COLORS.reset}`);
      allFilesAccessible = false;
    }
  });
  
  if (!allFilesAccessible) {
    console.error(`${COLORS.red}Some required files are not accessible!${COLORS.reset}`);
  }
  
  // Check MIME types
  console.log(`\n${COLORS.blue}Checking MIME types...${COLORS.reset}`);
  const mimeResults = await checkMimeTypes();
  
  let allMimeTypesCorrect = true;
  
  mimeResults.forEach(result => {
    if (result.success) {
      console.log(`${COLORS.green}✓ ${result.file} has correct MIME type: ${result.contentType}${COLORS.reset}`);
    } else if (result.error) {
      console.error(`${COLORS.red}✗ ${result.file} could not be checked: ${result.error}${COLORS.reset}`);
      allMimeTypesCorrect = false;
    } else {
      console.error(`${COLORS.red}✗ ${result.file} has incorrect MIME type: ${result.contentType} (expected: ${result.expected})${COLORS.reset}`);
      allMimeTypesCorrect = false;
    }
  });
  
  if (!allMimeTypesCorrect) {
    console.error(`${COLORS.red}Some files have incorrect MIME types!${COLORS.reset}`);
  }
  
  // Get latest deployment info
  console.log(`\n${COLORS.blue}Getting latest deployment information...${COLORS.reset}`);
  const deployment = getLatestDeployment();
  
  if (deployment) {
    console.log(`${COLORS.cyan}Latest deployment:${COLORS.reset}`);
    console.log(`  Environment: ${deployment.environment}`);
    console.log(`  Created at: ${new Date(deployment.created_at).toLocaleString()}`);
    console.log(`  Status: ${deployment.state || 'unknown'}`);
  }
  
  // Final assessment
  console.log(`\n${COLORS.cyan}Deployment Status Summary:${COLORS.reset}`);
  
  if (allFilesAccessible && allMimeTypesCorrect) {
    console.log(`${COLORS.green}✓ GitHub Pages deployment is healthy!${COLORS.reset}`);
    return 0;
  } else {
    console.error(`${COLORS.red}✗ GitHub Pages deployment has issues that need to be addressed!${COLORS.reset}`);
    return 1;
  }
}

// Run the monitor
monitorDeployment().then(exitCode => {
  process.exit(exitCode);
}).catch(error => {
  console.error(`${COLORS.red}Error: ${error.message}${COLORS.reset}`);
  process.exit(1);
});
