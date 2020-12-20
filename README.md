<center><a href="https://jasonwebb.github.io/reaction-diffusion-playground" title="Go to the playground!"><img src="https://raw.githubusercontent.com/jasonwebb/reaction-diffusion-playground/master/images/social-media-preview.jpg" alt="The text 'Reaction Diffusion Playground' in a wavy font over a black background with small green dots."></a></center>

<a href="https://raw.githubusercontent.com/jasonwebb/reaction-diffusion-playground/master/images/screenshots/all-screenshots.png" title="Sample screenshots"><img src="https://raw.githubusercontent.com/jasonwebb/reaction-diffusion-playground/master/images/screenshots/all-screenshots.png" alt="Grid of 12 screenshots, 4 columns and 3 rows, with the text Reaction Diffusion Playground overlaid on top."></a>

## What is reaction-diffusion?
Reaction-diffusion is a mathematical model describing how two chemicals might _react_ to each other as they _diffuse_ through a medium together. It was [proposed by Alan Turing in 1952](https://www.dna.caltech.edu/courses/cs191/paperscs191/turing.pdf) as a possible explanation for how the interesting patterns of stripes and spots that are seen on the skin/fur of animals like giraffes and leopards form.

The reaction-diffusion equations really only describes how the concentrations of the chemicals change over time, which means that all of the interesting patterns and behaviors that we see are [emergent phenomena](https://en.wikipedia.org/wiki/Emergence).

Here's what the equations look like:

![The two reaction-diffusion differential equations with boxes around each part, explained in text bubbles nearby.](https://camo.githubusercontent.com/6a5b7b40467455254ed239cfc966eda29f7cfcafda71e1212f407046396017e8/68747470733a2f2f7777772e6b61726c73696d732e636f6d2f72642d6571756174696f6e2e706e67)

_Credit to [Karl Sims](https://www.karlsims.com/rd.html) for the equation illustration above._

The most important terms, the ones we'll want to turn into tweakable parameters, are:

* `f` - feed rate. Determines how much of chemical A is added to the system in each iteration.
* `k` - kill rate. Determines how much of chemical B is removed from the system in each iteration.
* `dA` - diffusion rate for chemical A. Determines how much chemical A spreads to neighboring cells each iteration.
* `dB` - diffusion rate for chemical B. Determines how much of chemical B spreads to neighboring cells each iteration.

The other terms in the equation are usually kept constant, but might be worth playing around with once you are comfortable with the core parameters:

* <code>∇<sup>2</sup></code> - the Laplacian operator. Essentially a single value that represents the chemical concentration of the neighbors to the current cell.
* <code>AB<sup>2</sup></code> - reaction rate. Note that it is subtracted in the equation for chemical A and added in the equation for chemical B. This is how the chemical reaction converting chemical A into chemical B is modelled.
* <code>Δt</code> - timestep. Using `1.0` here means it runs at "normal" speed. Smaller values are like slow motion, and larger values make it run faster. Large values can cause the system to collapse.

[Learn more about reaction-diffusion in my morphogenesis-resources repo.](https://github.com/jasonwebb/morphogenesis-resources#reaction-diffusion)


## How does this project work?
Most reaction-diffusion simulations store values representing the concentrations of the two chemicals (`A` and `B`) in a 2D grid format, then applies the reaction-diffusion equations to each cell in the grid. In this simulation, [data textures](https://threejs.org/docs/index.html#api/en/textures/DataTexture) matching the size of the screen (canvas) are used for the 2D grid, and custom shaders are used to apply the reaction-diffusion equations to each pixel (texel) of these textures.

Each pixel/texel of the simulation data texture encodes the `A` and `B` concentrations for that location in the `R` and `G` channels as a normalized float value (`[0.0-1.0]`).

In each frame of the simulation, a custom fragment shader (`./glsl/simulationFrag.glsl`) reads the values of the last frame's data texture as an input and applies the reaction-diffusion equation to every pixel. Data textures are rendered back and forth between two [render targets](https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderTarget) many times per frame with a technique called ping-pong to speed things up.

Once the simulation has been run enough times, another fragment shader (`./glsl/displayFrag.glsl`) reads the latest data texture and maps the chemical concentration data to color values (configurable in the UI).

Just about every option you see in the UI controls one or more [uniforms](https://threejs.org/docs/#api/en/core/Uniform) that get passed to these fragment shaders to influence the reaction-diffusion equations or the way the data texture information is translated into colors.


## Using the app

![Annotated screenshot of the UI](https://raw.githubusercontent.com/jasonwebb/reaction-diffusion-playground/master/images/ui-guide.jpg)

### Equation parameters
Each of the four fundamental parameters of the reaction-diffusion equation (`f`, `k`, `dA`, `dB`), along with the timestep increment, can be changed using the sliders found at the top of the right panel. Change them gradually to avoid collapsing the system.

### Interactive parameter map
<a href="https://raw.githubusercontent.com/jasonwebb/reaction-diffusion-playground/master/images/parameter-map-screenshot.png"><img src="https://raw.githubusercontent.com/jasonwebb/reaction-diffusion-playground/master/images/parameter-map-screenshot.png" alt="Screenshot of interactive parameter map" align="right" width="200px"></a>Use this map to navigate through the parameter space easily and find areas with interesting patterns and behaviors. `k` values are plotted along the X axis, `f` values along the Y axis.

Use the crosshairs attached to the mouse position to navigate to a region you're interested in, then click to set the main `f` and `k` values to match where you clicked.

This map is inspired by the [work of Robert Munafo](http://mrob.com/pub/comp/xmorphia/).

### Seed pattern
Choose a pattern to use in the first frame of the simulation to seed the reaction. Each pattern has some additional options you can play with for different effects.

* **Circle** - radius.
* **Square** - width, height, scale, and rotation.
* **Text** - string, size, rotation.
* **Image** - upload an image from your computer, fit, scale, rotation.

Also provides buttons to reset the simulation with the selected pattern or clear the canvas completely.

### Rendering style
Control how the chemical concentration data is translated into visuals.

### Canvas size
Set the width and height of the simulation area.

You can also maximize the canvas to fit the entire viewport.

### Global actions
Buttons to pause/play or export an image of the current state of the simulation area.

### Style map
Upload an image from your computer to vary the `f`, `k`, `dA`, and `dB` values based on the brightness value of each pixel. The secondary values you choose here will become endstops in an interpolation calculation with the primary values (on the right UI pane). In other words, the four equation parameters will be interpolated to be between the original parameter values (on the right pane) and these secondary parameter values (left pane) using the brightness value of each pixel.

In addition to the reaction-diffusion equation parameters, you can also adjust the uniform scale, rotation, and X/Y offset of the image for different effects.

Your image will automatically be scaled to fit the entire canvas, so it may be stretched. Resize your image to match the width and height of the canvas (or at least its aspect ratio) to minimize distortion.

### Bias
Normally diffusion occurs evenly in all directions due to the default radially symmetrical Laplacian stencil. Using this X/Y pad you can "weight" this stencil to cause diffusion to favor one particular direction.

### Keyboard controls

* `Space` = pause/play.
* `r` = reset using the currently-selected seed pattern.
* `s` = save an image of the current canvas content.
* `u` = show/hide the UI.

### Mouse controls
Click and drag anywhere on the canvas to increase the concentration of the `B` chemical around the mouse position.

Use your mouse wheel to change the diameter of the area affected by clicking / dragging. The size of the brush is indicated with a circle that follows the mouse.

### MIDI controls
If you have an Akai LPD8 Wireless or a Novation Launch Control XL, mappings are provided for the various pads and knobs. See `./js/midi.js` for details.


## Technical notes

### Setting up and running locally
1. Run `npm install` to get all packages.
2. Run `npm run serve` to start up Webpack and launch the application in a live-reloading browser window.

### Technologies used
* [ThreeJS](https://threejs.org/) for WebGL conveniences like running custom shaders and managing uniforms.
* [GLSL](https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)) shaders for running the reaction-diffusion equation for every pixel of the screen and rendering.
* Vanilla ES6 JavaScript.
* MIDI support using [WebMidi.js](https://github.com/djipco/webmidi).
* [Webpack](https://webpack.js.org/) build system with live-reloading dev server.
* [Github Pages](https://pages.github.com/) to serve the files.

### Architecture and file structure

#### JavaScript
The most important file is `entry.js` - that's where the environment, UI, and the simulation itself are set up, and where the main update loop is. It sets up a ThreeJS environment with an orthographic camera and a scene containing a plane mesh that is oriented perpendicular to the camera so that it appears 2D.

In the `./js` folder are a bunch of modules split into files (all referenced in one way or another through `entry.js`):

* `export.js` - helper functions for downloading the canvas content as an image file.
* `firstFrame.js` - helper functions for seeding the first frame of the simulation with interesting patterns.
* `keyboard.js` - global keyboard commands.
* `map.js` - handles the modal dialog containing the interactive parameter map picker.
* `materials.js` - ThreeJS materials that associate uniforms with custom shaders. These get attached to the render targets and plane mesh to run and render the simulation.
* `midi.js` - mappings for MIDI controllers (Akai LPD8 Wireless and Novation Launch Control XL).
* `mouse.js` - mouse controls.
* `parameterMetadata.js` - limits and initial values for each of the parameters controlled by the UI.
* `parameterPresets.js` - presets for the main equation parameters (`f`, `k`, `dA`, `dB`).
* `parameterValues.js` - variables controlled by the UI.
* `renderTargets.js` - invisible buffers that allow us run the simulation multiple times per frame while only rendering data to the screen once.
* `stats.js` - FPS and iteration counters.
* `ui.js` - UI built with [Tweakpane](https://cocopon.github.io/tweakpane/).
  * `ui/left-pane.js` - left side of the UI, with style map and bias controls.
  * `ui/right-pane.js` - right side of the UI, with equation parameters, seeding, and rendering options.
* `uniforms.js` - variables that are passed into shaders.

#### GLSL

In the `./glsl` folder are:

* `displayFrag.glsl` - turns chemical concentration data textures into colorful pixels for the screen using a variety of techniques.
* `displayVert.glsl` - passes vertex data onto the `displayFrag.glsl` shader with no modifications.
* `passthroughFrag.glsl` - takes a passed texture and renders it as-is to the render targets to create a first frame of data for the simulation to work with.
* `passthroughVert.glsl` - passes vertex data onto the `displayFrag.glsl` shader with no modifications.
* `simulationFrag.glsl` - takes a passed texture of encoded chemical concentration data and applies the reaction-diffusion equation to each pixel, spitting out a new texture of data to be rendered to the screen or fed into another simulation pass.
* `simulationVert.glsl` - passes vertex data along with precomputed texel neighbor coordinates so that they can be automatically interpolated for use in the frag shader.

## References

### Fundamentals
These papers, articles, and videos helped me understand how the reaction-diffusion algorithm works.

* [The Chemical Basis of Morphogenesis](http://www.dna.caltech.edu/courses/cs191/paperscs191/turing.pdf) (PDF) paper by Alan Turing (1952)
* [Reaction-Diffusion Tutorial](https://www.karlsims.com/rd.html) by Karl Sims
* [Reaction-Diffusion by the Gray-Scott Model: Pearson's Parametrization](https://mrob.com/pub/comp/xmorphia/) by Robert Munafo (mrob)
* [Reaction Diffusion: A Visual Explanation](https://www.youtube.com/watch?v=LMzYrsfTiEw) by Arsiliath
* [Coding Challenge #13: Reaction Diffusion Algorithm in p5.js](https://www.youtube.com/watch?v=BV9ny785UNc) by Daniel Shiffman ([Github repo](https://github.com/CodingTrain/website/tree/master/CodingChallenges/CC_013_ReactionDiffusion) with both p5.js and Processing source code)

### Code
These articles, repos, and project pages helped me figure out how to build my implementation.

* [Gray-Scott - JavaScript experiments](https://github.com/pmneila/jsexp) by @pmneila
* [Processing: Reaction Diffusion Halftone patterns](https://vimeo.com/233530691) by Ignazio Lucenti
* [Reaction Diffusion](https://www.redblobgames.com/x/1905-reaction-diffusion/) (JavaScript + WebGL) by Red Blob Games
* [Reaction Diffusion](https://kaesve.nl/projects/reaction-diffusion/readme.html) by Ken Voskuil (look in the DOM)
* [Reaction-Diffusion Simulation in Three.js](https://github.com/colejd/Reaction-Diffusion-ThreeJS) (JavaScript + ThreeJS) by Jonathan Cole

### Creative
These projects inspired me to explore some of the creative possibilities of reaction-diffusion.

* [3D Printed Reaction Diffusion Patterns](https://www.instructables.com/id/3D-Printed-Reaction-Diffusion-Patterns/) Instructable by Reza Ali
* [Silhouect](https://cacheflowe.com/code/installation/silhouect) by Justin Gitlin (@cacheflowe)
* [Coral Cup](https://n-e-r-v-o-u-s.com/blog/?p=8222) by Nervous System
* [Reaction Lamps](https://n-e-r-v-o-u-s.com/projects/albums/reaction-products/) by Nervous System
* [Reaction Table](https://n-e-r-v-o-u-s.com/projects/albums/reaction-table/) by Nervous System
* [Reaction shelf](https://n-e-r-v-o-u-s.com/blog/?p=992) by Nervous System