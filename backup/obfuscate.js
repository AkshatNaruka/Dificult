const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');

const originalCode = fs.readFileSync('script.js', 'utf8');

const obfuscationResult = JavaScriptObfuscator.obfuscate(originalCode, {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 1,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 1,
  encodeUnicodeLiterals: true,
});

fs.writeFileSync('script.min.js', obfuscationResult.getObfuscatedCode(), 'utf8');
