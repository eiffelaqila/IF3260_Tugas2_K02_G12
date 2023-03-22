/**
 * Verify the JSON object that is valid for a hollow object (defined in sample.json).
 * @param {Object} obj 
 */
function verifyHollowObject(obj) {
    // Check if the object has nodes and vertices
    if (!obj.hasOwnProperty('nodes')) return false;
    if (!obj.hasOwnProperty('vertices')) return false;
    // Check if nodes and vertices is an array
    const nodes = obj.nodes;
    const vertices = obj.vertices;
    if (!Array.isArray(nodes)) return false;
    if (!Array.isArray(vertices)) return false;
    // Check if each element of nodes is an array
    if (nodes.some(node => !Array.isArray(node) || node.length != 3 || node.some(el => typeof(el) != 'number'))) return false;
    // Check if each element of vertices consists faces, color-type, and color
    if (vertices.some(vertex => !vertex.hasOwnProperty('faces') || !vertex.hasOwnProperty('colors') || !vertex.hasOwnProperty('colorType'))) return false;
    // Check every vertex in vertices is valid
    for (const vertex of vertices) {
        const faces = vertex.faces;
        const colorType = vertex.colorType;
        const colors = vertex.colors;
        if (faces.some(face => !Array.isArray(face) || face.length <= 3 || face.some(el => typeof(el) != 'number'))) return false;
        if (typeof(colorType) != 'string') return false;
        if (colors.some(color => !Array.isArray(color) || color.length != 4 || color.some(el => typeof(el) != 'number'))) return false;
    }
    // If the object passed verification above, then return true
    return true;
}

export { verifyHollowObject };