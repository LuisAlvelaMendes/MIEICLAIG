#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float timeFactor;
uniform float heightScale;

varying vec2 vTextureCoord;

uniform sampler2D uSampler2;

void main() {

    vec2 timeOffset = vec2(timeFactor, timeFactor);

    vec2 TextureCoords = aTextureCoord+timeOffset;

    vec4 color = texture2D(uSampler2, TextureCoords);
    
    // converting the rgb to grayscale
	float grayScale = dot(color.rgb, vec3(0.299, 0.587, 0.114));

    vec3 offset = vec3(0.0, grayScale * heightScale, 0.0);

    // vertex pushed outwards according to the normal and scale
    vec4 vertex = vec4(aVertexPosition+aVertexNormal*offset*0.1, 1.0);
    // projected vertex

	vTextureCoord = TextureCoords;

    gl_Position = uPMatrix * uMVMatrix * vertex;
}