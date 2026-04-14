import * as fs from "fs";
import * as path from "path";
import he from "he";

declare const require: any;

const inputFile = path.join(__dirname, "..", "input.txt");
const outputDir = path.join(__dirname, "..", "xml");

// Ensure output folder exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const lines = fs.readFileSync(inputFile, "utf8").split(/\r?\n/);

let index = 1;
let lineNumber = 0;

function formatXml(xml: string): string {
    // Try using `xml-formatter` (simple pretty printer) if installed
    try {
        const xmlFormatter = require('xml-formatter');
        return xmlFormatter(xml, { indentation: '  ', collapseContent: true });
    } catch {
        // continue to next option
    }

    // Try using fast-xml-parser to parse and rebuild with formatting
    try {
        const fastXml = require('fast-xml-parser');
        const { XMLParser, XMLBuilder } = fastXml;
        const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
        const obj = parser.parse(xml);
        const builder = new XMLBuilder({ format: true, indentBy: '  ', ignoreAttributes: false, attributeNamePrefix: '' });
        return builder.build(obj);
    } catch {
        // fallback to simple formatter below
    }

    // Fallback: conservative pretty printer
    xml = xml.replace(/>\s*</g, '>\n<');
    const parts = xml.split('\n');
    let pad = 0;
    const indent = '  ';
    const out: string[] = [];

    for (let raw of parts) {
        const line = raw.trim();
        if (!line) continue;

        if (line.startsWith('<?') || line.startsWith('<!--')) {
            out.push(indent.repeat(pad) + line);
            continue;
        }

        if (line.startsWith('</')) {
            pad = Math.max(pad - 1, 0);
            out.push(indent.repeat(pad) + line);
            continue;
        }

        if (line.match(/<[^>]+\/\s*>$/)) {
            out.push(indent.repeat(pad) + line);
            continue;
        }

        if (line.match(/^<[^>]+>$/) && !line.match(/^<.*<\/.*>$/)) {
            out.push(indent.repeat(pad) + line);
            pad++;
            continue;
        }

        out.push(indent.repeat(pad) + line);
    }

    return out.join('\n').trim();
}

for (const line of lines) {
    lineNumber++;

    // non-greedy capture so inner quotes don't consume beyond the field
    const match = line.match(/^"(.*?)",/);

    if (!match || !match[1]) {
        console.warn(`Line ${lineNumber} does not match expected format. Skipping.`);
        continue;
    }

    let escapedXml = match[1];

    // CSV escaping: double quotes inside a quoted field are represented as "" - convert them back to a single quote
    escapedXml = escapedXml.replace(/""/g, '"');

    // decode HTML entities if present
    const xml = he.decode(escapedXml);

    const pretty = formatXml(xml);

    fs.writeFileSync(
        path.join(outputDir, `deadlock_${index}.xml`),
        pretty,
        "utf8"
    );

    index++;
}

console.log(`Extracted ${index - 1} XML files into '${outputDir}'`);
