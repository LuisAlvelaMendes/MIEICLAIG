/**
/**
 * MyTriangle
 * 
 * NEEDS BETTER TEXTURES!!!!!!!!
 * 
 * @constructor
 */
class MyTriangle extends CGFobject
{
	constructor(scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3) 
	{
		super(scene);

		this.id = id;
		this.x1 = x1; 
	    this.x2 = x2;
	    this.y1 = y1; 
        this.y2 = y2;
        this.x3 = x3;
		this.y3 = y3;
		this.z3 = z3;
		this.z1 = z1;
		this.z2 = z2;
		this.minS = 0.0;
        this.minT = 0.0;
        this.maxS = (x2-x1)//lenghtS;
        this.maxT = (y2-y1)//lengthT;

		this.initBuffers();    
	};

	initBuffers() 
	{	
		
		this.vertices = [
			this.x1, this.y1, this.z1,  // ( 0,0,0)
			this.x2,this.y2, this.z2,   // (0,2,0)
			this.x3,this.y3, this.z3  // (0,2,2)
		];

		this.indices = [
		0,1,2
		];
		
		this.primitiveType = this.scene.gl.TRIANGLES;
		
		this.normals = [ 
		0, 0, 1,
		0, 0, 1,
		0, 0, 1
		];

		this.texCoords = [
            this.minS,this.maxT,
            this.maxS,this.maxT,
            this.minS,this.minT,
            this.maxS,this.minT
        ];

		this.initGLBuffers();
	};

};
