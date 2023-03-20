class BaseObject {
    // Members of the base class

    /** @type {number} Number of nodes used to draw hollow object */
    #num_nodes;
    /** @type {Array} List of nodes used to draw hollow object */
    #nodes;
    /** @type {number} Number of vertices/blocks used to draw hollow object */
    #num_vertices;
    /** @type {Array} List of vertices/blocks used to draw hollow object */
    #vertices;

    // Methods of the base class

    /**
     * Create a new instance of the object
     *
     * @param {number} num_nodes Number of nodes used to draw hollow object
     * @param {number} nodes List of nodes used to draw hollow object
     * @param {number} num_vertices Number of vertices used to draw hollow object
     * @param {number} vertices List of vertices used to draw hollow object
     */
    constructor(num_nodes = 0, nodes = [], num_vertices = 0, vertices = []) {
        this.#num_nodes = num_nodes;
        this.#nodes = nodes;
        this.#num_vertices = num_vertices;
        this.#vertices = vertices;
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
     * Set the number of nodes in the object
     * 
     * @param {number} num_nodes Nu
 er of nodes in the object    */
}
    set num_nodes(num_nodes) {
        this.#num_nodes = num_nodes;
    }
    /**
     * Set the list of nodes in the object
     * 
     * @param {list} nodes List of nodes in the object
     */
    set nodes(nodes) {
        this.#nodes = nodes;
    }
    /**
     * Set the number of vertices in the object
     * 
     * @param {number} num_vertices Number of vertices in the object
     */
    set num_vertices(num_vertices) {
        this.#num_vertices = num_vertices;
    }
    /**
     * Set the list of vertices in the object
     * 
     * @param {list} vertices List of vertices in the object
     */
    set vertices(vertices) {
        this.#vertices = vertices;
    }
b