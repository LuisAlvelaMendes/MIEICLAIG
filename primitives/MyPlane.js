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

		console.log("Created plane of id " + id + "npartsU: " +  npartsU + " npartsV: " + npartsV);
		this.initBuffers();    
	};
	
	initBuffers() 
	{	

	};
};