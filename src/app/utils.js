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

const radiusOutput = document.getElementById("radius-output");
const angleXOutput = document.getElementById("angleX-output");
const angleYOutput = document.getElementById("angleY-output");
const angleZOutput = document.getElementById("angleZ-output");

const SHADING_ON_TEXT = "Shading (ON)";
const SHADING_ON_BG_COLOR = "rgb(0, 255, 0)";
const SHADING_OFF_TEXT = "Shading (OFF)";
const SHADING_OFF_BG_COLOR = "rgb(211, 211, 211)";

const ANIMATION_ON_TEXT = "Animation (ON)";
const ANIMATION_ON_BG_COLOR = "rgb(0, 255, 0)";
const ANIMATION_OFF_TEXT = "Animation (OFF)";
const ANIMATION_OFF_BG_COLOR = "rgb(211, 211, 211)";

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
    // Create new nodes after the transformations
    let mv = gl.modelViewMatrix;
    let newNodes = [];

    gl.object.nodes.forEach((node) => {
        let x = node[0];
        let y = node[1];
        let z = node[2];
        let w = 1.0;

        var newNode = [0, 0, 0, 0];
        newNode[0] = mv[0] * x + mv[4] * y + mv[8] * z + mv[12] * w;
        newNode[1] = mv[1] * x + mv[5] * y + mv[9] * z + mv[13] * w;
        newNode[2] = mv[2] * x + mv[6] * y + mv[10] * z + mv[14] * w;
        newNode[3] = mv[3] * x + mv[7] * y + mv[11] * z + mv[15] * w;

        // add 6 to z components because of translation
        newNodes.push([newNode[0], newNode[1], newNode[2] + 6]);
    });

    const newObject = {
        nodes: newNodes,
        vertices: gl.object.vertices,
    };

    // Save to local files
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(newObject)], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = "model.json";
    a.click();
}

/**
 * Set projection type
 * @param {WebGL} gl
 */
function setProjectionType(gl) {
    gl.setProjectionType(window.projection.value);
}

// Shading
/**
 * Listener callback for setting shading mode
 * @param {WebGL} gl
 */
function setShadingMode(gl) {
    if (window.shading.innerText === SHADING_ON_TEXT) {
        window.shading.innerText = SHADING_OFF_TEXT;
        window.shading.style.backgroundColor = SHADING_OFF_BG_COLOR;
    } else if (window.shading.innerText === SHADING_OFF_TEXT) {
        window.shading.innerText = SHADING_ON_TEXT;
        window.shading.style.backgroundColor = SHADING_ON_BG_COLOR;
    }

    gl.setShadingMode(window.shading.innerText === SHADING_ON_TEXT);
}

// Reset View
function resetView(gl) {
    // Reset all rotation to 0
    rotasiX.value = 0;
    setRotasiX(gl);
    rotasiY.value = 0;
    setRotasiY(gl);
    rotasiZ.value = 0;
    setRotasiZ(gl);

    // Reset all translation to 0
    translasiX.value = 0;
    setTranslasiX(gl);
    translasiY.value = 0;
    setTranslasiY(gl);
    translasiZ.value = 0;
    setTranslasiZ(gl);
    
    // Reset all scale to 1
    scaleX.value = 1;
    setScaleX(gl);
    scaleY.value = 1;
    setScaleY(gl);
    scaleZ.value = 1;
    setScaleZ(gl);
    
    // Reset radius to 200
    radius.value = 200;
    setRadius(gl);
    
    // Reset all camera angle to 0
    angleX.value = 0;
    setAngleX(gl);
    angleY.value = 0;
    setAngleY(gl);
    angleZ.value = 0;
    setAngleZ(gl);

    // Toggle on shading and animation
    shading.innerText = SHADING_OFF_TEXT;
    setShadingMode(gl);
    animation.innerText = ANIMATION_ON_TEXT;
    setAnimationMode(gl);

    // Change projjection to orthographic
    projection.value = "orth";
    setProjectionType(gl);
}

// Animation
/**
 * Listener callback for setting animation mode
 * @param {WebGL} gl
 */
function setAnimationMode(gl) {
    if (window.animation.innerText === ANIMATION_ON_TEXT) {
        window.animation.innerText = ANIMATION_OFF_TEXT;
        window.animation.style.backgroundColor = ANIMATION_OFF_BG_COLOR;
    } else if (window.animation.innerText === ANIMATION_OFF_TEXT) {
        window.animation.innerText = ANIMATION_ON_TEXT;
        window.animation.style.backgroundColor = ANIMATION_ON_BG_COLOR;
    }

    gl.setAnimationMode(window.animation.innerText === ANIMATION_ON_TEXT);
}

// Object Transformations
function setObjRotationX(gl) {
    let prevValue = rotasiXOutput.value;
    let currValue = rotasiX.value;

    rotasiXOutput.value = rotasiX.value;

    console.log("Rotasi X:", currValue);
    console.log("Value change difference:", currValue - prevValue);

    gl.setObjRotationX(currValue);
}
function setObjRotationY(gl) {
    let prevValue = rotasiYOutput.value;
    let currValue = rotasiY.value;

    rotasiYOutput.value = rotasiY.value;

    console.log("Rotasi Y:", currValue);
    console.log("Value change difference:", currValue - prevValue);

    gl.setObjRotationY(currValue);
}
function setObjRotationZ(gl) {
    let prevValue = rotasiZOutput.value;
    let currValue = rotasiZ.value;

    rotasiZOutput.value = rotasiZ.value;

    console.log("Rotasi Z:", currValue);
    console.log("Value change difference:", currValue - prevValue);

    gl.setObjRotationZ(currValue);
}

function setObjTranslationX(gl) {
    let prevValue = translasiXOutput.value;
    let currValue = translasiX.value;

    translasiXOutput.value = translasiX.value;

    console.log("Translasi X:", currValue);
    console.log("Value change difference:", currValue - prevValue);

    gl.setObjTranslationX(currValue);
}
function setObjTranslationY(gl) {
    let prevValue = translasiYOutput.value;
    let currValue = translasiY.value;

    translasiYOutput.value = translasiY.value;

    console.log("Translasi Y:", currValue);
    console.log("Value change difference:", currValue - prevValue);

    gl.setObjTranslationY(currValue);
}
function setObjTranslationZ(gl) {
    let prevValue = translasiZOutput.value;
    let currValue = translasiZ.value;

    translasiZOutput.value = translasiZ.value;

    console.log("Translasi Z:", currValue);
    console.log("Value change difference:", currValue - prevValue);

    gl.setObjTranslationZ(currValue);
}

function setObjScaleX(gl) {
    let prevValue = scaleXOutput.value;
    let currValue = scaleX.value;

    scaleXOutput.value = scaleX.value;

    console.log("Scale X:", currValue);
    console.log("Value change difference:", currValue - prevValue);
    
    gl.setObjScaleX(currValue);
}
function setObjScaleY(gl) {
    let prevValue = scaleYOutput.value;
    let currValue = scaleY.value;

    scaleYOutput.value = scaleY.value;

    console.log("Scale Y:", currValue);
    console.log("Value change difference:", currValue - prevValue);

    gl.setObjScaleY(currValue);
}
function setObjScaleZ(gl) {
    let prevValue = scaleZOutput.value;
    let currValue = scaleZ.value;

    scaleZOutput.value = scaleZ.value;

    console.log("Scale Z:", currValue);
    console.log("Value change difference:", currValue - prevValue);

    gl.setObjScaleZ(currValue);
}

// Camera Configurations
function setCamRadius(gl) {
    let prevValue = radiusOutput.value;
    let currValue = radius.value;

    radiusOutput.value = radius.value;

    console.log("Radius:", currValue);
    console.log("Value change difference:", currValue - prevValue);

    gl.setCamRadius(currValue);
}
function setCamRotationX(gl) {
    let prevValue = angleXOutput.value;
    let currValue = angleX.value;

    angleXOutput.value = angleX.value;

    console.log("AngleX:", currValue);
    console.log("Value change difference:", currValue - prevValue);

    gl.setCamRotationX(currValue);
}
function setCamRotationY(gl) {
    let prevValue = angleYOutput.value;
    let currValue = angleY.value;

    angleYOutput.value = angleY.value;

    console.log("AngleY:", currValue);
    console.log("Value change difference:", currValue - prevValue);

    gl.setCamRotationY(currValue);
}
function setCamRotationZ(gl) {
    let prevValue = angleZOutput.value;
    let currValue = angleZ.value;

    angleZOutput.value = angleZ.value;

    console.log("AngleZ:", currValue);
    console.log("Value change difference:", currValue - prevValue);

    gl.setCamRotationZ(currValue);
}

export {
    resetView,
    sampleShape,
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
};
