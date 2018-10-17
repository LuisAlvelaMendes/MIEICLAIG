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
		this.materialCurrentIndex = 0;
	};

	incrementIndex(){
		if(this.materialCurrentIndex < (this.mat.length)-1){
			this.materialCurrentIndex++;
		}

		else {
			this.materialCurrentIndex = 0;
		}
	}

	applyTransformationReference(){
		var matrix = this.transformations[this.tranf];

		this.scene.multMatrix(matrix);

		return null;
	};

	applyTransformationNoReference(){

		this.scene.multMatrix(this.tranf);
		
		return null;
	};

	applyMaterial(parentMaterialId){
		//vai ter que se ler o ID, por causa de id="inherit" herdar do paí, mais aquele gimmick de trocar de material pressionando M.
		
		if(this.mat[0] == "inherit"){
			var material = this.materials[parentMaterialId];
		}

		else{
			var material = this.materials[this.mat[this.materialCurrentIndex]];
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
			var texture = this.textures[parentTextureId];
		}

		if(this.tex[0] != "inherit" && this.tex[0] != "none"){
			var texture = this.textures[this.tex[0]];
		}

		this.ComponentAppearance.setTexture(texture);
		this.ComponentAppearance.setTextureWrap('REPEAT', 'REPEAT');
		this.ComponentAppearance.apply();
	}

	isString(x) {
		return Object.prototype.toString.call(x) === "[object String]"
	};

	display(parentMaterialId, parentTextureId) {		

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
			this.applyTexture(parentTextureId);
			var texCoordsChanged = false;

			//APPLY TRANSFORMATION MATRIX

			if(!(this.isString(this.tranf))){
				this.scene.pushMatrix();
				this.primitives[this.childrenPrimitives[i]].scaleTextureCoords(this.tex[1], this.tex[2]);
				texCoordsChanged = true;
				this.applyTransformationNoReference();
				this.primitives[this.childrenPrimitives[i]].display();
				this.scene.popMatrix();
			} else {
				this.scene.pushMatrix();
				this.primitives[this.childrenPrimitives[i]].scaleTextureCoords(this.tex[1], this.tex[2]);
				texCoordsChanged = true;
				this.applyTransformationReference();
				this.primitives[this.childrenPrimitives[i]].display();
				this.scene.popMatrix();
			}

			if(texCoordsChanged){
				this.primitives[this.childrenPrimitives[i]].resetCoords();
				this.primitives[this.childrenPrimitives[i]].updateTexCoordsGLBuffers();
			}

		}

		return null;
	};

};
