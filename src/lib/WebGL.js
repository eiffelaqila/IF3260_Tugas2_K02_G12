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
    scale,
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

    /** @type {x: number, y: number, z: number} Object rotation parameters */
    #objRotationAngle;
    /** @type {x: number, y: number, z: number} Object translation parameters */
    #objTranslation;
    /** @type {x: number, y: number, z: number} Object scale parameters */
    #objScale;

    /** @type {mat4} Model view matrix in mat4 */
    #modelViewMatrix;

    /** @type {Object} Object to be drawn */
    #object;

    /** @type {number} Camera radius */
    #camRadius;
    /** @type {x: number, y: number, z: number} Camera rotation parameters */
    #camRotationAngle;
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
        this.#camRadius = 200;
        this.#camRotationAngle = {
            x: 0,
            y: 0,
            z: 0
        }
        this.#objRotationAngle = {
            x: 0,
            y: 0,
            z: 0,
        };

        this.#objTranslation = {
            x: 0,
            y: 0,
            z: 0,
        };

        this.#objScale = {
            x: 1,
            y: 1,
            z: 1,
        };

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
        this.#animationMode = false;
    }

    // Getter: 
    // - WebGL Class (gl)
    // - WebGL Program (program)
    // - WebGL Program Info (programInfo)
    // - WebGL Buffer (WebGLBuffer)
    // - Parsed Object (Object)
    // - Model View Matrix (mat4)
    // - Object to be drawn (Object)
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

    // Setter:
    // - Object rotation (theta_x, theta_y, theta_z) in radians
    // - Object translation (dist_x, dist_y, dist_z)
    // - Object scaling (x, y, z) in scalar
    // - Camera radius
    // - Camera rotation (theta_x, theta_y, theta_z) in radians
    /**
     * Set object rotation angle to X-axis
     * @param {number} theta Angle in radians
     */
    setObjRotationX(theta) {
        this.#objRotationAngle.x = theta;
    }

    /**
     * Set object rotation angle to Y-axis
     * @param {number} theta Angle in radians
     */
    setObjRotationY(theta) {
        this.#objRotationAngle.y = theta;
    }

    /**
     * Set object rotation angle to Z-axis
     * @param {number} theta Angle in radians
     */
    setObjRotationZ(theta) {
        this.#objRotationAngle.z = theta;
    }

    /**
     * Set object translation distance with respect to X-axis
     * @param {number} dist Distance units
     */
    setObjTranslationX(dist) {
        this.#objTranslation.x = dist;
    }

    /**
     * Set object translation distance with respect to Y-axis
     * @param {number} dist Distance units
     */
    setObjTranslationY(dist) {
        this.#objTranslation.y = dist;
    }

    /**
     * Set object translation distance with respect to Z-axis
     * @param {number} dist Distance units
     */
    setObjTranslationZ(dist) {
        this.#objTranslation.z = dist;
    }

    /**
     * Set object scale with respect to x-value in coordinate
     * @param {number} x Scale factor
     */
    setObjScaleX(x) {
        this.#objScale.x = x;
    }

    /**
     * Set object scale with respect to y-value in coordinate
     * @param {number} y Scale factor
     */
    setObjScaleY(y) {
        this.#objScale.y = y;
    }

    /**
     * Set object scale with respect to z-value in coordinate
     * @param {number} z Scale factor
     */
    setObjScaleZ(z) {
        this.#objScale.z = z;
    }

    /**
     * Set camera radius
     * @param {number} radius Camera radius
     */
    setCamRadius(radius) {
        this.#camRadius = radius;
    }

    /**
     * Set camera rotation angle to X-axis
     * @param {number} theta Angle in radians
     */
    setCamRotationX(theta) {
        this.#camRotationAngle.x = theta;
    }

    /**
     * Set camera rotation angle to Y-axis
     * @param {number} theta Angle in radians
     */
    setCamRotationY(theta) {
        this.#camRotationAngle.y = theta;
    }

    /**
     * Set camera rotation angle to Z-axis
     * @param {number} theta Angle in radians
     */
    setCamRotationZ(theta) {
        this.#camRotationAngle.z = theta;
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
            [0.0, 0.0, this.#camRadius * 1.5],
            [0.0, 0.0, 0.0],
            [0.0, 1.0, 0.0]
        );

        // ROTATION MATRIX AROUND Y
        rotate(
            viewMatrix, // destination matrix
            viewMatrix, // matrix to rotate
            (this.#camRotationAngle.x * Math.PI) / 180,
            [1.0, 0.0, 0.0]
        );
        rotate(
            viewMatrix, // destination matrix
            viewMatrix, // matrix to rotate
            (this.#camRotationAngle.y * Math.PI) / 180,
            [0.0, 1.0, 0.0]
        );
        rotate(
            viewMatrix, // destination matrix
            viewMatrix, // matrix to rotate
            (this.#camRotationAngle.z * Math.PI) / 180,
            [0.0, 0.0, 1.0]
        );

        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        const modelMatrix = create();

        // TRANSLATION MATRIX AROUND X
        translate(
            modelMatrix, // destination matrix
            modelMatrix, // matrix to translate
            [this.#objTranslation.x, this.#objTranslation.y, this.#objTranslation.z]
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

        // ROTATION MATRIX AROUND X
        rotate(
            modelMatrix, // destination matrix
            modelMatrix, // matrix to rotate
            (this.#objRotationAngle.x * Math.PI) / 180,
            [1, 0, 0]
        );

        // ROTATION MATRIX AROUND Y
        rotate(
            modelMatrix, // destination matrix
            modelMatrix, // matrix to rotate
            (this.#objRotationAngle.y * Math.PI) / 180,
            [0, 1, 0]
        );

        // ROTATION MATRIX AROUND Z
        rotate(
            modelMatrix, // destination matrix
            modelMatrix, // matrix to rotate
            (this.#objRotationAngle.z * Math.PI) / 180,
            [0, 0, 1]
        );

        // SCALING MATRIX
        scale(
            modelMatrix,
            modelMatrix,
            [this.#objScale.x, this.#objScale.y, this.#objScale.z]
        )

        

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
}
