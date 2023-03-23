import WebGL from "../lib/WebGL.js";

const loadItem = document.getElementById("load-item");
const loadInfo = document.getElementById("load-info");

const rotasiXOutput = document.getElementById("rotasiX-output");
const rotasiYOutput = document.getElementById("rotasiY-output");
const rotasiZOutput = document.getElementById("rotasiZ-output");
const translasiXOutput = document.getElementById("translasiX-output");
const translasiYOutput = document.getElementById("translasiY-output");
const translasiZOutput = document.getElementById("translasiZ-output");
const scaleXOutput = document.getElementById("scaleX-output");
const scaleYOutput = document.getElementById("scaleY-output");
const scaleZOutput = document.getElementById("scaleZ-output");

const eyeXOutput = document.getElementById("eyeX-output");
const eyeYOutput = document.getElementById("eyeY-output");
const eyeZOutput = document.getElementById("eyeZ-output");
const centerXOutput = document.getElementById("centerX-output");
const centerYOutput = document.getElementById("centerY-output");
const centerZOutput = document.getElementById("centerZ-output");
const upXOutput = document.getElementById("upX-output");
const upYOutput = document.getElementById("upY-output");
const upZOutput = document.getElementById("upZ-output");

const SHADING_ON_TEXT = "Shading (ON)";
const SHADING_ON_TEXT_COLOR = "rgb(0, 0, 0)";
const SHADING_ON_BG_COLOR = "rgb(0, 255, 0)";
const SHADING_OFF_TEXT = "Shading (OFF)";
const SHADING_OFF_TEXT_COLOR = "rgb(255, 255, 255)";
const SHADING_OFF_BG_COLOR = "rgb(255, 0, 0)";

// Sample shape
const sampleShape = {
    nodes: [
        [-1, -1, 1],
        [1, -1, 1],
        [1, 1, 1],
        [-1, 1, 1],
        [-1, -1, -1],
        [-1, 1, -1],
        [1, 1, -1],
        [1, -1, -1],
    ],
    vertices: [
        {
            faces: [
                // Front face
                [0, 1, 2, 3],
                // Back
                [4, 5, 6, 7],
                // Top
                [5, 3, 2, 6],
                // Bottom
                [4, 7, 1, 0],
                // Right
                [7, 6, 2, 1],
                // Left
                [4, 0, 3, 5],
            ],
            colorType: "variant",
            colors: [
                [1.0, 1.0, 1.0, 1.0], // Front face: white
                [1.0, 0.0, 0.0, 1.0], // Back face: red
                [0.0, 1.0, 0.0, 1.0], // Top face: green
                [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
                [1.0, 1.0, 0.0, 1.0], // Right face: yellow
                [1.0, 0.0, 1.0, 1.0], // Left face: purple
            ],
        },
    ],
};

// Shape selection
/**
 * Select shape
 * @param {WebGL} gl
 */
function setShape(gl) {
    if (shape.value != "file") {
        loadItem.style.display = "none";
        loadInfo.style.display = "block";

        setDefaultShape(gl, shape.value);
        return;
    }

    loadInfo.style.display = "none";
    loadItem.style.display = "flex";
}

/**
 * Set shape from default shapes
 * @param {WebGL} gl
 * @param {string} name
 */
function setDefaultShape(gl, name) {
    gl.drawModel(sampleShape);
}

/**
 * Set shape from JSON file
 * @param {WebGL} gl
 * @param {File} file
 */
function setShapeFromFile(gl, file) {
    if (file.type && file.type.indexOf("json") === -1) {
        console.log("File is not an JSON.", file.type, file);
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        let data = JSON.parse(reader.result);
        gl.drawModel(data);
    };
    reader.readAsText(file);
}

/**
 * Load JSON object
 * @param {WebGL} gl
 */
function loadObject(gl) {
    setShapeFromFile(gl, load.files[0]);
}

/**
 * Save object as JSON
 * @param {WebGL} gl
 */
function saveObject(gl) {
    console.log("Save object");
}

// Projection selection
function setProjection() {
    console.log("Set projection");
}

// Load and save
function loadObject() {
    console.log("Load object");
}
function saveObject() {
    console.log("Save object");
}

// Shading
function changeShadingMode() {
    const shadingBtnText = shading.innerText;
    if (shadingBtnText === SHADING_ON_TEXT) {
        shading.innerText = SHADING_OFF_TEXT;
        shading.style.backgroundColor = SHADING_OFF_BG_COLOR;
        shading.style.color = SHADING_OFF_TEXT_COLOR;
    } else {
        shading.innerText = SHADING_ON_TEXT;
        shading.style.backgroundColor = SHADING_ON_BG_COLOR;
        shading.style.color = SHADING_ON_TEXT_COLOR;
    }
}
function isShadingMode() {
    const shadingBtnText = shading.innerText;
    return shadingBtnText === SHADING_ON_TEXT;
}
// Reset View
function resetView() {
    console.log("Reset view");
}

// Object Transformations
function setRotasiX() {
    let prevValue = rotasiXOutput.value;
    let currValue = rotasiX.value;

    rotasiXOutput.value = rotasiX.value;

    console.log("Rotasi X:", currValue);
    console.log("Value change difference:", currValue - prevValue);
}
function setRotasiY() {
    let prevValue = rotasiYOutput.value;
    let currValue = rotasiY.value;

    rotasiYOutput.value = rotasiY.value;

    console.log("Rotasi Y:", currValue);
    console.log("Value change difference:", currValue - prevValue);
}
function setRotasiZ() {
    let prevValue = rotasiZOutput.value;
    let currValue = rotasiZ.value;

    rotasiZOutput.value = rotasiZ.value;

    console.log("Rotasi Z:", currValue);
    console.log("Value change difference:", currValue - prevValue);
}

function setTranslasiX() {
    let prevValue = translasiXOutput.value;
    let currValue = translasiX.value;

    translasiXOutput.value = translasiX.value;

    console.log("Translasi X:", currValue);
    console.log("Value change difference:", currValue - prevValue);
}
function setTranslasiY() {
    let prevValue = translasiYOutput.value;
    let currValue = translasiY.value;

    translasiYOutput.value = translasiY.value;

    console.log("Translasi Y:", currValue);
    console.log("Value change difference:", currValue - prevValue);
}
function setTranslasiZ() {
    let prevValue = translasiZOutput.value;
    let currValue = translasiZ.value;

    translasiZOutput.value = translasiZ.value;

    console.log("Translasi Z:", currValue);
    console.log("Value change difference:", currValue - prevValue);
}

function setScaleX() {
    let prevValue = scaleXOutput.value;
    let currValue = scaleX.value;

    scaleXOutput.value = scaleX.value;

    console.log("Scale X:", currValue);
    console.log("Value change difference:", currValue - prevValue);
}
function setScaleY() {
    let prevValue = scaleYOutput.value;
    let currValue = scaleY.value;

    scaleYOutput.value = scaleY.value;

    console.log("Scale Y:", currValue);
    console.log("Value change difference:", currValue - prevValue);
}
function setScaleZ() {
    let prevValue = scaleZOutput.value;
    let currValue = scaleZ.value;

    scaleZOutput.value = scaleZ.value;

    console.log("Scale Z:", currValue);
    console.log("Value change difference:", currValue - prevValue);
}

// Camera Configurations
function setEyeX() {
    let prevValue = eyeXOutput.value;
    let currValue = eyeX.value;

    eyeXOutput.value = eyeX.value;

    console.log("Eye X:", currValue);
    console.log("Value change difference:", currValue - prevValue);
}
function setEyeY() {
    let prevValue = eyeYOutput.value;
    let currValue = eyeY.value;

    eyeYOutput.value = eyeY.value;

    console.log("Eye Y:", currValue);
    console.log("Value change difference:", currValue - prevValue);
}
function setEyeZ() {
    let prevValue = eyeZOutput.value;
    let currValue = eyeZ.value;

    eyeZOutput.value = eyeZ.value;

    console.log("Eye Z:", currValue);
    console.log("Value change difference:", currValue - prevValue);
}
function setCenterX() {
    let prevValue = centerXOutput.value;
    let currValue = centerX.value;

    centerXOutput.value = centerX.value;

    console.log("Center X:", currValue);
    console.log("Value change difference:", currValue - prevValue);
}
function setCenterY() {
    let prevValue = centerYOutput.value;
    let currValue = centerY.value;

    centerYOutput.value = centerY.value;

    console.log("Center Y:", currValue);
    console.log("Value change difference:", currValue - prevValue);
}
function setCenterZ() {
    let prevValue = centerZOutput.value;
    let currValue = centerZ.value;

    centerZOutput.value = centerZ.value;

    console.log("Center Z:", currValue);
    console.log("Value change difference:", currValue - prevValue);
}
function setUpX() {
    let prevValue = upXOutput.value;
    let currValue = upX.value;

    upXOutput.value = upX.value;

    console.log("Up X:", currValue);
    console.log("Value change difference:", currValue - prevValue);
}
function setUpY() {
    let prevValue = upYOutput.value;
    let currValue = upY.value;

    upYOutput.value = upY.value;

    console.log("Up Y:", currValue);
    console.log("Value change difference:", currValue - prevValue);
}
function setUpZ() {
    let prevValue = upZOutput.value;
    let currValue = upZ.value;

    upZOutput.value = upZ.value;

    console.log("Up Z:", currValue);
    console.log("Value change difference:", currValue - prevValue);
}

export {
    sampleShape,
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
    setProjection,
    changeShadingMode,
    isShadingMode,
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
};
