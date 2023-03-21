// Import toolbar and property items
import { toolbar } from "./toolbar.js";
import { properties } from "./properties.js";
import WebGL from "../lib/WebGL.js";

let cubeRotation = 0.0;
let deltaTime = 0;

main();

// Main function
function main() {
    // Get canvas from HTML
    const canvas = document.querySelector("#glcanvas");

    // Initialize GL
    const webgl = new WebGL(canvas);

    // Draw the scene repeatedly
    let then = 0;

    function render(now) {
        deltaTime = now * 0.001 - then;
        then = now * 0.001;

        webgl.drawScene(webgl, cubeRotation);
        cubeRotation += deltaTime;
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
