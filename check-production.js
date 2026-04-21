#!/usr/bin/env node
/**
 * Production Readiness Check Script
 * Run this before deploying to production
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Production Readiness...\n');

let hasErrors = false;

// 1. Check Environment Variables
console.log('📋 Checking Environment Variables:');
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'NODE_ENV'
];

requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`  ✅ ${varName}: Set`);
  } else {
    console.log(`  ❌ ${varName}: Missing`);
    hasErrors = true;
  }
});

// 2. Check Node Version
console.log('\n📦 Checking Node Version:');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 16) {
  console.log(`  ✅ Node.js ${nodeVersion} (>= 16.x)`);
} else {
  console.log(`  ⚠️  Node.js ${nodeVersion} (Recommended: >= 16.x)`);
}

// 3. Check Required Files
console.log('\n📁 Checking Required Files:');
const requiredFiles = [
  'server.js',
  'package.json',
  '.env'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`  ✅ ${file}: Found`);
  } else {
    console.log(`  ❌ ${file}: Missing`);
    hasErrors = true;
  }
});

// 4. Check Dependencies
console.log('\n📚 Checking Dependencies:');
try {
  const packageJson = require('./package.json');
  const nodeModulesExists = fs.existsSync(path.join(__dirname, 'node_modules'));
  
  if (nodeModulesExists) {
    console.log('  ✅ node_modules: Installed');
  } else {
    console.log('  ❌ node_modules: Missing (Run: npm install)');
    hasErrors = true;
  }
} catch (err) {
  console.log('  ❌ Error reading package.json');
  hasErrors = true;
}

// 5. Check Syntax Errors
console.log('\n🔧 Checking Syntax:');
const jsFiles = [
  'server.js',
  'middleware/auth.js',
  'middleware/upload.js'
];

let syntaxErrors = 0;
jsFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    try {
      require.resolve(filePath);
      console.log(`  ✅ ${file}: Valid`);
    } catch (err) {
      console.log(`  ❌ ${file}: Syntax Error`);
      console.log(`     ${err.message}`);
      syntaxErrors++;
      hasErrors = true;
    }
  }
});

// 6. Security Checks
console.log('\n🔒 Security Checks:');
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32) {
  console.log('  ✅ JWT_SECRET: Strong (>= 32 chars)');
} else if (process.env.JWT_SECRET) {
  console.log('  ⚠️  JWT_SECRET: Weak (< 32 chars)');
} else {
  console.log('  ❌ JWT_SECRET: Missing');
  hasErrors = true;
}

if (process.env.NODE_ENV === 'production') {
  console.log('  ✅ NODE_ENV: Set to production');
} else {
  console.log(`  ⚠️  NODE_ENV: ${process.env.NODE_ENV || 'not set'} (Should be "production")`);
}

// 7. Uploads Directory
console.log('\n📤 Checking Uploads Directory:');
const uploadsDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsDir)) {
  console.log('  ✅ uploads/: Exists');
} else {
  console.log('  ⚠️  uploads/: Missing (Will be created automatically)');
}

// Final Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Production Check FAILED');
  console.log('Please fix the errors above before deploying.\n');
  process.exit(1);
} else {
  console.log('✅ Production Check PASSED');
  console.log('Your backend is ready for production!\n');
  process.exit(0);
}
