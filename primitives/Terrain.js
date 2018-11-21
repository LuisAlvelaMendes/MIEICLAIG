/**
 * Terrain
 * @constructor
 */
class Terrain extends CGFobject
{

	constructor(scene, idtexture, idheightmap, parts, heightscale) 
	{
        super(scene);
        this.scene = scene;
        this.idtexture = idtexture;
        this.idheightmap = idheightmap;
        this.parts = parts;
        this.heightscale = heightscale;
        this.planeToApply = new MyPlane(this.scene, 'apply', this.parts, this.parts);
        this.initBuffers();
	};
	
	initBuffers() 
	{	
		this.shaderObject = new CGFshader(this.scene.gl, "scenes/shaders/terrain.vert", "scenes/shaders/terrain.frag"),
        this.terrainTexture = new CGFtexture(this.scene, this.idtexture);
        this.terrainHeightMap = new CGFtexture(this.scene, this.idheightmap);
    };
    
    setUniformValues()
    {
        // uSampler2 is set to 1, it will look for the texture bound to unit 1
        this.shaderObject.setUniformsValues({uSampler2: 1});
        this.shaderObject.setUniformsValues({heightScale: this.heightscale});
    };

	display()
	{
        this.setUniformValues();
        this.scene.setActiveShader(this.shaderObject);
        this.scene.pushMatrix();
        this.terrainTexture.bind(0);
        // the heightmap is bound to unit 1
        this.terrainHeightMap.bind(1);
        //this.scene.scale(500, 500, 500);
        this.planeToApply.display();
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
	};


	// Don't know if we will need to apply textures to NURBS / if it is applied in the same way.

	scaleTextureCoords(tex1, tex2)
	{
	
	};

	resetCoords()
	{

    };
};
