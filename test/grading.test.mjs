import test from 'node:test';
import assert from 'node:assert/strict';
import { createGrader, createDualGrader, parseSentences } from '../src/index.js';
const grade = createGrader({ 我: { hsk3_2025: 1 }, 今天: { hsk3_2025: 1 }, 去: { hsk3_2025: 1 }, 学校: { hsk3_2025: 1 }, 爱: { hsk3_2025: 1 }, 你: { hsk3_2025: 1 }, 量子力学: { hsk3_2025: 7 } });
test('2025 and HSK 2 grades remain separate from the 2021 standard', () => {
    const result = createDualGrader({ 爱好: { hsk2: 3, hsk3: 1, hsk3_2025: 2 } })({ text: '爱好' });
    assert.equal(result.hsk3_2025.level, 2);
    assert.equal(result.hsk2.level, 3);
    const missing = createDualGrader({ 你好: { hsk3: 1, hsk2: 1 } })({ text: '你好' });
    assert.equal(missing.hsk3_2025.level, null, 'never fall back to the 2021 level');
});
test('known words use the highest level and ignore punctuation', () => {
    const result = grade({ text: '我今天去学校！123' });
    assert.equal(result.level, 1);
    assert.equal(result.coverage, 1);
    assert.equal(result.tokens.length, 4);
});
test('unknown vocabulary never produces a misleading complete grade', () => {
    const result = grade({ text: '我爱阿斯匹林' });
    assert.equal(result.level, null);
    assert.equal(result.highestKnownLevel, 1);
    assert.ok(result.unlisted.length);
    assert.ok(result.coverage < 1);
});
test('empty/non-Chinese text is unclassified', () => {
    assert.equal(grade({ text: '123 hello!' }).level, null);
    assert.equal(grade({ text: '' }).coverage, 0);
});
test('corpus parsing retains IDs and removes AISHELL pinyin only', () => {
    assert.deepEqual(parseSentences('SSB00050001.wav\t我 wo3 爱 ai4 你 ni3\nBAC009S0002W0122 我 爱 你'), [
        { id: 'SSB00050001', text: '我爱你' }, { id: 'BAC009S0002W0122', text: '我爱你' },
    ]);
    assert.deepEqual(parseSentences('我爱你。你爱我！'), [{ text: '我爱你。' }, { text: '你爱我！' }]);
});
test('traditional normalization is applied before lookup', () => {
    const g = createGrader({ 学习: { hsk3_2025: 1 } }, (t) => t.replace('學習', '学习'));
    const r = g({ text: '學習' });
    assert.equal(r.text, '學習');
    assert.equal(r.normalized, '学习');
    assert.equal(r.level, 1);
});
test('advanced vocabulary stays grouped as 7–9, not a fabricated specific level', () => {
    assert.equal(grade({ text: '量子力学' }).level, 7);
});
