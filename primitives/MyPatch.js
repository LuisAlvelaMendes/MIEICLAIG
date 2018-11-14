/**
/**
 * MyPatch
 * @constructor
 */
class MyPatch extends CGFobject{

	constructor(scene, npointsU, npointsV,npartsU, npartsV, controlPoints) 
	{
		super(scene);
		this.scene = scene;
		this.npointsU = npointsU;
		this.npointsV = npointsV;
		this.npartsV = npartsV;
		this.npartsU = npartsU;
		this.controlPoints = controlPoints;
		this.formattedControlPoints = [];
		this.initBuffers();
	};

	reorganizeControlPoints(){
		var innerArray = [];
		var previousJ = 0;

		for(var i = 0; i < this.npointsU; i++){

			innerArray = [];

			for(var j = 0; j < this.npointsV; j++){
				innerArray.push([this.controlPoints[previousJ][0], this.controlPoints[previousJ][1], this.controlPoints[previousJ][2], 1]);
				previousJ++;
			}

			this.formattedControlPoints.push(innerArray);
		}
	}

	initBuffers()
	{	
		var degreeU = this.npointsU - 1;
		var degreeV = this.npointsV - 1;
		this.reorganizeControlPoints();
		var nurbsSurface = new CGFnurbsSurface(degreeU, degreeV, this.formattedControlPoints);
		this.nurbs = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface);
	};

	display()
	{
		console.log("TEST patch")
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