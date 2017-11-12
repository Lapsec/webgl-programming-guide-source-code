
function initShader(gl, vshader, fshader) {
    var program = createProgram(gl, vshader, fshader);
    gl.useProgram(program);
    gl.program = program;

    if (!program) {
        console.error('Failed to create program');
        return false;
      }

    return true;
}

function createProgram(gl, vshader, fshader) {
    var program = gl.createProgram();
    
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vshader);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fshader);

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        var error = gl.getProgramInfoLog(program);
        console.log('Failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }


    return program;
}

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    if (shader == null) {
        console.log('unable to create shader');
        return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(!compiled) {
        var error = gl.getShaderInfoLog(shader);
        console.log('Failed to compile shader: ' + error);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}