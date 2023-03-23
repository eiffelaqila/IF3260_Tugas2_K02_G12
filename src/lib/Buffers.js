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
 * @param {number[]} positions
 */
function initPositionBuffer(gl, positions) {
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    console.log(positions);

    return positionBuffer;
}

/**
 * Creates a buffer for object normal
 * @param {WebGLRenderingContext} gl
 * @param {number[]} positions
 */
function initNormalBuffer(gl, positions) {
    const normalBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    const normals = getNormals(positions);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    return normalBuffer;
}

/**
 * Creates a buffer for object color
 * @param {WebGLRenderingContext} gl
 * @param {number[][]} faceColors
 */
function initColorBuffer(gl, faceColors) {
    const colorBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

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

/**
 * Calculate vertex normal
 * @param {number[]} positions
 * @returns {number[]}
 */
function getNormals(positions) {
    let normals = [];

    // For each faces, calculate normal
    for (let i = 0; i < positions.length; i += 12) {
        const vec21 = [
            positions[i + 3] - positions[i],
            positions[i + 4] - positions[i + 1],
            positions[i + 5] - positions[i + 2],
        ];
        const vec31 = [
            positions[i + 6] - positions[i],
            positions[i + 7] - positions[i + 1],
            positions[i + 8] - positions[i + 2],
        ];

        // vec21 x vec31
        const normal = [
            vec21[1] * vec31[2] - vec21[2] * vec31[1],
            vec21[2] * vec31[0] - vec21[0] * vec31[2],
            vec21[0] * vec31[1] - vec21[1] * vec31[0],
        ];

        // Normalized normal
        const normalizedNormal = normalize(normal);
        for (let j = 0; j < 4; j++) {
            normals = normals.concat(normalizedNormal);
        }
    }

    return normals;
}

/**
 * Normalize vector
 * @param {number[]} u
 * @returns {number[]}
 */
function normalize(u) {
    var normalizedU = [0, 0, 0];

    // Calculate |u|
    const sum = u[0] * u[0] + u[1] * u[1] + u[2] * u[2];
    const sqrtSum = Math.sqrt(sum);

    if (sqrtSum != 0) {
        normalizedU = [u[0] / sqrtSum, u[1] / sqrtSum, u[2] / sqrtSum];
    }

    return normalizedU;
}
