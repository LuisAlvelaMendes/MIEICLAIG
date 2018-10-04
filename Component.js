/**
/**
 * Component
 * @constructor
 */
class Component
{
	constructor(scene, id, tranf, mat, tex, childrenPrimitives, childrenComponents, primitives) 
	{
		this.id = id;
		this.tranf = tranf; 
	    this.mat = mat;
	    this.tex = tex; 
	    this.childrenPrimitives = childrenPrimitives;
	    this.childrenComponents = childrenComponents;
	    this.primitives = primitives;
	};

	display() {
		
		for(var i = 0; i < this.childrenComponents.length; i++){
			//this.components[this.childrenComponents[i]].display();
		}

		for(var i = 0; i < this.childrenPrimitives.length; i++){
			//this.scene.pushMatrix();
			//APPLY TRANSFORMATION MATRIX
			
			this.primitives[this.childrenPrimitives[i]].display();
			//console.log("DEBUG 3: " + this.childrenPrimitives[i]);
			//console.log(this.primitives[this.childrenPrimitives[i]] )
		}

	};

};
