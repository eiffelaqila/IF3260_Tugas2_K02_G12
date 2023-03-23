export function ortographicProjMat(left, right, bottom, top, near, far) {
    return [
        2.0 / (right - left),   0,                      0,                      -(right + left) / (right - left),
        0,                      2.0 / (top - bottom),   0,                      -(top + bottom) / (top - bottom),
        0,                      0,                      2.0 / (near - far),     (near + far) / (near - far),
        0,                      0,                      0,                      1
    ]
}

export function ortographicProjMat1(left, right, bottom, top, near, far) {
    let lr = 1 / (left - right);
    let bt = 1 / (bottom - top);
    let nf = 1 / (near - far);
    return [
        -2 * lr,                0,                      0,                      0,
        0,                      -2 * bt,                0,                      0,
        0,                      0,                      2.0 * nf,               0,
        (left + right) * lr,    (top + bottom) * bt,    (far + near) * nf,      1
    ]
}

export function ortographicProjMat2(left, right, bottom, top, near, far) {
    return [
        2 / (right - left),                 0,                                  0,                              0,
        0,                                  2 / (top - bottom),                 0,                              0,
        0,                                  0,                                  2 / (near - far),               0,
        (left + right) / (left - right),    (bottom + top) / (bottom - top),    (near + far) / (near - far),    1,
    ];
}