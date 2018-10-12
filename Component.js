var DEGREE_TO_RAD = (Math.PI / 180);

/**
/**
 * Component
 * @constructor
 */
class Component
{
	constructor(scene, id, tranf, mat, tex, childrenPrimitives, childrenComponents, primitives, components, transformations, materials, textures) 
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
		this.materials = materials;
		this.textures = textures;
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
					this.scene.rotate(this.rotateComponent[i][1]*DEGREE_TO_RAD, 1, 0, 0);
				}

				if(this.rotateComponent[i][0] == 'y'){
					this.scene.rotate(this.rotateComponent[i][1]*DEGREE_TO_RAD, 0, 1, 0);
				}

				if(this.rotateComponent[i][0] == 'z'){
					this.scene.rotate(this.rotateComponent[i][1]*DEGREE_TO_RAD, 0, 0, 1);
				}
			}
		}

		if (this.scaleComponent != undefined && this.scaleComponent.length != 0) {
			for(var i = 0; i < this.scaleComponent.length; i++){
				this.scene.scale(this.scaleComponent[i][0], this.scaleComponent[i][1], this.scaleComponent[i][2]);
			}
		}

		return null;
	};

	applyTransformationReference(){

		//Translation
		this.translateComponent = this.transformations[this.tranf].translate;
		//Rotation
		this.rotateComponent = this.transformations[this.tranf].rotate;
		//Scale
		this.scaleComponent = this.transformations[this.tranf].scale;

		this.applyTransformation();

		return null;
	};

	applyTransformationNoReference(){

		this.translateComponent = this.tranf.translate;
		this.rotateComponent = this.tranf.rotate;
		this.scaleComponent = this.tranf.scale;

		this.applyTransformation();

		return null;
	};

	applyMaterial(parentMaterialId){
		//vai ter que se ler o ID, por causa de id="inherit" herdar do paí, mais aquele gimmick de trocar de material pressionando M.
		
		if(this.mat[0] == "inherit"){
			var material = this.materials[parentMaterialId];
		}

		else{
			var material = this.materials[this.mat[0]];
		}

		this.ComponentAppearance = new CGFappearance(this.scene);
		this.ComponentAppearance.setShininess(material[0]);
		this.ComponentAppearance.setEmission(material[1]["r"], material[1]["g"], material[1]["b"], material[1]["a"]);
		this.ComponentAppearance.setAmbient(material[2]["r"], material[2]["g"], material[2]["b"], material[2]["a"]);
		this.ComponentAppearance.setDiffuse(material[3]["r"], material[3]["g"], material[3]["b"], material[3]["a"]);
		this.ComponentAppearance.setSpecular(material[4]["r"], material[4]["g"], material[4]["b"], material[4]["a"]);
	}

	applyTexture(parentTextureId, primitiveId){

		if(this.tex[0] == "none" || parentTextureId == "none"){
			var texture = null;
		}

		if(this.tex[0] == "inherit"){
			var texture = this.textures[parentTextureId];
		}

		if(this.tex[0] != "inherit" && this.tex[0] != "none"){
			var texture = this.textures[this.tex[0]];
		}

		this.ComponentAppearance.setTexture(texture);
		this.ComponentAppearance.apply();
	}

	isString(x) {
		return Object.prototype.toString.call(x) === "[object String]"
	};

	display(parentMaterialId, parentTextureId) {		

		var texCoordsChanged = false;
		var originalCoords = null;

		for(var i = 0; i < this.childrenComponents.length; i++){
			if(this.components[this.childrenComponents[i]] != null){
				// TODO :: GENERICO - pareceido com as primitivas etc...

				this.scene.pushMatrix();
				
				if(!(this.isString(this.tranf))){
					this.applyTransformationNoReference();
				} else {
					this.applyTransformationReference();
				}

				if(this.mat[0] == "inherit" && this.tex[0] != "inherit"){
					this.components[this.childrenComponents[i]].display(parentMaterialId, this.tex[0]);
				}

				if(this.mat[0] == "inherit" && this.tex[0] == "inherit"){
					this.components[this.childrenComponents[i]].display(parentMaterialId, parentTextureId);
				}

				if(this.mat[0] != "inherit" && this.tex[0] == "inherit"){
					this.components[this.childrenComponents[i]].display(this.mat[0], parentTextureId);
				}

				if(this.mat[0] != "inherit" && this.tex[0] != "inherit"){
					this.components[this.childrenComponents[i]].display(this.mat[0], this.tex[0]);
				}

				this.scene.popMatrix();
			} 
		}

		for(var i = 0; i < this.childrenPrimitives.length; i++){
			
			// Apply Materials
			this.applyMaterial(parentMaterialId);
			this.applyTexture(parentTextureId,this.childrenPrimitives[i]);

			//APPLY TRANSFORMATION MATRIX

			if(!(this.isString(this.tranf))){
				this.scene.pushMatrix();
				originalCoords = this.primitives[this.childrenPrimitives[i]].texCoords;
				this.primitives[this.childrenPrimitives[i]].scaleTextureCoords(this.tex[1], this.tex[2]);
				texCoordsChanged = true;
				this.applyTransformationNoReference();
				this.primitives[this.childrenPrimitives[i]].display();
				this.scene.popMatrix();
			} else {
				this.scene.pushMatrix();
				originalCoords = this.primitives[this.childrenPrimitives[i]].texCoords;
				this.primitives[this.childrenPrimitives[i]].scaleTextureCoords(this.tex[1], this.tex[2]);
				texCoordsChanged = true;
				this.applyTransformationReference();
				this.primitives[this.childrenPrimitives[i]].display();
				this.scene.popMatrix();
			}

			if(texCoordsChanged){
				this.primitives[this.childrenPrimitives[i]].texCoords = originalCoords;
				this.primitives[this.childrenPrimitives[i]].updateTexCoordsGLBuffers();
			}
		}

		return null;
	};

};
