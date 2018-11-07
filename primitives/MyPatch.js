/**
/**
 * MyPatch
 * @constructor
 */
class MyPatch extends CGFobject{

	constructor(scene, npointsU, npointsV,npartsU, npartsV, xx,yy,zz) 
	{
		super(scene);

		this.scene =scene;
		this.npointsU =npointsU;
		this.npointsV = npointsV;
		this.npartsV =npartsV;
		this.npartsU = npartsU;
		this.initBuffers();
	};

	initBuffers()
	{	
		
	};

};

console.log("hi");