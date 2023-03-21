const DefaultVertCode = `
    attribute vec4 a_VertexPosition;
    attribute vec3 a_VertexNormal;
    attribute vec4 a_VertexColor;

    uniform mat4 u_NormalMatrix;
    uniform mat4 u_ModelViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    
    varying lowp vec4 v_Color;
    varying highp vec3 v_Lighting;

    void main(void) {
        gl_Position =  u_ProjectionMatrix * u_ModelViewMatrix * a_VertexPosition;
        v_Color = a_VertexColor;

        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        highp vec3 directionalLightColor = vec3(1, 1, 1);
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

        highp vec4 transformed_normal = u_NormalMatrix * vec4(a_VertexNormal, 1.0);

        highp float directional = max(dot(transformed_normal.xyz, directionalVector), 0.0);
        v_Lighting = ambientLight + (directionalLightColor * directional);
    }
`;

const DefaultFragCode = `
    varying lowp vec4 v_Color;
    varying highp vec3 v_Lighting;

    uniform bool u_Shading;

    void main(void) {
    if (u_Shading) {
        gl_FragColor = vec4(v_Color.rgb * v_Lighting, v_Color.a);
    } else {
        gl_FragColor = v_Color;
    }
    }
`;

export { DefaultVertCode, DefaultFragCode };
