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

	applyTransformation(){
		if (this.translateComponent != undefined && this.translateComponent.length != 0) {
			for(var i = 0; i < this.translateComponent.length; i++){
				this.scene.translate(this.translateComponent[i][0], this.translateComponent[i][1], this.translateComponent[i][2]);
			}
		}

		if (this.rotateComponent != undefined && this.rotateComponent.length != 0) {
			for(var i = 0; i < this.rotateComponent.length; i++){

				if(this.rotateComponent[i][0] == 'x'){
					console.log("ANGULO: "+ this.rotateComponent[i][1])
					this.scene.rotate(this.rotateComponent[i][1]*(Math.PI/180), 1, 0, 0);
				}

				if(this.rotateComponent[i][0] == 'y'){
					this.scene.rotate(this.rotateComponent[i][1]*(Math.PI/180), 0, 1, 0);
				}

				if(this.rotateComponent[i][0] == 'z'){
					this.scene.rotate(this.rotateComponent[i][1]*(Math.PI/180), 0, 0, 1);
				}
			}
		}

		if (this.scaleComponent != undefined && this.scaleComponent.length != 0) {
			for(var i = 0; i < this.scaleComponent.length; i++){
				this.scene.scale(this.scaleComponent[i][0], this.scaleComponent[i][1], this.scaleComponent[i][2]);
			}
		}

		return null;
	}

	applyTransformationReference(){

		//Transformation in X
		this.translateComponent = this.transformations[this.tranf].translate;
		//Transformation in Y
		this.rotateComponent = this.transformations[this.tranf].rotate;
		//Transformation in Z
		this.scaleComponent = this.transformations[this.tranf].scale;

		this.applyTransformation();

		return null;
	}

	applyTransformationNoReference(){

		this.translateComponent = this.tranf.translate;
		this.rotateComponent = this.tranf.rotate;
		this.scaleComponent = this.tranf.scale;

		this.applyTransformation();

		return null;
	}

	isString(x) {
		return Object.prototype.toString.call(x) === "[object String]"
	}

	display() {		

		for(var i = 0; i < this.childrenComponents.length; i++){
			if(this.components[this.childrenComponents[i]] != null){
				this.scene.scale(1,1,1);
				this.components[this.childrenComponents[i]].display();
			} 
			
		}

		for(var i = 0; i < this.childrenPrimitives.length; i++){
			//APPLY TRANSFORMATION MATRIX

			///If isn't a Reference 
			if(!(this.isString(this.tranf))){
				this.scene.pushMatrix();
				this.applyTransformationNoReference();
				this.primitives[this.childrenPrimitives[i]].display();
				this.scene.popMatrix();
			} else {
				this.scene.pushMatrix();
				this.applyTransformationReference();
				this.primitives[this.childrenPrimitives[i]].display();
				this.scene.popMatrix();
			}
		}

		return null;
	};

};
