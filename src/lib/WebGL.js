import { DefaultFragCode, DefaultVertCode } from "./shaders/DefaultShaders.js";
import { initBuffers } from "../lib/Buffers.js";
import {
    create,
    translate,
    rotate,
    invert,
    transpose,
    mat4,
    lookAt,
    multiply,
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
    /** @type {"orth" | "pers" | "obl"} Projection type identifier */
    #projectionType;
    /** @type {boolean} Shading mode identifier whether enabled or not */
    /** @type {Array<number>} Orthogonal projection matrix */
    #orthProjMatrix;
    /** @type {Array<number>} Perspective projection matrix */
    #persProjMatrix;
    /** @type {Array<number>} Oblique projection matrix */
    #oblProjMatrix;
    /** @type {boolean} Shading mode identifier whether enabled or not */
    #shadingMode;
    /** @type {boolean} Animation mode identifier whether enabled or not */
    #animationMode;
    /** @type {{projection: {ortho: {right: number, left: number, top: number, bottom: number}, pers: {fov: number, aspect: number}, obl: {thetaValue: number, phi: number}, zNear: number, zFar: number}}} */
    #constants;

    #rotation;
    #translation;

    #modelViewMatrix;
    #object;
    #radius;
    #angleX;
    #angleY;
    #angleZ;

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
        this.#modelViewMatrix = null;
        this.#angleX = 0;
        this.#angleY = 0;
        this.#angleZ = 0;
        this.#radius = 200;

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

        this.#constants = {
            projection: {
                ortho: {
                    right: 6,
                    left: -6,
                    top: 6,
                    bottom: -6,
                },
                pers: {
                    fov: (45 * Math.PI) / 180,
                    aspect:
                        this.gl.canvas.clientWidth /
                        this.gl.canvas.clientHeight,
                },
                obl: {
                    thetaValue: 45,
                    phi: 45,
                },
                zNear: 1,
                zFar: 1000,
            },
        };

        this.#projectionType = "orth";
        this.setProjectionMatrices();

        this.#shadingMode = true;
        this.#animationMode = true;

        this.#rotation = {
            x: 0,
            y: 0,
            z: 0,
        };

        this.#translation = {
            x: 0,
            y: 0,
            z: 0,
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
    get modelViewMatrix() {
        return this.#modelViewMatrix;
    }
    get object() {
        return this.#object;
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
        this.#object = object;
        let parsedObject = parseHollowObject(object);

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
    drawScene(webgl, buffer, vCount, cubeRotation) {
        // Compute camera matrix
        const viewMatrix = create();
        lookAt(
            viewMatrix,
            [0.0, 0.0, this.#radius * 1.5],
            [0.0, 0.0, 0.0],
            [0.0, 1.0, 0.0]
        );

        // ROTATION MATRIX AROUND Y
        rotate(
            viewMatrix, // destination matrix
            viewMatrix, // matrix to rotate
            (this.#angleX * Math.PI) / 180,
            [1.0, 0.0, 0.0]
        );
        rotate(
            viewMatrix, // destination matrix
            viewMatrix, // matrix to rotate
            (this.#angleY * Math.PI) / 180,
            [0.0, 1.0, 0.0]
        );
        rotate(
            viewMatrix, // destination matrix
            viewMatrix, // matrix to rotate
            (this.#angleZ * Math.PI) / 180,
            [0.0, 0.0, 1.0]
        );

        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        const modelMatrix = create();

        // TRANSLATION MATRIX AROUND X
        translate(
            modelMatrix, // destination matrix
            modelMatrix, // matrix to translate
            [this.#translation.x, this.#translation.y, this.#translation.z]
        );

        // ROTATION MATRIX AROUND X
        rotate(
            modelMatrix, // destination matrix
            modelMatrix, // matrix to rotate
            (this.#rotation.x * Math.PI) / 180,
            [1, 0, 0]
        );

        // ROTATION MATRIX AROUND Y
        rotate(
            modelMatrix, // destination matrix
            modelMatrix, // matrix to rotate
            (this.#rotation.y * Math.PI) / 180,
            [0, 1, 0]
        );

        // ROTATION MATRIX AROUND Z
        rotate(
            modelMatrix, // destination matrix
            modelMatrix, // matrix to rotate
            (this.#rotation.z * Math.PI) / 180,
            [0, 0, 1]
        );

        if (this.#animationMode) {
            rotate(
                modelMatrix, // destination matrix
                modelMatrix, // matrix to rotate
                cubeRotation * 0.5, // amount to rotate in radians
                [0, 0, 1]
            ); // axis to rotate around (Z)
            rotate(
                modelMatrix, // destination matrix
                modelMatrix, // matrix to rotate
                cubeRotation * 0.5, // amount to rotate in radians
                [0, 1, 0]
            ); // axis to rotate around (Y)
            rotate(
                modelMatrix, // destination matrix
                modelMatrix, // matrix to rotate
                cubeRotation * 0.5, // amount to rotate in radians
                [1, 0, 0]
            ); // axis to rotate around (X)
        }

        const modelViewMatrix = create();
        multiply(modelViewMatrix, viewMatrix, modelMatrix);

        this.#modelViewMatrix = modelViewMatrix;

        const normalMatrix = create();
        invert(normalMatrix, modelViewMatrix);
        transpose(normalMatrix, normalMatrix);

        // Set projection matrix given projection type
        let projectionMatrix;
        if (this.#projectionType === "orth")
            projectionMatrix = this.#orthProjMatrix;
        else if (this.#projectionType === "pers")
            projectionMatrix = this.#persProjMatrix;
        else projectionMatrix = this.#oblProjMatrix;

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
            this.#shadingMode
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

    /**
     * Set orthogonal, perspective, and oblique projection matrices
     */
    setProjectionMatrices() {
        this.#orthProjMatrix = mat4.orthogonal(
            this.#constants.projection.ortho.right,
            this.#constants.projection.ortho.left,
            this.#constants.projection.ortho.top,
            this.#constants.projection.ortho.bottom,
            this.#constants.projection.zNear,
            this.#constants.projection.zFar
        );

        this.#persProjMatrix = mat4.perspective(
            this.#constants.projection.pers.fov,
            this.#constants.projection.pers.aspect,
            this.#constants.projection.zNear,
            this.#constants.projection.zFar
        );

        const m = mat4.oblique(
            -this.#constants.projection.obl.thetaValue,
            -this.#constants.projection.obl.phi
        );
        const n = mat4.orthogonal(
            this.#constants.projection.ortho.right,
            this.#constants.projection.ortho.left,
            this.#constants.projection.ortho.top,
            this.#constants.projection.ortho.bottom,
            this.#constants.projection.zNear,
            this.#constants.projection.zFar
        );
        this.#oblProjMatrix = mat4.multiply(m, n);
        this.#oblProjMatrix = mat4.translate(this.#oblProjMatrix, 3, 3, 3);
    }

    /**
     * Projection type setter
     * @param {"orth" | "pers" | "obl"} projType
     */
    setProjectionType(projType) {
        this.#projectionType = projType;
    }

    /**
     * Shading mode setter
     * @param {boolean} isShadingMode
     */
    setShadingMode(isShadingMode) {
        this.#shadingMode = isShadingMode;
    }

    /**
     * Animation mode setter
     * @param {boolean} isAnimationMode
     */
    setAnimationMode(isAnimationMode) {
        this.#animationMode = isAnimationMode;
    }

    setRotationX(angle) {
        this.#rotation.x = angle;
    }

    setRotationY(angle) {
        this.#rotation.y = angle;
    }

    setRotationZ(angle) {
        this.#rotation.z = angle;
    }

    setTranslationX(dist) {
        this.#translation.x = dist;
    }

    setTranslationY(dist) {
        this.#translation.y = dist;
    }

    setTranslationZ(dist) {
        this.#translation.z = dist;
    }

    setRadius(radius) {
        this.#radius = radius;
    }

    setAngleX(angleX) {
        this.#angleX = angleX;
    }

    setAngleY(angleY) {
        this.#angleY = angleY;
    }

    setAngleZ(angleZ) {
        this.#angleZ = angleZ;
    }
}
