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
    setEyeX,
    setEyeY,
    setEyeZ,
    setCenterX,
    setCenterY,
    setCenterZ,
    setUpX,
    setUpY,
    setUpZ,
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
const eyeX = document.getElementById("eyeX");
const eyeY = document.getElementById("eyeY");
const eyeZ = document.getElementById("eyeZ");
const centerX = document.getElementById("centerX");
const centerY = document.getElementById("centerY");
const centerZ = document.getElementById("centerZ");
const upX = document.getElementById("upX");
const upY = document.getElementById("upY");
const upZ = document.getElementById("upZ");

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
    shape.addEventListener("change", () => {
        setShape(webgl);
    });
    projection.addEventListener("change", () => {
        setProjectionType(webgl);
    });
    shading.addEventListener("click", () => {
        setShadingMode(webgl);
    });
    animation.addEventListener("click", () => {
        setAnimationMode(webgl);
    });
    load.addEventListener("change", () => {
        loadObject(webgl);
    });
    save.addEventListener("click", () => {
        saveObject(webgl);
    });
    rotasiX.addEventListener("input", setRotasiX);
    rotasiY.addEventListener("input", setRotasiY);
    rotasiZ.addEventListener("input", setRotasiZ);
    translasiX.addEventListener("input", setTranslasiX);
    translasiY.addEventListener("input", setTranslasiY);
    translasiZ.addEventListener("input", setTranslasiZ);
    scaleX.addEventListener("input", setScaleX);
    scaleY.addEventListener("input", setScaleY);
    scaleZ.addEventListener("input", setScaleZ);
    resetview.addEventListener("click", resetView);
    eyeX.addEventListener("input", setEyeX);
    eyeY.addEventListener("input", setEyeY);
    eyeZ.addEventListener("input", setEyeZ);
    centerX.addEventListener("input", setCenterX);
    centerY.addEventListener("input", setCenterY);
    centerZ.addEventListener("input", setCenterZ);
    upX.addEventListener("input", setUpX);
    upY.addEventListener("input", setUpY);
    upZ.addEventListener("input", setUpZ);
}
