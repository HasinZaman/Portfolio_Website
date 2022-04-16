npm t;
tsc;
browserify src/script/TypeScript/SkillTable/SkillTable.js -o src/script/SkillTable.js;
browserify src/script/TypeScript/ProjectSearch/ProjectSearch.js -o src/script/ProjectSearch.js;
Remove-Item 'src\script\TypeScript\*' -Recurse -Include *.js;
Remove-Item 'src\script\TypeScript\*' -Recurse -Include *.js.map;