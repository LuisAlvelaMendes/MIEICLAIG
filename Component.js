/**
/**
 * Component
 * @constructor
 */
class Component
{
	constructor(scene, id, tranf, mat, tex, childrenPrimitives, childrenComponents, primitives, components, transformations) 
	{
		this.id = id;
		this.tranf = tranf; 
	    this.mat = mat;
	    this.tex = tex; 
	    this.childrenPrimitives = childrenPrimitives;
	    this.childrenComponents = childrenComponents;
	    this.primitives = primitives;
	    this.components = components;
	    this.transformations = transformations;

	};

	display() {
		
		

		for(var i = 0; i < this.childrenComponents.length; i++){
			this.components[this.childrenComponents[i]].display();
			//console.log("DEBUG 2: ")
		}

		for(var i = 0; i < this.childrenPrimitives.length; i++){
			//this.scene.pushMatrix();
			//APPLY TRANSFORMATION MATRIX
			//console.log(this.transformations)

			this.primitives[this.childrenPrimitives[i]].display();
			//console.log("DEBUG 3: " + this.childrenPrimitives[i]);
			//console.log(this.primitives[this.childrenPrimitives[i]] )
		}

	};

};
