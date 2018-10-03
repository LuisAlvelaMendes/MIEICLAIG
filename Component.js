/**
/**
 * MyQuad
 * @constructor
 */
class Component
{
	constructor(scene, id, tranf, mat, tex, chil) 
	{
		super(scene);

		this.id = id;
		this.tranf = tranf; 
	    this.mat = mat;
	    this.tex = tex; 
	    this.chil = chil;

		
	};

	display()
	{
		// loop para os filhos 
	}

};
