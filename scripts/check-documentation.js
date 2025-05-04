#!/usr/bin/env node

/**
 * Documentation coverage checker script
 * 
 * This script analyzes the codebase to check for proper documentation coverage.
 * It reports files and exported symbols that are missing documentation.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SRC_DIR = path.join(__dirname, '..', 'src');
const DOCS_DIR = path.join(__dirname, '..', 'docs');
const MIN_COMMENT_RATIO = 0.2; // At least 20% of the file should be comments

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
 * Get all TypeScript files in a directory recursively
 */
function getTypeScriptFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(getTypeScriptFiles(filePath));
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts') && !file.endsWith('.test.ts')) {
      results.push(filePath);
    }
  });
  
  return results;
}

/**
 * Calculate the comment ratio for a file
 */
function getCommentRatio(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let commentLines = 0;
  let totalLines = lines.length;
  
  // Count comment lines
  let inBlockComment = false;
  
  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (trimmedLine === '') {
      totalLines--;
      return;
    }
    
    // Check for block comments
    if (inBlockComment) {
      commentLines++;
      if (trimmedLine.includes('*/')) {
        inBlockComment = false;
      }
      return;
    }
    
    // Check for start of block comment
    if (trimmedLine.startsWith('/**') || trimmedLine.startsWith('/*')) {
      commentLines++;
      if (!trimmedLine.includes('*/')) {
        inBlockComment = true;
      }
      return;
    }
    
    // Check for single-line comments
    if (trimmedLine.startsWith('//')) {
      commentLines++;
    }
  });
  
  return commentLines / totalLines;
}

/**
 * Check if a file has a header comment
 */
function hasHeaderComment(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Skip empty lines at the beginning
  let startIndex = 0;
  while (startIndex < lines.length && lines[startIndex].trim() === '') {
    startIndex++;
  }
  
  // Check if the first non-empty line is the start of a comment
  return startIndex < lines.length && 
         (lines[startIndex].trim().startsWith('/**') || 
          lines[startIndex].trim().startsWith('/*') ||
          lines[startIndex].trim().startsWith('//'));
}

/**
 * Check if exported symbols are documented
 */
function checkExportedSymbols(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const undocumentedExports = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for export declarations
    if (line.startsWith('export ') && 
        (line.includes('function ') || 
         line.includes('class ') || 
         line.includes('interface ') || 
         line.includes('type ') ||
         line.includes('const ') ||
         line.includes('let '))) {
      
      // Extract the symbol name
      let symbolName = '';
      if (line.includes('function ')) {
        symbolName = line.split('function ')[1].split('(')[0].trim();
      } else if (line.includes('class ')) {
        symbolName = line.split('class ')[1].split(' ')[0].trim();
      } else if (line.includes('interface ')) {
        symbolName = line.split('interface ')[1].split(' ')[0].trim();
      } else if (line.includes('type ')) {
        symbolName = line.split('type ')[1].split(' ')[0].trim();
      } else if (line.includes('const ')) {
        symbolName = line.split('const ')[1].split(' ')[0].split('=')[0].trim();
      } else if (line.includes('let ')) {
        symbolName = line.split('let ')[1].split(' ')[0].split('=')[0].trim();
      }
      
      // Check if the previous lines contain a comment
      let hasComment = false;
      for (let j = i - 1; j >= 0; j--) {
        const prevLine = lines[j].trim();
        
        if (prevLine === '') {
          continue;
        }
        
        if (prevLine.endsWith('*/') || prevLine.startsWith('//')) {
          hasComment = true;
          break;
        }
        
        // If we hit a non-comment, non-empty line, stop looking
        break;
      }
      
      if (!hasComment && symbolName) {
        undocumentedExports.push(symbolName);
      }
    }
  }
  
  return undocumentedExports;
}

/**
 * Main function to check documentation coverage
 */
function checkDocumentationCoverage() {
  console.log(`${COLORS.cyan}Checking documentation coverage...${COLORS.reset}\n`);
  
  // Get all TypeScript files
  const files = getTypeScriptFiles(SRC_DIR);
  
  let totalFiles = files.length;
  let filesWithLowCommentRatio = 0;
  let filesWithoutHeaderComment = 0;
  let filesWithUndocumentedExports = 0;
  let totalUndocumentedExports = 0;
  
  // Check each file
  files.forEach(file => {
    const relativePath = path.relative(path.join(__dirname, '..'), file);
    const commentRatio = getCommentRatio(file);
    const hasHeader = hasHeaderComment(file);
    const undocumentedExports = checkExportedSymbols(file);
    
    let hasIssues = false;
    
    // Report issues
    if (commentRatio < MIN_COMMENT_RATIO) {
      if (!hasIssues) {
        console.log(`${COLORS.yellow}${relativePath}${COLORS.reset}`);
        hasIssues = true;
      }
      console.log(`  ${COLORS.red}Low comment ratio: ${Math.round(commentRatio * 100)}% (minimum: ${MIN_COMMENT_RATIO * 100}%)${COLORS.reset}`);
      filesWithLowCommentRatio++;
    }
    
    if (!hasHeader) {
      if (!hasIssues) {
        console.log(`${COLORS.yellow}${relativePath}${COLORS.reset}`);
        hasIssues = true;
      }
      console.log(`  ${COLORS.red}Missing header comment${COLORS.reset}`);
      filesWithoutHeaderComment++;
    }
    
    if (undocumentedExports.length > 0) {
      if (!hasIssues) {
        console.log(`${COLORS.yellow}${relativePath}${COLORS.reset}`);
        hasIssues = true;
      }
      console.log(`  ${COLORS.red}Undocumented exports: ${undocumentedExports.join(', ')}${COLORS.reset}`);
      filesWithUndocumentedExports++;
      totalUndocumentedExports += undocumentedExports.length;
    }
    
    if (hasIssues) {
      console.log('');
    }
  });
  
  // Print summary
  console.log(`${COLORS.cyan}Documentation Coverage Summary:${COLORS.reset}`);
  console.log(`Total files: ${totalFiles}`);
  console.log(`Files with low comment ratio: ${filesWithLowCommentRatio} (${Math.round(filesWithLowCommentRatio / totalFiles * 100)}%)`);
  console.log(`Files without header comment: ${filesWithoutHeaderComment} (${Math.round(filesWithoutHeaderComment / totalFiles * 100)}%)`);
  console.log(`Files with undocumented exports: ${filesWithUndocumentedExports} (${Math.round(filesWithUndocumentedExports / totalFiles * 100)}%)`);
  console.log(`Total undocumented exports: ${totalUndocumentedExports}`);
  
  // Check if documentation files exist
  const requiredDocs = ['CODE_DOCUMENTATION.md', 'TYPESCRIPT.md', 'puzzle-types.md'];
  const missingDocs = [];
  
  requiredDocs.forEach(doc => {
    if (!fs.existsSync(path.join(DOCS_DIR, doc))) {
      missingDocs.push(doc);
    }
  });
  
  if (missingDocs.length > 0) {
    console.log(`\n${COLORS.red}Missing documentation files: ${missingDocs.join(', ')}${COLORS.reset}`);
  }
  
  // Final assessment
  const totalIssues = filesWithLowCommentRatio + filesWithoutHeaderComment + filesWithUndocumentedExports + missingDocs.length;
  
  if (totalIssues === 0) {
    console.log(`\n${COLORS.green}✓ Documentation coverage is good!${COLORS.reset}`);
    return 0;
  } else {
    console.log(`\n${COLORS.yellow}⚠ Documentation coverage needs improvement (${totalIssues} issues found)${COLORS.reset}`);
    return 1;
  }
}

// Run the check
const exitCode = checkDocumentationCoverage();
process.exit(exitCode);
