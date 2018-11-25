#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float texscale;
uniform float timeFactor;

void main() {

	vec2 timeOffset = vec2(timeFactor, timeFactor);

    vec2 TextureCoords = vTextureCoord+timeOffset;

	gl_FragColor = texture2D(uSampler, TextureCoords/texscale);
}