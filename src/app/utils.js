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

const projection = document.getElementById("projection");
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
const SHADING_OFF_TEXT_COLOR = "rgb(0, 0, 0)";
const SHADING_OFF_BG_COLOR = "rgb(211, 211, 211)";

// Sample shape
const sampleShape = {
    nodes: [
        [-1.0, -1.0, 2.0],
        [-2.0, -2.0, 2.0],
        [2.0, -2.0, 2.0],
        [1.0, -1.0, 2.0],
        [-2.0, -2.0, 1.0],
        [-1.0, -1.0, 1.0],
        [1.0, -1.0, 1.0],
        [2.0, -2.0, 1.0],
        [-1.0, 1.0, 2.0],
        [-2.0, 2.0, 2.0],
        [-2.0, 2.0, 1.0],
        [-1.0, 1.0, 1.0],
        [2.0, 2.0, 2.0],
        [1.0, 1.0, 2.0],
        [1.0, 1.0, 1.0],
        [2.0, 2.0, 1.0],
        [-1.0, -1.0, -1.0],
        [-2.0, -2.0, -1.0],
        [2.0, -2.0, -1.0],
        [1.0, -1.0, -1.0],
        [-2.0, -2.0, -2.0],
        [-1.0, -1.0, -2.0],
        [1.0, -1.0, -2.0],
        [2.0, -2.0, -2.0],
        [-1.0, 1.0, -1.0],
        [-2.0, 2.0, -1.0],
        [-2.0, 2.0, -2.0],
        [-1.0, 1.0, -2.0],
        [2.0, 2.0, -1.0],
        [1.0, 1.0, -1.0],
        [1.0, 1.0, -2.0],
        [2.0, 2.0, -2.0],
        [-2.0, -1, 2.0],
        [-2.0, -1.0, -2.0],
        [-1.0, -2.0, 2.0],
        [-1, -2.0, -2.0],
        [-2.0, 1.0, 2.0],
        [-2.0, 1, -2.0],
        [-1.0, 2.0, 2.0],
        [-1.0, 2.0, -2.0],
        [1.0, -2.0, 2.0],
        [1.0, -2.0, -2.0],
        [2.0, -1.0, 2.0],
        [2.0, -1.0, -2.0],
        [1.0, 2.0, 2.0],
        [1.0, 2.0, -2.0],
        [2.0, 1.0, 2.0],
        [2.0, 1.0, -2.0],
    ],
    vertices: [
        {
            faces: [
                [0, 1, 2, 3],
                [4, 5, 6, 7],
                [5, 0, 3, 6],
                [1, 4, 7, 2],
                [1, 0, 5, 4],
                [3, 2, 7, 6],
            ],
            colorType: "variant",
            colors: [
                [0.1, 0.1, 0.1, 1],
                [0.1, 0.1, 0.1, 1],
                [0.1, 0.1, 0.1, 1],
                [0.1, 0.1, 0.1, 1],
                [0.1, 0.1, 0.1, 1],
                [0.1, 0.1, 0.1, 1],
            ],
        },
        {
            faces: [
                [1, 0, 8, 9],
                [5, 4, 10, 11],
                [4, 1, 9, 10],
                [0, 5, 11, 8],
                [9, 8, 11, 10],
                [0, 1, 4, 5],
            ],
            colorType: "variant",
            colors: [
                [0.2, 0.2, 0.2, 1],
                [0.2, 0.2, 0.2, 1],
                [0.2, 0.2, 0.2, 1],
                [0.2, 0.2, 0.2, 1],
                [0.2, 0.2, 0.2, 1],
                [0.2, 0.2, 0.2, 1],
            ],
        },
        {
            faces: [
                [3, 2, 12, 13],
                [7, 6, 14, 15],
                [6, 3, 13, 14],
                [2, 7, 15, 12],
                [13, 12, 15, 14],
                [2, 3, 6, 7],
            ],
            colorType: "variant",
            colors: [
                [0.3, 0.3, 0.3, 1],
                [0.3, 0.3, 0.3, 1],
                [0.3, 0.3, 0.3, 1],
                [0.3, 0.3, 0.3, 1],
                [0.3, 0.3, 0.3, 1],
                [0.3, 0.3, 0.3, 1],
            ],
        },
        {
            faces: [
                [9, 8, 13, 12],
                [11, 10, 15, 14],
                [10, 9, 12, 15],
                [8, 11, 14, 13],
                [8, 9, 10, 11],
                [12, 13, 14, 15],
            ],
            colorType: "variant",
            colors: [
                [0.4, 0.4, 0.4, 1],
                [0.4, 0.4, 0.4, 1],
                [0.4, 0.4, 0.4, 1],
                [0.4, 0.4, 0.4, 1],
                [0.4, 0.4, 0.4, 1],
                [0.4, 0.4, 0.4, 1],
            ],
        },
        {
            faces: [
                [16, 17, 18, 19],
                [20, 21, 22, 23],
                [21, 16, 19, 22],
                [17, 20, 23, 18],
                [17, 16, 21, 20],
                [19, 18, 23, 22],
            ],
            colorType: "variant",
            colors: [
                [0.5, 0.5, 0.5, 1],
                [0.5, 0.5, 0.5, 1],
                [0.5, 0.5, 0.5, 1],
                [0.5, 0.5, 0.5, 1],
                [0.5, 0.5, 0.5, 1],
                [0.5, 0.5, 0.5, 1],
            ],
        },
        {
            faces: [
                [17, 16, 24, 25],
                [21, 20, 26, 27],
                [20, 17, 25, 26],
                [16, 21, 27, 24],
                [25, 24, 27, 26],
                [16, 17, 20, 21],
            ],
            colorType: "variant",
            colors: [
                [0.6, 0.6, 0.6, 1],
                [0.6, 0.6, 0.6, 1],
                [0.6, 0.6, 0.6, 1],
                [0.6, 0.6, 0.6, 1],
                [0.6, 0.6, 0.6, 1],
                [0.6, 0.6, 0.6, 1],
            ],
        },
        {
            faces: [
                [19, 18, 28, 29],
                [23, 22, 30, 31],
                [22, 19, 29, 30],
                [18, 23, 31, 28],
                [29, 28, 31, 30],
                [18, 19, 22, 23],
            ],
            colorType: "variant",
            colors: [
                [0.7, 0.7, 0.7, 1],
                [0.7, 0.7, 0.7, 1],
                [0.7, 0.7, 0.7, 1],
                [0.7, 0.7, 0.7, 1],
                [0.7, 0.7, 0.7, 1],
                [0.7, 0.7, 0.7, 1],
            ],
        },
        {
            faces: [
                [25, 24, 29, 28],
                [27, 26, 31, 30],
                [26, 25, 28, 31],
                [24, 27, 30, 29],
                [24, 25, 26, 27],
                [28, 29, 30, 31],
            ],
            colorType: "variant",
            colors: [
                [0.8, 0.8, 0.8, 1],
                [0.8, 0.8, 0.8, 1],
                [0.8, 0.8, 0.8, 1],
                [0.8, 0.8, 0.8, 1],
                [0.8, 0.8, 0.8, 1],
                [0.8, 0.8, 0.8, 1],
            ],
        },
        {
            faces: [
                [1, 32, 33, 20],
                [0, 34, 35, 21],
                [32, 0, 21, 33],
                [34, 1, 20, 35],
                [1, 34, 0, 32],
                [35, 20, 33, 21],
            ],
            colorType: "variant",
            colors: [
                [0.9, 0.9, 0.9, 1],
                [0.9, 0.9, 0.9, 1],
                [0.9, 0.9, 0.9, 1],
                [0.9, 0.9, 0.9, 1],
                [0.9, 0.9, 0.9, 1],
                [0.9, 0.9, 0.9, 1],
            ],
        },
        {
            faces: [
                [36, 9, 26, 37],
                [38, 8, 27, 39],
                [9, 38, 39, 26],
                [8, 36, 37, 27],
                [36, 8, 38, 9],
                [27, 37, 26, 39],
            ],
            colorType: "variant",
            colors: [
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
            ],
        },
        {
            faces: [
                [40, 3, 22, 41],
                [42, 2, 23, 43],
                [3, 42, 43, 22],
                [2, 40, 41, 23],
                [40, 2, 42, 3],
                [23, 41, 22, 43],
            ],
            colorType: "variant",
            colors: [
                [1.0, 0.0, 0.0, 1],
                [1.0, 0.0, 0.0, 1],
                [1.0, 0.0, 0.0, 1],
                [1.0, 0.0, 0.0, 1],
                [1.0, 0.0, 0.0, 1],
                [1.0, 0.0, 0.0, 1],
            ],
        },
        {
            faces: [
                [13, 44, 45, 30],
                [12, 46, 47, 31],
                [44, 12, 31, 45],
                [46, 13, 30, 47],
                [13, 46, 12, 44],
                [47, 30, 45, 31],
            ],
            colorType: "variant",
            colors: [
                [1.0, 1.0, 0.0, 1],
                [1.0, 1.0, 0.0, 1],
                [1.0, 1.0, 0.0, 1],
                [1.0, 1.0, 0.0, 1],
                [1.0, 1.0, 0.0, 1],
                [1.0, 1.0, 0.0, 1],
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

/**
 * Get projection type selected by user
 */
function getProjectionType() {
    return projection.value;
}

// Shading
/**
 * Listener callback for setting shading mode
 * @param {HTMLElement} shading
 */
function setShadingMode(shading) {
    const shadingBtnText = shading.innerText;
    if (shadingBtnText === SHADING_ON_TEXT) {
        shading.innerText = SHADING_OFF_TEXT;
        shading.style.color = SHADING_OFF_TEXT_COLOR;
        shading.style.backgroundColor = SHADING_OFF_BG_COLOR;
    } else {
        shading.innerText = SHADING_ON_TEXT;
        shading.style.color = SHADING_ON_TEXT_COLOR;
        shading.style.backgroundColor = SHADING_ON_BG_COLOR;
    }
}
/**
 * Get shading mode selected by user
 */
function getShadingMode() {
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
    getProjectionType,
    setShadingMode,
    getShadingMode,
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
