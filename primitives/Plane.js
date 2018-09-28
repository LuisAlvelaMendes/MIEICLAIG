
/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */
class Plane extends CGFobject{

	constructor(scene, nrDivs, minS,maxS,minT,maxT) 
	{
		super(scene);
		
		nrDivs = typeof nrDivs !== 'undefined' ? nrDivs : 1;
		this.nrDivs = nrDivs;
		this.patchLength = 1.0 / nrDivs;

		this.minS = minS || 0;
	    this.maxS = maxS || 1;
	    this.minT = minT || 0;
	    this.maxT = maxT || 1;

		this.initBuffers();
	};

	initBuffers()
	{	
		/* example for nrDivs = 3 :
		(numbers represent index of point in vertices array)

				y
				^
				|
		0    1  |  2    3
				|
		4	 5	|  6    7
		--------|--------------> x
		8    9  |  10  11
				|
		12  13  |  14  15    

		*/


		this.texCoords = [];

		var stepS=(this.maxS-this.minS)/this.nrDivs;
		var stepT=(this.maxT-this.minT)/this.nrDivs;

		// Generate vertices and normals 
		this.vertices = [];
		this.normals = [];
		

		var yCoord = 0.5;

		for (var j = 0; j <= this.nrDivs; j++){
			var xCoord = -0.5;
			for (var i = 0; i <= this.nrDivs; i++){
				this.vertices.push(xCoord, yCoord, 0);
				this.normals.push(0,0,1);
				this.texCoords.push(this.minS+i*stepS, this.minT+j*stepT);
				xCoord += this.patchLength;
			}
			yCoord -= this.patchLength;
		}
		
		this.indices = [];
		var ind=0;


		for (var j = 0; j < this.nrDivs; j++) {
			for (var i = 0; i <= this.nrDivs; i++) {
				this.indices.push(ind);
				this.indices.push(ind+this.nrDivs+1);
				ind++;
			}
			if (j+1 < this.nrDivs)
			{
				
				this.indices.push(ind+this.nrDivs);
				this.indices.push(ind);
			}
		}
		
		this.primitiveType = this.scene.gl.TRIANGLE_STRIP;

		this.initGLBuffers();
	};

};