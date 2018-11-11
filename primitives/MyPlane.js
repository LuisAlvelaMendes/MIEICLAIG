/**
/**
 * MyPlane
 * @constructor
 */
class MyPlane extends CGFobject
{
	constructor(scene, id, npartsU, npartsV) 
	{
		super(scene);
		this.npartsU = npartsU;
		this.npartsV = npartsV;
		this.id = id;
		this.initBuffers();    
	};
	
	initBuffers() 
	{	
		var degree1 = 1;
		var degree2 = 1;
		var controlvertexes = [	[ [-0.5, 0.0, 0.5, 1], [-0.5,  0.0, -0.5, 1] ], [ [0.5, 0.0, 0.5, 1], [0.5,  0.0, -0.5, 1] ] ];
		var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);
		this.nurbs = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	};

	display()
	{
		this.nurbs.display();
	};


	// Don't know if we will need to apply textures to NURBS / if it is applied in the same way.

	scaleTextureCoords(tex1, tex2)
	{
	
	};

	resetCoords()
	{

	};
};