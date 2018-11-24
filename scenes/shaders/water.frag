#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float texscale;

void main() {
	//vai buscar a textura original q esta no 
	//unicade(1) controla a altimetria (preto e branco)
	//sample esta a controlar a cor(0) unidade(0) da a cor original a cena
	//texture2d da informacao a cerca da textura q poes la para dentro - Usanpler esta ligado a unidade(0) 
	gl_FragColor = texture2D(uSampler, vTextureCoord/texscale);
}