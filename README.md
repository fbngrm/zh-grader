# zh-grader

Reusable JavaScript Chinese vocabulary grading for Node.js and browsers.
The code is MIT licensed. Vocabulary datasets are supplied separately and retain
their own source notices; this package does not bundle or relicense them.

```sh
npm install github:fbngrm/zh-grader#v0.1.0
```

```js
import { createDualGrader } from '@fbngrm/zh-grader';
import { Converter } from 'opencc-js';
// Read or fetch the versioned hsk.json from @fbngrm/zh-dictionary.
const hsk = { 爱好: { hsk2: 3, hsk3: 1, hsk3_2025: 2 } };
const grade = createDualGrader(hsk, Converter({ from: 'tw', to: 'cn' }));
const result = grade({ text: '爱好' });
console.log(result.hsk3_2025.level); // 2
console.log(result.hsk2.level);      // 3
```

`createGrader(hsk, simplify?, version = 'hsk3_2025')` grades one version.
`createDualGrader(hsk, simplify?)` grades HSK 2.0 and the 2025 syllabus separately.
The default normalizer is identity; pass OpenCC for traditional Chinese input.
`parseSentences(text)` handles ordinary Chinese text and AISHELL transcript formats.
`compactGrade(result)` keeps level, highest listed level, coverage, and unlisted words.

## Method and limits

After optional normalization, `Intl.Segmenter('zh', {granularity:'word'})` splits
the sentence. Tokens containing Chinese characters are looked up by exact spelling.
The sentence receives the highest token level only when every Chinese token is
listed. Otherwise its level is null, and the result explains the unknown words.
Coverage counts token occurrences, not unique words. Level 7 represents the 7–9 band.
The legacy `hsk3` data field means the 2021 standard; it is never a fallback for 2025.

This estimates vocabulary difficulty, not grammar, comprehension, pronunciation,
or official exam proficiency. Tokenization and source-data coverage affect results.
Homographs use the levels provided by the caller; no word-sense disambiguation is
performed. ICU versions may segment differently; pin the runtime for repeatable batches.

## Local JSON export

```sh
npx zh-grader /path/to/hsk.json /path/to/sentences.txt /path/to/grades.json
npm test
```

The CLI normalizes traditional Chinese with OpenCC and writes both grades with
full token details. It reads local files only. The website and Mandarin corpus
pipeline use this same implementation.
