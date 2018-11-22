#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

// New var
uniform float heightScale;
uniform sampler2D uSampler2;

void main() {

	// getting original rgb color from heightMap
	vec4 color = texture2D(uSampler2, aTextureCoord);

	// converting the rgb to grayscale
	float grayScale = dot(color.rgb, vec3(0.299, 0.587, 0.114));

	vec3 offset = vec3(0.0, grayScale * heightScale, 0.0);
	
	vec4 vertex = vec4(aVertexPosition + aVertexNormal * offset * 0.1, 1.0);

	vTextureCoord = aTextureCoord;

	gl_Position = uPMatrix * uMVMatrix * vertex;
}