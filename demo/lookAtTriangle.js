var VSHADER_SOURCE = 
    'attribute vec4 a_Position;' +
    'attribute vec4 a_Color;' +
    'uniform mat4 v_ViewMatrix;' +
    'varying vec4 v_Color;' + 
    'void main() {' +
    '   gl_Position = v_ViewMatrix * a_Position;' +
    '   v_Color = a_Color;' +
    '}';

var FSHADER_SOURCE = 
    '#ifdef GL_ES\n' + 
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;' +
    'void main() {' +
    '   gl_FragColor = v_Color;' +
    '}';

function main() {
    var canvas = document.querySelector('#webgl');

    var gl = canvas.getContext('webgl');

    if (!initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    var n = initVertexBuffers(gl);

    gl.clearColor(0, 0, 0, 1);

    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'v_ViewMatrix');

    var viewMatrix = new Matrix4();
    viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
    console.log(viewMatrix.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);

}


function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
        // Vertex coordinates and color(RGBA)
        0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, // The back green one
        -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
        0.5, -0.5,  -0.4,  1.0,  0.4,  0.4, 
    
        0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // The middle yellow one
        -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
        0.0, -0.6,  -0.2,  1.0,  1.0,  0.4, 
 
        0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
        -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
        0.5, -0.5,   0.0,  1.0,  0.4,  0.4, 
    ]);

    var n = 9;

    var vertexColorbuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return n;
}