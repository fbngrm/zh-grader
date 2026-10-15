#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { Converter } from 'opencc-js';
import { createDualGrader, parseSentences } from '../src/index.js';
const [hskFile, inputFile, outputFile] = process.argv.slice(2);
if (!hskFile || !inputFile || !outputFile) {
    console.error('Usage: zh-grader hsk.json sentences.txt grades.json');
    process.exit(1);
}
const grade = createDualGrader(JSON.parse(readFileSync(hskFile, 'utf8')), Converter({ from: 'tw', to: 'cn' }));
const sentences = parseSentences(readFileSync(inputFile, 'utf8')).map((sentence) => ({ ...sentence, grades: grade(sentence) }));
writeFileSync(outputFile, JSON.stringify({ methodVersion: 1, segmentation: 'Intl.Segmenter zh', icu: process.versions.icu, sentences }, null, 2) + '\n');
console.log(`Graded ${sentences.length} sentences → ${outputFile}`);
