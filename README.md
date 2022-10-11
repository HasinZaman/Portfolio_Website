# Portfolio_Website
 
This repository contains the source code for the front end of my [portfolio website](http://hasinzaman.link).

# Render Pipe Line

The website uses its own proprietary render pipeline to create a dynamic header. In which, triangles in 3D converted into a set svg xml elements.

The relevant files are
 - [RenderPipeLine](src/script/TypeScript/Header/RenderPipeLine/)
 - [Mountain](src/script/TypeScript/Header/Mountain/)
 - [Star](src/script/TypeScript/Header/Stars/)
 - [Math](src/script//TypeScript/Math/)

# Random

The website sometimes require the use of random numbers. However, the javascript Math.Random() function implementation does not support the use of seeds. This means, a predictable set of pseudo random number cannot to be generated. Which, would be used to create the same dynamic procedural header. This is why the website has it's own implementation of random using [Linear congruential generator](https://en.wikipedia.org/wiki/Linear_congruential_generator)

The relevant files are
 - [Random](src/script/TypeScript/Math/Random/)

# Math

The website often requires the use many different mathematical ideas - from vectors, matrixes, interpolation algorithms, etc. The relevant scripts are used from everything from the render pipe line, about me cube & colour selection.

The relevant files are
 - [Math](src/script//TypeScript/Math/)
 - [Cyclic Group](src/script/TypeScript/Cube/CycleGroup.ts)
 - [Colour](src/script/TypeScript/Colour)