npm t;
tsc;
browserify src/script/TypeScript/index.js -o src/script/index.js;
browserify src/script/TypeScript/Menu/Menu.js -o src/script/Menu.js;
browserify src/script/TypeScript/Cube/AboutMeCube.js -o src/script/Cube.js;

Remove-Item 'src\script\TypeScript\*' -Recurse -Include *.js;
Remove-Item 'src\script\TypeScript\*' -Recurse -Include *.js.map;