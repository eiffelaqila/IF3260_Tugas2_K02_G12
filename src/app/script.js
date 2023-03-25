// Import toolbar and property items
import { toolbar } from "./toolbar.js";
import { properties } from "./properties.js";
import {
    resetView,
    setShape,
    saveObject,
    loadObject,
    setObjRotationX,
    setObjRotationY,
    setObjRotationZ,
    setObjTranslationX,
    setObjTranslationY,
    setObjTranslationZ,
    setObjScaleX,
    setObjScaleY,
    setObjScaleZ,
    setProjectionType,
    setShadingMode,
    setAnimationMode,
    setCamRadius,
    setCamRotationX,
    setCamRotationY,
    setCamRotationZ,
} from "./utils.js";
import WebGL from "../lib/WebGL.js";

let cubeRotation = 0.0;
let deltaTime = 0;

// Set html elements
const shape = document.getElementById("shape");
const load = document.getElementById("load");
const save = document.getElementById("save");
const help = document.getElementById("help");
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
    rotasiX.addEventListener("input", () => setObjRotationX(webgl));
    rotasiY.addEventListener("input", () => setObjRotationY(webgl));
    rotasiZ.addEventListener("input", () => setObjRotationZ(webgl));
    translasiX.addEventListener("input", () => setObjTranslationX(webgl));
    translasiY.addEventListener("input", () => setObjTranslationY(webgl));
    translasiZ.addEventListener("input", () => setObjTranslationZ(webgl));
    scaleX.addEventListener("input", () => setObjScaleX(webgl));
    scaleY.addEventListener("input", () => setObjScaleY(webgl));
    scaleZ.addEventListener("input", () => setObjScaleZ(webgl));
    resetview.addEventListener("click", () => resetView(webgl));
    radius.addEventListener("input", () => setCamRadius(webgl));
    angleX.addEventListener("input", () => setCamRotationX(webgl));
    angleY.addEventListener("input", () => setCamRotationY(webgl));
    angleZ.addEventListener("input", () => setCamRotationZ(webgl));
    help.addEventListener(
        "click",
        () => (window.location.href = "./help.html")
    );
}
