/**
 * This is a base class for hollow objects used in this repository
 * @property {Object}
 */
class HollowObject {
    // Members of the base class

    /** @type {number} Number of nodes used to draw hollow object */
    #num_nodes;
    /** @type {Array} List of nodes used to draw hollow object */
    #nodes;
    /** @type {number} Number of vertices/blocks used to draw hollow object */
    #num_vertices;
    /** @type {{faces: Array, color-type: String, color: Array}[]} List of vertices/blocks used to draw hollow object */
    #vertices;

    // Methods of the base class

    /**
     * Make a hollow object
     */
    constructor(obj) {
        this.#nodes = obj.nodes ? obj.nodes : [];
        this.#num_nodes = obj.nodes ? obj.nodes.length : 0;
        this.#vertices = obj.vertices ? obj.vertices : [];
        this.#num_vertices = obj.vertices ? obj.vertices.length : 0;
    }
    /** 
     * Get the number of nodes in the object
     * 
     * @return {number} Number of nodes in the object
     */
    get num_nodes() {
        return this.#num_nodes;
    }
    /** 
     * Get the list of nodes in the object
     * 
     * @return {Array} List of nodes in the object
     */
    get nodes() {
        return this.#nodes;
    }
    /** 
     * Get the number of vertices in the object
     * 
     * @return {number} Number of vertices in the object
     */
    get num_vertices() {
        return this.#num_vertices;
    }
    /** 
     * Get the list of vertices in the object
     * 
     * @return {Array} List of vertices in the object
     */
    get vertices() {
        return this.#vertices;
    }
    /**
     * Set the list of nodes in the object
     * 
     * @param {list} nodes List of nodes in the object
     */
    set nodes(nodes) {
        if (Array.isArray(nodes)) {
            this.#nodes = nodes;
            this.#num_nodes = nodes.length;
        }
    }
    /**
     * Set the list of vertices in the object
     * 
     * @param {list} vertices List of vertices in the object
     */
    set vertices(vertices) {
        if (Array.isArray(vertices)) {
            this.#vertices = vertices;
            this.#num_vertices = vertices.length;
        }
    }
}

export default HollowObject;