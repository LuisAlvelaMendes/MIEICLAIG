#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float heightScale;
uniform sampler2D heightMap;
varying vec4 coords;
varying vec4 normal;

//rgb to greyscale internet.
//texture2D(uSampler, vTextureCoord);
// guardar variavel o texture2D, converter rgb a greyscale,
//offset = vec3(0.0, greyscale*Heightscale, 0.0)

void main() {
	vec4 vertex=vec4(aVertexPosition+aVertexNormal*offset*0.1, 1.0);

	gl_Position = uPMatrix * uMVMatrix * vertex;

	normal = vec4(aVertexNormal, 1.0);

	coords=vertex/10.0;
}
