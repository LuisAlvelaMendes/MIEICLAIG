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
        this.npartsU = slices/2;
        this.npartsV = stacks/2;
		this.initBuffers();
	};

	initBuffers()
	{	
        /*

        O cylindro terá grau 4 no U e grau 3 no V

        tem que se fazer um algoritmo para preencher formattedControlPoints desenhando um cylindro a 180º, uma metade de cylindro,
        em pontos de controlo, passar isso para este array para depois dar a nurbsSurface.

		var nurbsSurface = new CGFnurbsSurface(3, 2, this.formattedControlPoints);
        this.nurbs = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface);
        */
	};

	display()
	{
		//this.nurbs.display();
	};

	// Don't know if we will need to apply textures to NURBS / if it is applied in the same way.

	scaleTextureCoords(tex1, tex2)
	{
	
	};

	resetCoords()
	{

	};

};