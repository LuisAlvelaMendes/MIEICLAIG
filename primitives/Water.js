/**
/**
 * Water
 * @constructor
 */
class Water extends CGFobject
{
	constructor(scene, idtexture, idwavemap, parts, heightscale, texscale) 
	{
		super(scene);
		this.idtexture = idtexture;
		this.idwavemap = idwavemap;
		this.parts = parts;
		this.heightscale = heightscale;
		this.texscale = texscale;
		this.planeToApply = new MyPlane(this.scene, 'apply', this.parts, this.parts);
		this.initBuffers();
	};
	
	initBuffers() 
	{	
		this.shaderObject = new CGFshader(this.scene.gl, "scenes/shaders/water.vert", "scenes/shaders/water.frag"),
        this.waterTexture = new CGFtexture(this.scene, this.idtexture);
        this.waterHeightMap = new CGFtexture(this.scene, this.idwavemap);
	};

	setUniformValues()
    {	

    	//todos os objetos(primitivas) tem um array de texturas q podem ser aplicados
    	// EX: armario (6 paredes) cada parece tem um array (0)(1) de texturas q podem ser aplicadas
        // uSampler2 is set to 1, it will look for the texture bound to unit 1
        //sample 2 esta associado a unicada (1) 
        // sample 1 esta associado  (0)
        //sampler variavel associada à unidade que eu quero buscar
        this.shaderObject.setUniformsValues({uSampler2: 1});
        this.shaderObject.setUniformsValues({heightScale: this.heightscale});
	};
	
	update(time)
	{
		var factor = (Math.sin((time * 3.0) % 3141 * 0.002)+1.0)*0.5;
		this.shaderObject.setUniformsValues({timeFactor: factor});
	};

	display()
	{
		this.setUniformValues();
        this.scene.setActiveShader(this.shaderObject);
        this.scene.pushMatrix();

        //water texture´tem a cor mesmo da agua - coocar na unidade (0) é a cor da agua 
        this.waterTexture.bind(0);
        // the heightmap is bound to unit 1

        //water relevo da agua - coocar na unidade (1) é a cor da agua 
        this.waterHeightMap.bind(1);
        this.scene.scale(180, 180, 180);
        this.planeToApply.display();
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
	};

	scaleTextureCoords(tex1, tex2)
	{
	
	};

	resetCoords()
	{

	};
};