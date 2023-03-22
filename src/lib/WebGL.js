import { DefaultFragCode, DefaultVertCode } from "./shaders/DefaultShaders.js";
import { initBuffers } from "../lib/Buffers.js";
import { getShadingMode } from "../app/utils.js";
import {
    create,
    perspective,
    translate,
    rotate,
    invert,
    transpose,
} from "./Mat4.js";

export default class WebGL {
    /** @type {WebGLRenderingContext} WebGL */
    #gl;
    /** @type {WebGLProgram} Shader Program */
    #program;
    /** @type {{WebGLProgram, attribLocation: {vertexPosition: number, vertexNormal: number, vertexColor: number}, uniformLocation: {normalMatrix: WebGLUniformLocation | null, modelViewMatrix: WebGLUniformLocation | null, projectionMatrix: WebGLUniformLocation | null, shading: WebGLUniformLocation | null}}} Attribute location of vertex position */
    #programInfo;
    /** @type {{position: WebGLBuffer | null, normal: WebGLBuffer | null, color: WebGLBuffer | null, index: WebGLBuffer | null}} Attribute location of vertex position */
    #buffer;

    /**
     * Creates an instance of Drawer.
     * @param {(String|HTMLCanvasElement)} [canvas=null] Canvas element or its ID
     * @memberof WebGL
     */
    constructor(
        canvas,
        fragCode = DefaultFragCode,
        vertCode = DefaultVertCode
    ) {
        // Initialize GL context
        this.#gl = canvas.getContext("webgl");

        // If WebGL not available
        if (!this.#gl) {
            alert("WebGL is not available.");
            return;
        }

        // Clear color to black
        this.#gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);

        // Initialize vertex and fragment shader program
        this.#program = this.createShaderProgram(fragCode, vertCode);

        // Program informations: program, attributes, and uniform locations
        this.#programInfo = {
            program: this.#program,
            attribLocation: {
                vertexPosition: this.#gl.getAttribLocation(
                    this.#program,
                    "a_VertexPosition"
                ),
                vertexNormal: this.#gl.getAttribLocation(
                    this.#program,
                    "a_VertexNormal"
                ),
                vertexColor: this.#gl.getAttribLocation(
                    this.#program,
                    "a_VertexColor"
                ),
            },
            uniformLocation: {
                normalMatrix: this.#gl.getUniformLocation(
                    this.#program,
                    "u_NormalMatrix"
                ),
                modelViewMatrix: this.#gl.getUniformLocation(
                    this.#program,
                    "u_ModelViewMatrix"
                ),
                projectionMatrix: this.#gl.getUniformLocation(
                    this.#program,
                    "u_ProjectionMatrix"
                ),
                shading: this.#gl.getUniformLocation(
                    this.#program,
                    "u_Shading"
                ),
            },
        };

        // Initialize buffer for object
        this.#buffer = initBuffers(this.#gl, [], []);
    }

    // Getter: gl, program, programInfo, and buffer
    get gl() {
        return this.#gl;
    }
    get program() {
        return this.#program;
    }
    get programInfo() {
        return this.#programInfo;
    }
    get buffer() {
        return this.#buffer;
    }

    /**
     * Initialize a shader program
     * @param {(String|WebGLShader)} fragCode
     * @param {(String|WebGLShader)} vertCode
     */
    createShaderProgram(fragCode, vertCode) {
        // Create shader program
        const shaderProgram = this.#gl.createProgram();

        // Create a fragment shader
        const fragShader = this.#gl.createShader(this.#gl.FRAGMENT_SHADER);
        this.#gl.shaderSource(fragShader, fragCode);
        this.#gl.compileShader(fragShader);

        // If shader compilation failed
        if (!this.#gl.getShaderParameter(fragShader, this.#gl.COMPILE_STATUS)) {
            alert(
                `An error occurred compiling the shaders: ${this.#gl.getShaderInfoLog(
                    fragShader
                )}`
            );
            this.#gl.deleteShader(fragShader);
            return null;
        }

        // Create a vertex shader
        const vertShader = this.#gl.createShader(this.#gl.VERTEX_SHADER);
        this.#gl.shaderSource(vertShader, vertCode);
        this.#gl.compileShader(vertShader);

        // If shader compilation failed
        if (!this.#gl.getShaderParameter(vertShader, this.#gl.COMPILE_STATUS)) {
            alert(
                `An error occurred compiling the shaders: ${this.#gl.getShaderInfoLog(
                    vertShader
                )}`
            );
            this.#gl.deleteShader(vertShader);
            return null;
        }

        this.#gl.attachShader(shaderProgram, vertShader);
        this.#gl.attachShader(shaderProgram, fragShader);
        this.#gl.linkProgram(shaderProgram);

        // If shader program creation failed
        if (
            !this.#gl.getProgramParameter(shaderProgram, this.#gl.LINK_STATUS)
        ) {
            alert(
                `Unable to initialize the shader program: ${this.#gl.getProgramInfoLog(
                    shaderProgram
                )}`
            );
            return null;
        }
        return shaderProgram;
    }

    /**
     * Draw scene
     * @param {WebGL} webgl
     */
    drawScene(webgl, cubeRotation) {
        // Clear canvas
        webgl.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        webgl.gl.clearDepth(1.0);
        webgl.gl.enable(webgl.gl.DEPTH_TEST);
        webgl.gl.depthFunc(webgl.gl.LEQUAL);
        webgl.gl.clear(webgl.gl.COLOR_BUFFER_BIT | webgl.gl.DEPTH_BUFFER_BIT);

        const fieldOfView = (45 * Math.PI) / 180; // in radians
        const aspect =
            webgl.gl.canvas.clientWidth / webgl.gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = create();

        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        const modelViewMatrix = create();

        // Now move the drawing position a bit to where we want to
        // start drawing the square.
        translate(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to translate
            [-0.0, 0.0, -6.0]
        ); // amount to translate

        rotate(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to rotate
            cubeRotation, // amount to rotate in radians
            [0, 0, 1]
        ); // axis to rotate around (Z)
        rotate(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to rotate
            cubeRotation * 0.7, // amount to rotate in radians
            [0, 1, 0]
        ); // axis to rotate around (Y)
        rotate(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to rotate
            cubeRotation * 0.3, // amount to rotate in radians
            [1, 0, 0]
        ); // axis to rotate around (X)

        const normalMatrix = create();
        invert(normalMatrix, modelViewMatrix);
        transpose(normalMatrix, normalMatrix);

        // Set uniform bool u_Shading value for determining shading mode
        const isShading = getShadingMode();

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        this.setPositionAttribute(webgl);

        this.setColorAttribute(webgl);

        // Tell WebGL which indices to use to index the vertices
        webgl.gl.bindBuffer(webgl.gl.ELEMENT_ARRAY_BUFFER, webgl.buffer.index);

        this.setNormalAttribute(webgl);

        // Tell WebGL to use our program when drawing
        webgl.gl.useProgram(webgl.programInfo.program);

        // Set the shader uniforms
        webgl.gl.uniformMatrix4fv(
            webgl.programInfo.uniformLocation.projectionMatrix,
            false,
            projectionMatrix
        );
        webgl.gl.uniformMatrix4fv(
            webgl.programInfo.uniformLocation.modelViewMatrix,
            false,
            modelViewMatrix
        );
        webgl.gl.uniformMatrix4fv(
            webgl.programInfo.uniformLocation.normalMatrix,
            false,
            normalMatrix
        );
        webgl.gl.uniform1i(
            webgl.programInfo.uniformLocation.shading,
            isShading
        );

        {
            const vertexCount = 36;
            const type = webgl.gl.UNSIGNED_SHORT;
            const offset = 0;
            webgl.gl.drawElements(
                webgl.gl.TRIANGLES,
                vertexCount,
                type,
                offset
            );
        }
    }

    /**
     * Set position
     * @param {WebGL} webgl
     */
    setPositionAttribute(webgl) {
        const numComponents = 3;
        const type = webgl.gl.FLOAT; // the data in the buffer is 32bit floats
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set of values to the next
        // 0 = use type and numComponents above
        const offset = 0; // how many bytes inside the buffer to start from
        webgl.gl.bindBuffer(webgl.gl.ARRAY_BUFFER, webgl.buffer.position);
        webgl.gl.vertexAttribPointer(
            webgl.programInfo.attribLocation.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        webgl.gl.enableVertexAttribArray(
            webgl.programInfo.attribLocation.vertexPosition
        );
    }

    /**
     * Set color
     * @param {WebGL} webgl
     */
    setColorAttribute(webgl) {
        const numComponents = 4;
        const type = webgl.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        webgl.gl.bindBuffer(webgl.gl.ARRAY_BUFFER, webgl.buffer.color);
        webgl.gl.vertexAttribPointer(
            webgl.programInfo.attribLocation.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        webgl.gl.enableVertexAttribArray(
            webgl.programInfo.attribLocation.vertexColor
        );
    }

    /**
     * Set normal
     * @param {WebGL} webgl
     */
    setNormalAttribute(webgl) {
        const numComponents = 3;
        const type = webgl.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        webgl.gl.bindBuffer(webgl.gl.ARRAY_BUFFER, webgl.buffer.normal);
        webgl.gl.vertexAttribPointer(
            webgl.programInfo.attribLocation.vertexNormal,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        webgl.gl.enableVertexAttribArray(
            webgl.programInfo.attribLocation.vertexNormal
        );
    }
}
