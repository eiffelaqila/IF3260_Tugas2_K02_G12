import { DefaultFragCode, DefaultVertCode } from "./shaders/DefaultShaders.js";
import { initBuffers } from "../lib/Buffers.js";
import { getShadingMode, getProjectionType, getAnimationMode } from "../app/utils.js";
import { ortographicProjMat, ortographicProjMat1, ortographicProjMat2 } from "./Mat.js";
import {
    create,
    perspective,
    translate,
    rotate,
    invert,
    transpose,
    ortho,
} from "./Mat4.js";
import { parseHollowObject } from "./object/HollowObject.js";

export default class WebGL {
    /** @type {WebGLRenderingContext} WebGL */
    #gl;
    /** @type {WebGLProgram} Shader Program */
    #program;
    /** @type {{WebGLProgram, attribLocation: {vertexPosition: number, vertexNormal: number, vertexColor: number}, uniformLocation: {normalMatrix: WebGLUniformLocation | null, modelViewMatrix: WebGLUniformLocation | null, projectionMatrix: WebGLUniformLocation | null, shading: WebGLUniformLocation | null}}} Attribute location of vertex position */
    #programInfo;
    /** @type {{position: WebGLBuffer | null, normal: WebGLBuffer | null, color: WebGLBuffer | null, index: WebGLBuffer | null}[]} Attribute location of vertex position */
    #buffer;
    /** @type {{positions: number[], colors: number[]} | null} Attribute location of vertex position */
    #parsedObject;

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
        this.#buffer = [];
        this.#parsedObject = null;

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
    get parsedObject() {
        return this.#parsedObject;
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
     * Draw model and change buffer
     * @param {Object} object
     */
    drawModel(object) {
        let parsedObject = parseHollowObject(object);
        console.log(parsedObject);

        // Reset buffer
        this.#buffer = [];
        this.#parsedObject = parsedObject;

        for (let i = 0; i < parsedObject.positions.length; i++) {
            const buffer = initBuffers(
                this.#gl,
                parsedObject.positions[i],
                parsedObject.colors[i]
            );
            this.#buffer.push(buffer);
        }
    }

    /**
     * Draw scene
     * @param {WebGL} webgl
     */
    drawScene(webgl, buffer, vCount, cubeRotation, enableAnimation=getAnimationMode()) {
        // console.log(webgl.parsedObject.positions);
        // Clear canvas
        // webgl.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // webgl.gl.clearDepth(1.0);

        let projectionMatrix;

        // let projectionMatrix = createProjectionMatrix();
        
        const projectionType = getProjectionType();
        if (projectionType === "orthographic") {
            const left = -1;
            const right = 1;
            const bottom = -1;
            const top = 1;
            const near = 0.1;
            const far = 100.0;
            projectionMatrix = ortographicProjMat(left, right, bottom, top, near, far);
        }
        else if (projectionType === "oblique") {
            const fieldOfView = (45 * Math.PI) / 180; // in radians
            const aspect =
                webgl.gl.canvas.clientWidth / webgl.gl.canvas.clientHeight;
            const zNear = 0.1;
            const zFar = 100.0;
            projectionMatrix = create();
            perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        }
        else {
            const fieldOfView = (45 * Math.PI) / 180; // in radians
            const aspect =
                webgl.gl.canvas.clientWidth / webgl.gl.canvas.clientHeight;
            const zNear = 0.1;
            const zFar = 100.0;
            projectionMatrix = create();
            perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        }

        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.

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

        if (enableAnimation) {
            rotate(
                modelViewMatrix, // destination matrix
                modelViewMatrix, // matrix to rotate
                cubeRotation * 0.5, // amount to rotate in radians
                [0, 0, 1]
            ); // axis to rotate around (Z)
            rotate(
                modelViewMatrix, // destination matrix
                modelViewMatrix, // matrix to rotate
                cubeRotation * 0.5, // amount to rotate in radians
                [0, 1, 0]
            ); // axis to rotate around (Y)
            rotate(
                modelViewMatrix, // destination matrix
                modelViewMatrix, // matrix to rotate
                cubeRotation * 0.5, // amount to rotate in radians
                [1, 0, 0]
            ); // axis to rotate around (X)
        }

        const normalMatrix = create();
        invert(normalMatrix, modelViewMatrix);
        transpose(normalMatrix, normalMatrix);

        // Set uniform bool u_Shading value for determining shading mode
        const isShading = getShadingMode();

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.

        webgl.gl.bindBuffer(webgl.gl.ARRAY_BUFFER, buffer.position);
        webgl.gl.vertexAttribPointer(
            webgl.programInfo.attribLocation.vertexPosition,
            3,
            webgl.gl.FLOAT,
            false,
            0,
            0
        );
        webgl.gl.enableVertexAttribArray(
            webgl.programInfo.attribLocation.vertexPosition
        );

        webgl.gl.bindBuffer(webgl.gl.ARRAY_BUFFER, buffer.color);
        webgl.gl.vertexAttribPointer(
            webgl.programInfo.attribLocation.vertexColor,
            4,
            webgl.gl.FLOAT,
            false,
            0,
            0
        );
        webgl.gl.enableVertexAttribArray(
            webgl.programInfo.attribLocation.vertexColor
        );

        webgl.gl.bindBuffer(webgl.gl.ARRAY_BUFFER, buffer.normal);
        webgl.gl.vertexAttribPointer(
            webgl.programInfo.attribLocation.vertexNormal,
            3,
            webgl.gl.FLOAT,
            false,
            0,
            0
        );
        webgl.gl.enableVertexAttribArray(
            webgl.programInfo.attribLocation.vertexNormal
        );

        // Tell WebGL which indices to use to index the vertices
        webgl.gl.bindBuffer(webgl.gl.ELEMENT_ARRAY_BUFFER, buffer.index);

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
            const vertexCount = vCount / 2;
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
    setPositionAttribute(webgl, buffer) {
        webgl.gl.bindBuffer(webgl.gl.ARRAY_BUFFER, buffer.position);
        webgl.gl.vertexAttribPointer(
            webgl.programInfo.attribLocation.vertexPosition,
            3,
            webgl.gl.FLOAT,
            false,
            0,
            0
        );
        webgl.gl.enableVertexAttribArray(
            webgl.programInfo.attribLocation.vertexPosition
        );
    }

    /**
     * Set color
     * @param {WebGL} webgl
     */
    setColorAttribute(webgl, buffer) {
        webgl.gl.bindBuffer(webgl.gl.ARRAY_BUFFER, buffer.color);
        webgl.gl.vertexAttribPointer(
            webgl.programInfo.attribLocation.vertexColor,
            4,
            webgl.gl.FLOAT,
            false,
            0,
            0
        );
        webgl.gl.enableVertexAttribArray(
            webgl.programInfo.attribLocation.vertexColor
        );
    }

    /**
     * Set normal
     * @param {WebGL} webgl
     */
    setNormalAttribute(webgl, buffer) {
        webgl.gl.bindBuffer(webgl.gl.ARRAY_BUFFER, buffer.normal);
        webgl.gl.vertexAttribPointer(
            webgl.programInfo.attribLocation.vertexNormal,
            3,
            webgl.gl.FLOAT,
            false,
            0,
            0
        );
        webgl.gl.enableVertexAttribArray(
            webgl.programInfo.attribLocation.vertexNormal
        );
    }
}
