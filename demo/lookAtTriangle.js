var VSHADER_SOURCE =
'attribute vec4 a_Position;\n' +
'attribute vec4 a_Color;\n' +
'uniform mat4 u_ViewMatrix;\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
'  gl_Position = u_ViewMatrix * a_Position;\n' +
'  v_Color = a_Color;\n' +
'}\n';

var FSHADER_SOURCE =
'#ifdef GL_ES\n' +
'precision mediump float;\n' +
'#endif\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
'  gl_FragColor = v_Color;\n' +
'}\n';

function main() {
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');

    initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);

    // var n = initVertexBuffers(gl);

    gl.clearColor(0, 0, 0, 1);

    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');

    var viewMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])

    setLookAt(viewMatrix, 0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
    console.log(viewMatrix);

    var viewMatrix = new Matrix4();
    viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
    console.log(viewMatrix.elements);
}

function setLookAt(vm, eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ) {
    var fX = eyeX - atX;
    var fY = eyeY - atY;
    var fZ = eyeZ - atZ;

    // Normalize f.
    rlf = 1 / Math.sqrt(fX*fX + fY*fY + fZ*fZ);
    fX *= rlf;
    fY *= rlf;
    fZ *= rlf;

    // Calculate cross product of f and up.
    var sX = fY * upZ - fZ * upY;
    var sY = fZ * upX - fX * upZ;
    var sZ = fX * upY - fY * upX;

    // Normalize s.
    var rls = 1 / Math.sqrt(sX*sX + sY*sY + sZ*sZ);
    sX *= rls;
    sY *= rls;
    sZ *= rls;

    // Calculate cross product of s and f.
    var uX = sY * fZ - sZ * fY;
    var uY = sZ * fX - sX * fZ;
    var uZ = sX * fY - sY * fX;

    vm[0] = sX;
    vm[1] = uX;
    vm[2] = fX;
    vm[3] = 0;

    vm[4] = sY;
    vm[5] = uY;
    vm[6] = fY;
    vm[7] = 0;

    vm[8] = sZ;
    vm[9] = uZ;
    vm[10] = fZ;
    vm[11] = 0;

    vm[12] = -(eyeX * sX + eyeY * sY + eyeZ * sY);
    vm[13] = -(eyeX * uX + eyeY * uY + eyeZ * uZ);
    vm[14] = -(eyeX * fX + eyeY * fY + eyeZ * fZ);
    vm[15] = 1;

    // -eyeX, -eyeY, -eyeZ
    // e[12] += e[0] * x + e[4] * y + e[8]  * z;
    // e[13] += e[1] * x + e[5] * y + e[9]  * z;
    // e[14] += e[2] * x + e[6] * y + e[10] * z;
    // e[15] += e[3] * x + e[7] * y + e[11] * z;    
}
