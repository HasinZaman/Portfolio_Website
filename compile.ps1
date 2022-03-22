npm t;
tsc;
browserify src/script/TypeScript/SkillBalls/Enviorment.js -o src/script/BallSim.js;
Remove-Item 'src\script\TypeScript\*' -Recurse -Include *.js;
Remove-Item 'src\script\TypeScript\*' -Recurse -Include *.js.map;