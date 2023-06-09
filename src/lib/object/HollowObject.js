/**
 * Check if a node is valid: every node is an array of numbers with length 3.
 * @param {Object} nodes
 */
function checkNodes(nodes) {
    return nodes.every(
        (node) =>
            Array.isArray(node) &&
            node.length == 3 &&
            node.every((el) => typeof el == "number")
    );
}

/**
 * Check if every vertex has properties: faces, colors, colorType
 * @param {Object} vertices
 */
function checkVerticesProps(vertices) {
    return vertices.every(
        (vertex) =>
            vertex.hasOwnProperty("faces") &&
            vertex.hasOwnProperty("colors") &&
            vertex.hasOwnProperty("colorType")
    );
}

function checkVertices(vertices) {
    for (const vertex of vertices) {
        const faces = vertex.faces;
        const colorType = vertex.colorType;
        const colors = vertex.colors;
        if (
            faces.some(
                (face) =>
                    !Array.isArray(face) ||
                    face.length <= 3 ||
                    face.some((el) => typeof el != "number")
            )
        )
            return false;
        if (typeof colorType != "string") return false;
        if (
            colors.some(
                (color) =>
                    !Array.isArray(color) ||
                    color.length != 4 ||
                    color.some((el) => typeof el != "number")
            )
        )
            return false;
    }
    return true;
}

/**
 * Verify the JSON object that is valid for a hollow object (defined in sample.json).
 * @param {Object} obj
 * @returns {boolean}
 */
function verifyHollowObject(obj) {
    // Check if the object has nodes and vertices
    if (!obj.hasOwnProperty("nodes")) return false;
    if (!obj.hasOwnProperty("vertices")) return false;

    // Check if nodes and vertices is an array
    const nodes = obj.nodes;
    const vertices = obj.vertices;
    if (!Array.isArray(nodes)) return false;
    if (!Array.isArray(vertices)) return false;

    // Check if each element of nodes is an array
    if (!checkNodes(nodes)) return false;

    // Check if each element of vertices consists faces, color-type, and color
    if (!checkVerticesProps(vertices)) return false;

    // Check every vertex in vertices is valid
    if (!checkVertices(vertices)) return false;

    // If the object passed verification above, then return true
    return true;
}

/**
 * Parse the JSON object into object of positions and colors
 * @param {Object} obj json object
 * @return {{positions: number[], colors: number[]} | null} object of positions and colors
 */
function parseHollowObject(obj) {
    // If object not valid, return null
    const isValid = verifyHollowObject(obj);
    if (!isValid) {
        return null;
    }

    // Initialize positions and colors
    let positions = [];
    let colors = [];
    let currPositions = [];
    let currColors = [];

    // For each vertices
    obj.vertices.forEach((vertex) => {
        currPositions = [];
        currColors = [];

        vertex.faces.forEach((face) => {
            face.forEach((node) => {
                currPositions = currPositions.concat(obj.nodes[node]);
            });
        });

        vertex.colors.forEach((color) => {
            currColors.push(color);
        });

        positions.push(currPositions);
        colors.push(currColors);
    });

    return {
        positions: positions,
        colors: colors,
    };
}

export { parseHollowObject };
