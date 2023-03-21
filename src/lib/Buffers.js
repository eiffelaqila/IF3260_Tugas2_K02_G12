/**
 * Creates a buffer for object position
 * @param {WebGLRenderingContext} gl
 * @param {number[]} vertexPosition
 * @param {number[]} vertexColor
 */
export function initBuffers(gl, vertexPosition, vertexColor) {
    const positionBuffer = initPositionBuffer(gl, vertexPosition);
    const normalBuffer = initNormalBuffer(gl, vertexPosition);
    const colorBuffer = initColorBuffer(gl, vertexColor);
    const indexBuffer = initIndexBuffer(gl);

    return {
        position: positionBuffer,
        normal: normalBuffer,
        color: colorBuffer,
        index: indexBuffer,
    };
}

/**
 * Creates a buffer for object position
 * @param {WebGLRenderingContext} gl
 * @param {number[]} vertexPosition
 */
function initPositionBuffer(gl, vertexPosition) {
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        // Front face
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
        // Back face
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
        // Top face
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
        // Bottom face
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        // Right face
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
        // Left face
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}

/**
 * Creates a buffer for object normal
 * @param {WebGLRenderingContext} gl
 * @param {number[]} vertexNormal
 */
function initNormalBuffer(gl, vertexNormal) {
    const normalBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    const vertexNormals = [
        // Front
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

        // Back
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

        // Top
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

        // Bottom
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

        // Right
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

        // Left
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
    ];

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertexNormals),
        gl.STATIC_DRAW
    );

    return normalBuffer;
}

/**
 * Creates a buffer for object color
 * @param {WebGLRenderingContext} gl
 * @param {number[]} vertexColor
 */
function initColorBuffer(gl, vertexColor) {
    const colorBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    const faceColors = [
        [1.0, 1.0, 1.0, 1.0], // Front face: white
        [1.0, 0.0, 0.0, 1.0], // Back face: red
        [0.0, 1.0, 0.0, 1.0], // Top face: green
        [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0], // Right face: yellow
        [1.0, 0.0, 1.0, 1.0], // Left face: purple
    ];

    // Convert the array of colors into a table for all the vertices.

    var colors = [];

    for (var j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];
        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c, c, c);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    return colorBuffer;
}

/**
 * Creates a buffer for object index
 * @param {WebGLRenderingContext} gl
 */
function initIndexBuffer(gl, vertex) {
    const indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    const indices = [
        // Front
        0, 1, 2, 0, 2, 3,
        // Back
        4, 5, 6, 4, 6, 7,
        // Top
        8, 9, 10, 8, 10, 11,
        // Bottom
        12, 13, 14, 12, 14, 15,
        // Right
        16, 17, 18, 16, 18, 19,
        // Left
        20, 21, 22, 20, 22, 23,
    ];
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW
    );

    return indexBuffer;
}

/** TODO
 * Calculate vertex normal
 * @param {number[]} vertexPosition
 */
// function calculateNormal(vertexPosition) {}
