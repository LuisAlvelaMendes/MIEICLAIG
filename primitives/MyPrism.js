
 /**
 * MyPrism
 * @constructor
 */
class MyPrism extends CGFobject
{
	constructor(scene, slices, stacks) 
	{
		super(scene);

		this.slices = slices;
		this.stacks = stacks;
		
		this.initBuffers();
	};

	initBuffers() 
	{
		var sides = this.slices;
		
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		var n = 2*Math.PI/sides;
		//var z = 1/this.stacks;
		var z=1/this.stacks;
		var indice=0;
		
		for(var x = 0; x < this.stacks; x++){
					
		
				for(var i = 0; i < sides; i++){
			
					this.vertices.push(Math.cos(i * n), Math.sin(i* n), z*x);
					this.vertices.push(Math.cos(i * n), Math.sin(i* n), z*(x+1));
					this.vertices.push(Math.cos((i+1) * n), Math.sin((i+1)* n), z*x);
					this.vertices.push(Math.cos((i+1) * n), Math.sin((i+1)* n), z*(x+1));

					this.indices.push(indice, indice+2, indice+3);
					this.indices.push(indice+1, indice, indice+3);

					this.normals.push(Math.cos((i+0.5) * n), Math.sin((i+0.5) * n), 0);
					this.normals.push(Math.cos((i+0.5) * n), Math.sin((i+0.5) * n), 0);
					this.normals.push(Math.cos((i+0.5) * n), Math.sin((i+0.5) * n), 0);
					this.normals.push(Math.cos((i+0.5) * n), Math.sin((i+0.5) * n), 0);
	
					indice = indice + 4;
		}

	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
	};
};

