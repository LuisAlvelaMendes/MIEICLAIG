/**
/**
 * MyTriangle
 * @constructor
 */
class MyTriangle extends CGFobject
{
	constructor(scene, id, x1, y1, x2, y2, x3, y3) 
	{
		super(scene);

		this.id = id;
		this.x1 = x1; 
	    this.x2 = x2;
	    this.y1 = y1; 
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;

		this.initBuffers();    
	};

	initBuffers() 
	{	
		
		this.vertices = [
		this.x1, this.y1, 0,  
		this.x2,this.y2, 0, 
		this.x3,this.y3, 0 
		];

		this.indices = [
		1,0,2,
		3,1,2
		];
		
		//this.primitiveType = this.scene.gl.TRIANGLES;
		
		this.normals = [ 
		0, 0, 1,
		0, 0, 1,
		0, 0, 1
		];

		this.initGLBuffers();
	};

};
