#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Formats package.json in JetBrains WebStorm style with key alignment
 */
function formatPackageJson() {
	const packageJsonPath = path.join(__dirname, '..', 'package.json');
	
	try {
		// Read current package.json
		const packageContent = fs.readFileSync(packageJsonPath, 'utf8');
		const packageData = JSON.parse(packageContent);
		
		// Format in the required style
		const formattedContent = formatJsonWithAlignment(packageData);
		
		// Write back
		fs.writeFileSync(packageJsonPath, formattedContent, 'utf8');
		
		console.log('✅ package.json formatted in JetBrains WebStorm style');
	} catch (error) {
		console.error('❌ Error formatting package.json:', error.message);
		process.exit(1);
	}
}

/**
 * Formats JSON object with key alignment
 */
function formatJsonWithAlignment(obj, indent = 0) {
	const tab = '\t';
	const currentIndent = tab.repeat(indent);
	const nextIndent = tab.repeat(indent + 1);
	
	if (Array.isArray(obj)) {
		if (obj.length === 0) return '[]';
		
		const items = obj.map(item => {
			if (typeof item === 'string') {
				return `${nextIndent}"${item}"`;
			} else {
				return `${nextIndent}${formatJsonWithAlignment(item, indent + 1)}`;
			}
		});
		
		return `[\n${items.join(',\n')}\n${currentIndent}]`;
	}
	
	if (typeof obj === 'object' && obj !== null) {
		const keys = Object.keys(obj);
		if (keys.length === 0) return '{}';
		
		// Find maximum key length for alignment
		const maxKeyLength = Math.max(...keys.map(key => key.length));
		
		const items = keys.map(key => {
			const value = obj[key];
			const quotedKey = `"${key}"`;
			// Align keys: add spaces after quotes to required length
			const paddedKey = quotedKey.padEnd(maxKeyLength + 2); // +2 for quotes
			
			if (typeof value === 'string') {
				return `${nextIndent}${paddedKey}: "${value}"`;
			} else if (typeof value === 'number' || typeof value === 'boolean') {
				return `${nextIndent}${paddedKey}: ${value}`;
			} else {
				const formattedValue = formatJsonWithAlignment(value, indent + 1);
				return `${nextIndent}${paddedKey}: ${formattedValue}`;
			}
		});
		
		return `{\n${items.join(',\n')}\n${currentIndent}}`;
	}
	
	// Primitive types
	if (typeof obj === 'string') {
		return `"${obj}"`;
	}
	
	return String(obj);
}

// Run formatting
if (require.main === module) {
	formatPackageJson();
}

module.exports = { formatPackageJson, formatJsonWithAlignment };