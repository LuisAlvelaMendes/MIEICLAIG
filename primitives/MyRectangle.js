/**
/**
 * MyQuad
 * @constructor
 */
class MyRectangle extends CGFobject
{
	constructor(scene, id, x1, y1, x2, y2) 
	{
		super(scene);

		this.id = id;
		this.x1 = x1; 
	    this.x2 = x2;
	    this.y1 = y1; 
	    this.y2 = y2;

		this.initBuffers();    
	};

	initBuffers() 
	{	
		
		this.vertices = [
		this.x1, this.y1, 0, // ( 0, 5) 
		this.x2,this.y1, 0, //  ( 5, 5) 
		this.x1,this.y2, 0, // (0,0)
		this.x2,this.y2, 0 // (5,0)
		];

		this.indices = [
		1,0,2,
		3,1,2
		];
		
		//this.primitiveType = this.scene.gl.TRIANGLES;
		
		this.normals = [ //uma norma para cada um dos vertices; neste caso terao todos a mesma orientcao
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1
		];

		this.initGLBuffers();
	};

};
