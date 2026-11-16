import test from 'node:test';
import assert from 'node:assert/strict';
import {keywords, eligible, approveAnswer, postingAllowed, DISCLOSURE} from '../src/core.mjs';
const question = {
  id:'t3_abcdef',authorId:'t2_abcdef',title:'How can I fix my Windows printer?',
  body:'My Windows computer printer has a paper error after setup.',
  flair:'Help',locked:false,archived:false,removed:false,spam:false,nsfw:false,quarantined:false
};
const options={requireHelpFlair:true,topicKeywords:'windows,computer,printer'};
const answer={shouldReply:true,risk:'low',confidence:95,answer:'First, clear the printer queue and restart the print spooler. Check the paper tray and its driver, then print a test page. If it persists, include the printer model and exact error.'};
test('matching question is eligible',()=>assert.equal(eligible(question,options),true));
test('non-help flair excluded',()=>assert.equal(eligible({...question,flair:'Discussion'},options),false));
test('removed content excluded',()=>assert.equal(eligible({...question,removed:true},options),false));
test('high-stakes request excluded',()=>assert.equal(eligible({...question,body:'Need medical diagnosis with my Windows printer'},options),false));
test('personal contact data excluded',()=>assert.equal(eligible({...question,body:'My email test@example.com and my Windows printer'},options),false));
test('off-topic excluded',()=>assert.equal(eligible(question,{...options,topicKeywords:'gardening'}),false));
test('keywords cleaned',()=>assert.deepEqual(keywords('Windows,**unsafe**,printer'),['windows','printer']));
test('answer includes disclosure',()=>assert.ok(approveAnswer(answer,90).endsWith(DISCLOSURE)));
test('high risk answer skipped',()=>assert.equal(approveAnswer({...answer,risk:'high'}),null));
test('low confidence answer skipped',()=>assert.equal(approveAnswer({...answer,confidence:65}),null));
test('default disabled',()=>assert.equal(postingAllowed({enabled:false,autoPublish:false,globalPause:true,operatorPaused:true}),false));
test('every independent guard required',()=>{
  const c={enabled:true,autoPublish:true,globalPause:false,operatorPaused:false};
  assert.equal(postingAllowed(c),true);
  for (const k of Object.keys(c)) assert.equal(postingAllowed({...c,[k]:!c[k]}),false);
});
