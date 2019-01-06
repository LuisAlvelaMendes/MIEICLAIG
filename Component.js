var DEGREE_TO_RAD = (Math.PI / 180);

/**
/**
 * Component
 * @constructor
 */
class Component
{
	constructor(scene, id, tranf, mat, tex, anim, childrenPrimitives, childrenComponents) 
	{
		this.id = id;
		this.tranf = tranf; 
	    this.mat = mat;
	    this.tex = tex; 
	    this.childrenPrimitives = childrenPrimitives;
	    this.childrenComponents = childrenComponents;
	    this.all = 0;
		this.scene = scene;
		this.materialCurrentIndex = 0;
		this.animationsID = anim;
		this.currentAnimationIndex = 0;
		this.diff = true;
		this.menuFlag = true;
	};

	/**
	 * Used to update component animations.
	 */
	update(deltaTime){
		this.scene.graph.animations[this.animationsID[this.currentAnimationIndex]].update(deltaTime);
	}
	 
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

	incrementAnimation(){
		this.currentAnimationIndex++;
	}

	decrementAnimation(){
		this.currentAnimationIndex--;
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

		var foundInherit = false;

		// If at any given point in the component's material declaration "inherit" is found, it will automatically overwrite all other materials and use the inherit.
		
		for(var i = 0; i < this.mat.length; i++){
			if(this.mat[i] == "inherit"){
				foundInherit = true;
				var material = this.scene.graph.materials[parentMaterialId];
			}
		}

		if(foundInherit == false) {
			var material = this.scene.graph.materials[this.mat[this.materialCurrentIndex]];
		}

		this.ComponentAppearance = material;
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

	activateDif(estilo){
		if(estilo == "estiloB" && this.diff == false){
			this.scene.graph.components["diffImage"].diff = true;
		} else if(estilo == "estiloB" && this.diff == true){
			this.scene.graph.components["diffImage"].diff=false;
		}
	}

	changeSelectedColor(){
		this.incrementIndex();
	}

	startGame(tipo,dif){

		if(tipo == "" && p1_color == "" && p2_color == ""){
			alert("Not available game");
		} else if(tipo == "estiloA"){
			this.scene.game.start("Human vs Human" , "null");
		} else if(tipo == "estiloB"){
			this.scene.game.start("Human vs Computer" , dif);
		} else if(tipo == "estiloC"){
			this.scene.game.start("Computer vs Computer" , "null");
		}

		this.scene.menu = false;
	}

	applyAnimation(){
		if(this.animationsID[this.currentAnimationIndex] != undefined){
			this.scene.graph.animations[this.animationsID[this.currentAnimationIndex]].apply();
		}
	}

	isString(x) {
		return Object.prototype.toString.call(x) === "[object String]"
	};

	display(board, parentMaterialId, parentTextureId) {		

		for(var i = 0; i < this.childrenComponents.length; i++){
			if(this.scene.graph.components[this.childrenComponents[i]] != null){

				this.scene.pushMatrix();
				
				if(!(this.isString(this.tranf))){
					this.applyTransformationNoReference();
					this.applyAnimation();
				} else {
					this.applyTransformationReference();
					this.applyAnimation();
				}

				if((this.childrenComponents[i] == "estiloA" || this.childrenComponents[i] == "estiloB" || this.childrenComponents[i] == "estiloC" 
					|| this.childrenComponents[i] == "difB" || this.childrenComponents[i] == "difC" || this.childrenComponents[i] == "go" ||
					this.childrenComponents[i] == "menu" || this.childrenComponents[i] == "estiloAText" || this.childrenComponents[i] == "diffImage")
					 && this.scene.menu == true){

					if(this.mat[0] == "inherit" && this.tex[0] != "inherit"){
						this.scene.graph.components[this.childrenComponents[i]].display(board, parentMaterialId, this.tex[0]);
					}

					if(this.mat[0] == "inherit" && this.tex[0] == "inherit"){
						this.scene.graph.components[this.childrenComponents[i]].display(board, parentMaterialId, parentTextureId);
					}

					if(this.mat[0] != "inherit" && this.tex[0] == "inherit"){
						this.scene.graph.components[this.childrenComponents[i]].display(board, this.mat[0], parentTextureId);
					}

					if(this.mat[0] != "inherit" && this.tex[0] != "inherit"){
						this.scene.graph.components[this.childrenComponents[i]].display(board, this.mat[0], this.tex[0]);
					}

				} else if(this.childrenComponents[i] != "estiloA" && this.childrenComponents[i] != "estiloB" && this.childrenComponents[i] != "estiloC" 
					&& this.childrenComponents[i] != "difB" && this.childrenComponents[i] != "difC" && this.childrenComponents[i] != "go" &&
					this.childrenComponents[i] != "menu" && this.childrenComponents[i] != "estiloAText" && this.childrenComponents[i] != "diffImage"){

					if(this.mat[0] == "inherit" && this.tex[0] != "inherit"){
						this.scene.graph.components[this.childrenComponents[i]].display(board, parentMaterialId, this.tex[0]);
					}

					if(this.mat[0] == "inherit" && this.tex[0] == "inherit"){
						this.scene.graph.components[this.childrenComponents[i]].display(board, parentMaterialId, parentTextureId);
					}

					if(this.mat[0] != "inherit" && this.tex[0] == "inherit"){
						this.scene.graph.components[this.childrenComponents[i]].display(board, this.mat[0], parentTextureId);
					}

					if(this.mat[0] != "inherit" && this.tex[0] != "inherit"){
						this.scene.graph.components[this.childrenComponents[i]].display(board, this.mat[0], this.tex[0]);
					} 
				}
				
				if(this.childrenComponents[i] == "estiloA"){
					this.scene.registerForPick(101, this.childrenComponents[i]);
				}
				else if(this.childrenComponents[i] == "estiloB"){
					this.scene.registerForPick(102, this.childrenComponents[i]);
				} else if(this.childrenComponents[i] == "estiloC"){
					this.scene.registerForPick(103, this.childrenComponents[i]);
				}

				else if(this.childrenComponents[i] == "difB"){
					this.scene.registerForPick(104, this.childrenComponents[i]);
				} else if(this.childrenComponents[i] == "difC"){
					this.scene.registerForPick(105, this.childrenComponents[i]);
				} else if(this.childrenComponents[i] == "go"){
					this.scene.registerForPick(106, this.childrenComponents[i]);
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

				// Applying animations
				this.applyAnimation();

				if(this.childrenPrimitives[i] == "myCells"){
					this.scene.graph.primitives[this.childrenPrimitives[i]].updatePieces(board);
					this.scene.graph.primitives[this.childrenPrimitives[i]].display();
				} else {

					this.scene.graph.primitives[this.childrenPrimitives[i]].display();
				}

			//if para eslio A 
			// antes de displai do menu fazer regiset picking , na funcoa do loginpickin no xmlscene , quando econtrar um ID pickable do meu menu
			// fazer change texture (registerForPick)


				this.scene.popMatrix();
			} else {
				this.scene.pushMatrix();

				if(this.tex[1] != null && this.tex[2] != null){
					this.scene.graph.primitives[this.childrenPrimitives[i]].scaleTextureCoords(this.tex[1], this.tex[2]);
					texCoordsChanged = true;
				}
				
				this.applyTransformationReference();

				this.applyAnimation();

				if(this.childrenPrimitives[i] == "myCells"){
					this.scene.graph.primitives[this.childrenPrimitives[i]].updatePieces(board);
					this.scene.graph.primitives[this.childrenPrimitives[i]].display();
				} else {
					this.scene.graph.primitives[this.childrenPrimitives[i]].display();
				}

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
