import WebGL from "../lib/WebGL.js";
import {
    hollowCube,
    basicCube,
    kursiSekolah,
    shoeTowelRack,
    stool,
} from "../lib/sample-objects/SampleObjects.js";

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
    if (name == "kursi-sekolah") {
        gl.drawModel(kursiSekolah);
    } else if (name == "shoe-towel-rack") {
        gl.drawModel(shoeTowelRack);
    } else if (name == "stool") {
        gl.drawModel(stool);
    } else if (name == "hollow-cube") {
        gl.drawModel(hollowCube);
    } else {
        gl.drawModel(basicCube);
    }
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
