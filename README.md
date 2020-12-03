
## What is reaction-diffusion?
Reaction-diffusion is a mathematical model describing how two chemicals might _react_ to each other as they _diffuse_ through a medium together. It was proposed by Alan Turing in 1952 as a possible explanation for the interesting patterns of stripes and spots that are seen on the skin/fur of animals like giraffes and leopards.

The reaction-diffusion equations really only describes how the concentrations of the chemicals change over time, which means that all of the interesting patterns and behaviors that we see are [emergent](https://en.wikipedia.org/wiki/Emergence) phenomena.

Here's what the equations looks like:

![The two reaction-diffusion differential equations with boxes around each part, explained in text bubbles nearby.](https://camo.githubusercontent.com/6a5b7b40467455254ed239cfc966eda29f7cfcafda71e1212f407046396017e8/68747470733a2f2f7777772e6b61726c73696d732e636f6d2f72642d6571756174696f6e2e706e67)

_Credit to [Karl Sims](https://www.karlsims.com/rd.html) for the equation illustration above._

The most important terms, the ones we'll want to turn into tweakable parameters, are:

* `f` - feed rate. Determines how much of chemical A is added to the system in each iteration.
* `k` - kill rate. Determines how much of chemical B is removed from the system in each iteration.
* `dA` - diffusion rate for chemical A. Determines how much chemical A spreads to neighboring cells each iteration.
* `dB` - diffusion rate for chemical B. Determines how much of chemical B spreads to neighboring cells each iteration.

The other terms in the equation are usually kept constant, but might be worth playing around with once you are comfortable with the core parameters:

* ∇<sup>2</sup> - the Laplacian operator. Essentially a single value that represents the chemical concentration of the neighbors to the current cell.
* AB<sup>2</sup> - reaction rate. Note that it is subtracted in the equation for chemical A and added in the equation for chemical B. This is how the chemical reaction converting chemical A into chemical B is modelled.
* Δt - timestep. Using `1.0` here means it runs at "normal" speed. Smaller values are like slow motion, and larger values make it run faster. Large values can cause the system to collapse.

[Learn more about reaction-diffusion in my morphogenesis-resources repo.](https://github.com/jasonwebb/morphogenesis-resources#reaction-diffusion)


## How does this project work?
Most reaction-diffusion simulations store values representing the concentrations of the two chemicals (`A` and `B`) in a 2D grid format, then applies the reaction-diffusion equation. In this simulation, image textures are used as the grid, with each pixel encoding the `A` and `B` concentration values for that location in the `R` and `G` channels. To render interesting imagery to the screen, a fragment shader (`./glsl/displayFrag.glsl`) reads these texture values and turns them into colors for every pixel using a few different techniques.

In each frame of the simulation, a custom shader (`./glsl/simulationFrag.glsl`) reads the values of the last frame's image texture and applies the reaction-diffusion equation to every pixel. It produces a new "image" that is rendered to an invisible [render target](https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderTarget), which can then be read as a texture and used as input for the following frame. To speed things up, this process of rendering to a render target and feeding the resulting data (texture) to the next pass of the simulation is done many times per frame - a graphics programming trick called "ping pong". Once this simulation cycle has run a certain number of times, a different shader (`./glsl/displayFrag.glsl`) reads the image texture and translate it into pretty colors.


## Using the app

### Equation parameters
Each of the four fundamental parameters of the reaction-diffusion equation (`f`, `k`, `dA`, `dB`), along with the timestep increment, can be changed using the sliders found at the top of the right panel. Change them gradually to avoid collapsing the system.

### Parameter picker map
Sometimes it can be frustrating to randomly move the parameter sliders around, since you can easily land in a "dead zone" where nothing interesting happens. To help users navigate to interesting regions of the parameter space,

### Seed pattern

### Rendering style

### Canvas size

### Style map

### Bias

### Keyboard controls

* `Space` = pause/play
* `r` = reset
* `s` = save an image of the current canvas content
* `u` = show/hide the UI

### Mouse controls
Click to set the B to ???

Use your mouse wheel to change the diameter of the area affected by clicking / dragging.

### MIDI controls
If you have an Akai LPD8 Wireless or a Novation Launch Control XL, mappings are provided for the various pads and knobs. See `./js/midi.js` for details.


## Technical notes

### Setting up and running locally
1. Run `npm install` to get all packages.
2. Run `npm run serve` to start up Webpack and launch the application in a live-reloading browser window.

### Technologies used
* ThreeJS framework for WebGL rendering
* GLSL
* Vanilla ES6 JavaScript.
* MIDI support using [WebMidi.js](https://github.com/djipco/webmidi).
* Webpack build system with live-reloading dev server.
* Github Pages to serve the files.

When you've got a set of changes that you'd like to

### Files

#### JavaScript
The most important file is `entry.js`. It sets up the ThreeJS environment with a camera, scene, and plane mesh where the simulation output will be rendered. It also contains the main program loop (`update()`) that implements the "ping pong" technique to render simulation data to render targets a bunch of times before displaying anything on the screen.

In the `./js` folder are:

* `export.js` - functions for downloading the canvas content as an image file.
* `firstFrame.js` - helper functions for seeding the first frame of the simulation with interesting patterns.
* `keyboard.js` - global keyboard commands.
* `map.js` - modal dialog with parameter map picker.
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

* `displayFrag.glsl` -
* `displayVert.glsl` -
* `passthroughFrag.glsl` -
* `passthroughVert.glsl` -
* `simulationFrag.glsl` -
* `simulationVert.glsl` -

## References

```
TODO
```