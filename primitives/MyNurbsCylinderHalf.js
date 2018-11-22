/**
/**
 * MyNurbsCylinderHalf
 * @constructor
 */
class MyNurbsCylinderHalf extends CGFobject{

	constructor(scene, id, slices, stacks, top, base, height) 
	{
        super(scene);
        this.id = id;
        this.base = base;
        this.top = top;
        this.slices = slices;
        this.stacks = stacks;
        this.height = height;
        this.npartsU = slices/2; // em XY
		this.npartsV = stacks/2; // em Z
		this.npointsU = 4;
		this.npointsV = 2;

		this.controlPoints = [];
		this.formattedControlPoints = [];

		this.controlPoints.push([-this.base, 0, this.height/2, 1]);	
		this.controlPoints.push([-this.top, 0, -this.height/2, 1]);

		this.controlPoints.push([-this.base, this.base * 1.3, this.height/2, Math.cos(Math.PI/4)]);
		this.controlPoints.push([-this.top, this.top * 1.3, -this.height/2, Math.cos(Math.PI/4)]);

		
		this.controlPoints.push([this.base, this.base * 1.3, this.height/2, Math.cos(Math.PI/4)]);
		this.controlPoints.push([this.top, this.top * 1.3, -this.height/2, Math.cos(Math.PI/4)]);
		
		this.controlPoints.push([this.base, 0, this.height/2, 1]);
		this.controlPoints.push([this.top, 0, -this.height/2, 1]);

		this.initBuffers();
	};

	reorganizeControlPoints(){
		var innerArray = [];
		var previousJ = 0;

		for(var i = 0; i < this.npointsU; i++){

			innerArray = [];

			for(var j = 0; j < this.npointsV; j++){
				innerArray.push([this.controlPoints[previousJ][0], this.controlPoints[previousJ][1], this.controlPoints[previousJ][2], this.controlPoints[previousJ][3]]);
				previousJ++;
			}

			this.formattedControlPoints.push(innerArray);
		}
	}

	initBuffers()
	{	
        /*

        O cylindro terá grau 3 no U e grau 1 no V

        tem que se fazer um algoritmo para preencher formattedControlPoints desenhando um cylindro a 180º, uma metade de cylindro,
        em pontos de controlo, passar isso para este array para depois dar a nurbsSurface.
		 */
		 
		this.reorganizeControlPoints();

		console.log(this.controlPoints);
		console.log(this.formattedControlPoints);

		var nurbsSurface = new CGFnurbsSurface(3, 1, this.formattedControlPoints);
        this.nurbs = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface);
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