npm t;
tsc;
browserify src/script/TypeScript/index.js -o src/script/index.js;
Remove-Item 'src\script\TypeScript\*' -Recurse -Include *.js;
Remove-Item 'src\script\TypeScript\*' -Recurse -Include *.js.map;