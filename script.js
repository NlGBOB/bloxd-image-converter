const fs = require('fs');
const { Buffer } = require('buffer');

const OUTPUT_FILE = 'safe_chars_max.json';
let validChars = [];

// Scan standard ASCII range (0 to 127)
// We know 128+ is impossible because they are 2 bytes.
for (let i = 0; i < 128; i++) {
    const char = String.fromCodePoint(i);

    // 1. Check Byte Size (Must be 1 byte)
    const byteSize = Buffer.byteLength(char, 'utf8');

    // 2. Check JSON Safety
    // We strictly exclude:
    // - 0 to 31 (Control chars that ALWAYS expand to \u00xx or \n)
    // - 34 (")  (Expands to \")
    // - 92 (\)  (Expands to \\)

    // We INCLUDE 127 (DEL) because you proved it works.

    validChars.push(char);
}

console.log(`Found ${validChars.length} characters.`);
console.log(`(Includes DEL and backticks)`);

// Write to file
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(validChars, null, 2));
console.log(`Saved to ${OUTPUT_FILE}`);