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
		var obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	};
};