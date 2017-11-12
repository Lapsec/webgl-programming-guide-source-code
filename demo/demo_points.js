var VSHADER_SOURCE = 
    'attribute vec4 a_Position;' +
    'attribute float a_PointSize;' +
    'void main(){ ' +
    'gl_Position = a_Position;' +
    'gl_PointSize = a_PointSize;' +
    '}'

var FSHADER_SOURCE = 
    'void main() {\n' +
    '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

function main() {
    var canvas = document.getElementById('webgl');

    var gl = canvas.getContext('webgl');

    var vertexShader = setupShader(gl, VSHADER_SOURCE, gl.VERTEX_SHADER);
    var fragmentShader = setupShader(gl, FSHADER_SOURCE, gl.FRAGMENT_SHADER);
    if(!vertexShader || !fragmentShader) {
        console.log('shader was fucked');
        return;
    }

    var program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(!linked){
        var error = gl.getProgramInfoLog(program);
        console.log('Failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
    }
    gl.useProgram(program);
    gl.program = program;
    var vertices = new Float32Array([
        -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5
    ]);

    var n = 3;

    var sizes = new Float32Array([
        10.0, 20.0, 30.0
    ]);

    var vertexBuffer = gl.createBuffer();
    var sizeBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0){
        console.log('Failed to get the storage location of a_Position');
        return -1
    }

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Bind the point size buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if(a_PointSize < 0) {
        console.log('Failed to get the storage location of a_PointSize');
        return -1;
      }
    
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_PointSize);

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function setupShader(gl, shaderSource, shaderType) {
    var shader = gl.createShader(shaderType);
    if (shader == null) {
        console.log('unable to create shader');
        return null;
      }
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    // Check the result of compilation
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader);
    console.log('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }
    return shader;
}
