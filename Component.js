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
	    this.scene = scene;
	};

	display() {		

		console.log(this.transformations)

		for(var i = 0; i < this.childrenComponents.length; i++){
			this.components[this.childrenComponents[i]].display();
			//console.log("DEBUG: COMPONENT ")
		}
		
	

		for(var i = 0; i < this.childrenPrimitives.length; i++){
			//this.scene.pushMatrix();
			//APPLY TRANSFORMATION MATRIX

			
			this.primitives[this.childrenPrimitives[i]].display();
			//console.log("DEBUG 3: " + this.childrenPrimitives[i]);
			//console.log(this.primitives[this.childrenPrimitives[i]] )
			//console.log("DEBUG: PRIMITIVE ")
		}

		//console.log("DEBUG: FIM ")

		return null;

	};

};
