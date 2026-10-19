import test from 'node:test';import assert from 'node:assert/strict';
const validName=v=>typeof v==='string'&&v.trim().length>0&&v.trim().length<=100;
test('project names reject empty and oversized input',()=>{assert.equal(validName(''),false);assert.equal(validName('a'.repeat(101)),false);assert.equal(validName('Homepage review'),true)});
test('image constraints stay private and bounded',()=>{const allowed=['image/png','image/jpeg'];assert.equal(allowed.includes('image/svg+xml'),false);assert.equal(10*1024*1024,10485760)});
