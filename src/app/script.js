// Import toolbar and property items
import { toolbar } from "./toolbar.js";
import { properties } from "./properties.js";
import {
    setShape,
    saveObject,
    loadObject,
    setRotasiX,
    setRotasiY,
    setRotasiZ,
    setTranslasiX,
    setTranslasiY,
    setTranslasiZ,
    setScaleX,
    setScaleY,
    setScaleZ,
    setProjectionType,
    setShadingMode,
    setAnimationMode,
    resetView,
    setRadius,
    setAngleX,
    setAngleY,
    setAngleZ,
} from "./utils.js";
import WebGL from "../lib/WebGL.js";

let cubeRotation = 0.0;
let deltaTime = 0;

// Set html elements
const shape = document.getElementById("shape");
const load = document.getElementById("load");
const save = document.getElementById("save");
const rotasiX = document.getElementById("rotasiX");
const rotasiY = document.getElementById("rotasiY");
const rotasiZ = document.getElementById("rotasiZ");
const translasiX = document.getElementById("translasiX");
const translasiY = document.getElementById("translasiY");
const translasiZ = document.getElementById("translasiZ");
const scaleX = document.getElementById("scaleX");
const scaleY = document.getElementById("scaleY");
const scaleZ = document.getElementById("scaleZ");
const projection = document.getElementById("projection");
const shading = document.getElementById("shading");
const animation = document.getElementById("animation");
const resetview = document.getElementById("resetview");
const radius = document.getElementById("radius");
const angleX = document.getElementById("angleX");
const angleY = document.getElementById("angleY");
const angleZ = document.getElementById("angleZ");

main();

// Main function
function main() {
    // Get canvas from HTML
    const canvas = document.querySelector("#glcanvas");

    // Initialize GL
    const webgl = new WebGL(canvas);
    initEventHandler(webgl);

    // Initialize object
    setShape(webgl);

    // Draw the scene repeatedly
    let then = 0;

    function render(now) {
        deltaTime = now * 0.001 - then;
        then = now * 0.001;

        webgl.gl.enable(webgl.gl.DEPTH_TEST);
        webgl.gl.depthFunc(webgl.gl.LEQUAL);
        webgl.gl.clear(webgl.gl.COLOR_BUFFER_BIT | webgl.gl.DEPTH_BUFFER_BIT);

        for (let i = 0; i < webgl.parsedObject.positions.length; i++) {
            webgl.drawScene(
                webgl,
                webgl.buffer[i],
                webgl.parsedObject.positions[i].length,
                cubeRotation
            );
        }
        cubeRotation += deltaTime;
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

/**
 * Initialize event handlers
 * @param {WebGL} webgl
 */
function initEventHandler(webgl) {
    shape.addEventListener("change", () => setShape(webgl));
    projection.addEventListener("change", () => setProjectionType(webgl));
    shading.addEventListener("click", () => setShadingMode(webgl));
    animation.addEventListener("click", () => setAnimationMode(webgl));
    load.addEventListener("change", () => loadObject(webgl));
    save.addEventListener("click", () => saveObject(webgl));
    rotasiX.addEventListener("input", () => setRotasiX(webgl));
    rotasiY.addEventListener("input", () => setRotasiY(webgl));
    rotasiZ.addEventListener("input", () => setRotasiZ(webgl));
    translasiX.addEventListener("input", () => setTranslasiX(webgl));
    translasiY.addEventListener("input", () => setTranslasiY(webgl));
    translasiZ.addEventListener("input", () => setTranslasiZ(webgl));
    scaleX.addEventListener("input", setScaleX);
    scaleY.addEventListener("input", setScaleY);
    scaleZ.addEventListener("input", setScaleZ);
    resetview.addEventListener("click", () => resetView(webgl));
    radius.addEventListener("input", () => setRadius(webgl));
    angleX.addEventListener("input", () => setAngleX(webgl));
    angleY.addEventListener("input", () => setAngleY(webgl));
    angleZ.addEventListener("input", () => setAngleZ(webgl));
}
