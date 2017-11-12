var VSHADER_SOURCE = 
    'attribute vec4 a_Position;' +
    'attribute vec2 a_TexCoord;' +
    'varying vec2 v_TexCoord;' +
    'void main() {' +
    '   gl_Position = a_Position;' +
    '   v_TexCoord = a_TexCoord;' +
    '}';

var FSHADER_SOURCE = 
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform sampler2D u_Sampler;' +
    'varying vec2 v_TexCoord;' +
    'void main(){' +
    '   gl_FragColor = texture2D(u_Sampler, v_TexCoord);' +
    '}';

function main() {
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
      }

    // Initialize shaders
    if (!initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the vertex information');
        return;
      }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    if (!initTextures(gl, n)) {
        console.log('Failed to intialize the texture.');
        return;
      }
}

function initVertexBuffers(gl){
    var verticesTexCoords = new Float32Array([
        -0.5,  0.5,   0.0, 1.0,
        -0.5, -0.5,   0.0, 0.0,
         0.5,  0.5,   1.0, 1.0,
         0.5, -0.5,   1.0, 0.0,
    ]);
    var n = 4;

    var vertexTexCoordBuffer = gl.createBuffer();


    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    var FSIZE = vertexTexCoordBuffer.BYTES_PER_ELEMENT;
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*4, 0);

    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    if (a_TexCoord < 0) {
        console.log('Failed to get the storage location of a_TexCoord');
        return -1;
      }

    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);

    gl.enableVertexAttribArray(a_TexCoord);
    return n;
}

function initTextures(gl, n) {
    var texture = gl.createTexture();
    if(!texture) {
        console.log('Failed to create the texture object');
        return false;
    }

    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    if (!u_Sampler) {
        console.log('Failed to get the storage location of u_Sampler');
        return false;
    }

    var image = new Image();
    if (!image) {
        console.log('Failed to create the image object');
        return false;
      }

    image.onload = function(){loadTexture(gl, n, texture, u_Sampler, image)};
    image.src = '../resources/sky.JPG';

    return true;
}


function loadTexture(gl, n, texture, u_Sampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_Sampler, 0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}