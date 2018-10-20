var DEGREE_TO_RAD = (Math.PI / 180);

/**
/**
 * Component
 * @constructor
 */
class Component
{
	constructor(scene, id, tranf, mat, tex, childrenPrimitives, childrenComponents) 
	{
		this.id = id;
		this.tranf = tranf; 
	    this.mat = mat;
	    this.tex = tex; 
	    this.childrenPrimitives = childrenPrimitives;
	    this.childrenComponents = childrenComponents;
		this.scene = scene;
		this.materialCurrentIndex = 0;
	};

	/**
	 * Used to swap current material.
	 */
	incrementIndex(){
		if(this.materialCurrentIndex < (this.mat.length)-1){
			this.materialCurrentIndex++;
		}

		else {
			this.materialCurrentIndex = 0;
		}
	}


	/**
	 * When the transformation parameter passed is a reference to an existing transformation.
	 */
	applyTransformationReference(){
		var matrix = this.scene.graph.transformations[this.tranf];

		this.scene.multMatrix(matrix);

		return null;
	};

	/**
	 * When the transformation parameter passed is a matrix with the transformations ready to apply.
	 */
	applyTransformationNoReference(){
		this.scene.multMatrix(this.tranf);
		
		return null;
	};

	applyMaterial(parentMaterialId){
		
		if(this.mat[0] == "inherit"){
			var material = this.scene.graph.materials[parentMaterialId];
		}

		else{
			var material = this.scene.graph.materials[this.mat[this.materialCurrentIndex]];
		}

		this.ComponentAppearance = new CGFappearance(this.scene);
		this.ComponentAppearance.setShininess(material[0]);
		this.ComponentAppearance.setEmission(material[1]["r"], material[1]["g"], material[1]["b"], material[1]["a"]);
		this.ComponentAppearance.setAmbient(material[2]["r"], material[2]["g"], material[2]["b"], material[2]["a"]);
		this.ComponentAppearance.setDiffuse(material[3]["r"], material[3]["g"], material[3]["b"], material[3]["a"]);
		this.ComponentAppearance.setSpecular(material[4]["r"], material[4]["g"], material[4]["b"], material[4]["a"]);
	}

	applyTexture(parentTextureId){

		if(this.tex[0] == "none" || parentTextureId == "none"){
			var texture = null;
		}

		if(this.tex[0] == "inherit"){
			var texture = this.scene.graph.textures[parentTextureId];
		}

		if(this.tex[0] != "inherit" && this.tex[0] != "none"){
			var texture = this.scene.graph.textures[this.tex[0]];
		}

		this.ComponentAppearance.setTexture(texture);
		this.ComponentAppearance.setTextureWrap('REPEAT', 'REPEAT');
		this.ComponentAppearance.apply();
	}

	isString(x) {
		return Object.prototype.toString.call(x) === "[object String]"
	};

	display(parentMaterialId, parentTextureId) {		

		// Component Children
		for(var i = 0; i < this.childrenComponents.length; i++){
			if(this.scene.graph.components[this.childrenComponents[i]] != null){

				this.scene.pushMatrix();
				
				if(!(this.isString(this.tranf))){
					this.applyTransformationNoReference();
				} else {
					this.applyTransformationReference();
				}

				if(this.mat[0] == "inherit" && this.tex[0] != "inherit"){
					this.scene.graph.components[this.childrenComponents[i]].display(parentMaterialId, this.tex[0]);
				}

				if(this.mat[0] == "inherit" && this.tex[0] == "inherit"){
					this.scene.graph.components[this.childrenComponents[i]].display(parentMaterialId, parentTextureId);
				}

				if(this.mat[0] != "inherit" && this.tex[0] == "inherit"){
					this.scene.graph.components[this.childrenComponents[i]].display(this.mat[0], parentTextureId);
				}

				if(this.mat[0] != "inherit" && this.tex[0] != "inherit"){
					this.scene.graph.components[this.childrenComponents[i]].display(this.mat[0], this.tex[0]);
				}

				this.scene.popMatrix();
			} 
		}

		// Primitive Children
		for(var i = 0; i < this.childrenPrimitives.length; i++){
			
			// Apply Materials and textures
			this.applyMaterial(parentMaterialId);
			this.applyTexture(parentTextureId);
			var texCoordsChanged = false;

			if(!(this.isString(this.tranf))){
				this.scene.pushMatrix();
				
				// Scaling textures with lengthS and lengthT
				if(this.tex[1] != null && this.tex[2] != null){
					this.scene.graph.primitives[this.childrenPrimitives[i]].scaleTextureCoords(this.tex[1], this.tex[2]);
					texCoordsChanged = true;
				}

				// Applying transformations
				this.applyTransformationNoReference();
				this.scene.graph.primitives[this.childrenPrimitives[i]].display();
				this.scene.popMatrix();
			} else {
				this.scene.pushMatrix();

				if(this.tex[1] != null && this.tex[2] != null){
					this.scene.graph.primitives[this.childrenPrimitives[i]].scaleTextureCoords(this.tex[1], this.tex[2]);
					texCoordsChanged = true;
				}
				
				this.applyTransformationReference();
				this.scene.graph.primitives[this.childrenPrimitives[i]].display();
				this.scene.popMatrix();
			}

			if(texCoordsChanged){
				this.scene.graph.primitives[this.childrenPrimitives[i]].resetCoords();
				this.scene.graph.primitives[this.childrenPrimitives[i]].updateTexCoordsGLBuffers();
			}

		}

		return null;
	};

};
