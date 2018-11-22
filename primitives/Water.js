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
        // uSampler2 is set to 1, it will look for the texture bound to unit 1
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
        this.waterTexture.bind(0);
        // the heightmap is bound to unit 1
        this.waterHeightMap.bind(1);
        this.scene.scale(100, 100, 100);
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