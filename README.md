
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

* <code>∇<sup>2</sup></code> - the Laplacian operator. Essentially a single value that represents the chemical concentration of the neighbors to the current cell.
* <code>AB<sup>2</sup></code> - reaction rate. Note that it is subtracted in the equation for chemical A and added in the equation for chemical B. This is how the chemical reaction converting chemical A into chemical B is modelled.
* <code>Δt</code> - timestep. Using `1.0` here means it runs at "normal" speed. Smaller values are like slow motion, and larger values make it run faster. Large values can cause the system to collapse.

[Learn more about reaction-diffusion in my morphogenesis-resources repo.](https://github.com/jasonwebb/morphogenesis-resources#reaction-diffusion)


## How does this project work?
Most reaction-diffusion simulations store values representing the concentrations of the two chemicals (`A` and `B`) in a 2D grid format, then applies the reaction-diffusion equation. In this simulation, image textures are used as the grid, with each pixel encoding the `A` and `B` concentration values for that location in the `R` and `G` channels. To render interesting imagery to the screen, a fragment shader (`./glsl/displayFrag.glsl`) reads these texture values and turns them into colors for every pixel using a few different techniques.

In each frame of the simulation, a custom shader (`./glsl/simulationFrag.glsl`) reads the values of the last frame's image texture and applies the reaction-diffusion equation to every pixel. It produces a new "image" that is rendered to an invisible [render target](https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderTarget), which can then be read as a texture and used as input for the following frame. To speed things up, this process of rendering to a render target and feeding the resulting data (texture) to the next pass of the simulation is done many times per frame - a graphics programming trick called "ping pong". Once this simulation cycle has run a certain number of times, a different shader (`./glsl/displayFrag.glsl`) reads the image texture and translate it into pretty colors.


## Using the app

![Annotated screenshot of the UI](https://raw.githubusercontent.com/jasonwebb/2d-reaction-diffusion-experiments/master/images/ui-guide.png)

### Equation parameters
Each of the four fundamental parameters of the reaction-diffusion equation (`f`, `k`, `dA`, `dB`), along with the timestep increment, can be changed using the sliders found at the top of the right panel. Change them gradually to avoid collapsing the system.

### Parameter picker map
Sometimes it can be frustrating to randomly move the parameter sliders around, since you can easily land in a "dead zone" where nothing interesting happens. To help users navigate to interesting regions of the parameter space,

### Seed pattern
Choose a **pattern** to use in the first frame of the simulation to **"seed"** the reaction.

Also provides a button to reset the simulation with the selected pattern as the first frame (same exact thing as pressing the `r` key).

### Rendering style
Control how the reaction-diffusion data is translated into visuals.

### Canvas size
Set the **width** and **height** of the simulation area.

You can also **maximize** the canvas to fit the entire viewport.

### Global actions
Buttons for **pause/play** and to **export an image** of the current state of the simulation area.

### Style map

### Bias

### Keyboard controls

* `Space` = pause/play.
* `r` = reset using the currently-selected seed pattern.
* `s` = save an image of the current canvas content.
* `u` = show/hide the UI.

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

```
TODO
```