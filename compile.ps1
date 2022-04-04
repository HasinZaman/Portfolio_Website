npm t;
tsc;
browserify src/script/TypeScript/SkillTable/SkillTable.ts -o src/script/SkillTable.js;
Remove-Item 'src\script\TypeScript\*' -Recurse -Include *.js;
Remove-Item 'src\script\TypeScript\*' -Recurse -Include *.js.map;