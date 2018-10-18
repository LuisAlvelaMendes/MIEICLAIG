/**
 * MyCylinderBody
 * 
 * VARIBALE CONSTRUCTION NOT WORKING YET
 * 
 * @constructor
 */
 function MyCylinderBody(scene, slices, stacks, base, top, height) {
 	CGFobject.call(this,scene);

	//if slices not define, set to 6
 	slices = typeof slices !== 'undefined' ? slices : 6;

 	//if stacks not define, set to 5
	 stacks = typeof stacks !== 'undefined' ? stacks : 5;
	 
	this.slices = slices;
	this.stacks = stacks;
	this.base = base;
	this.top = top;
	this.height = height;

 	this.initBuffers();
 };

 MyCylinderBody.prototype = Object.create(CGFobject.prototype);
 MyCylinderBody.prototype.constructor = MyCylinderBody;

 MyCylinderBody.prototype.initBuffers = function() {

	//Replaced with last year CGRA code to load textures into the cilinder - Luís Mendes

	this.vertices = [];
	this.normals = [];
	this.indices = [];
	this.texCoords = [];

	var r = this.top;
	var radiusInc =  (this.base-this.top)/this.stacks;

	var alpha = 2*Math.PI/this.slices;

	//stack increment
	var stackInc =  this.height/this.stacks;

	//texture coordinates
	var texIncS = 1/this.slices;
	var texIncT = 1/this.stacks;

	for (var i = 0; i <=this.stacks; i++){
		for (var j = 0; j <= this.slices; j++){
			this.vertices.push(r * Math.cos(j*alpha), r * Math.sin(j*alpha), i*stackInc);
			this.normals.push(r * Math.cos(j*alpha), r * Math.sin(j*alpha), 0);
			this.texCoords.push(j*texIncS, i*texIncT);

			if (i < this.stacks) {
				this.indices.push((i*this.slices)+j+i, (i*this.slices)+this.slices+j+1+i, i*(this.slices)+this.slices+j+i);
				this.indices.push((i*this.slices)+j+i, (i*this.slices)+j+1+i, i*(this.slices)+this.slices+j+1+i);
			}
		}
		
		r += radiusInc;
	 }

	this.originalCoords = this.texCoords.slice();

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
 };
 
 MyCylinderBody.prototype.resetCoords = function (){
	this.texCoords = this.originalCoords.slice();
}

MyCylinderBody.prototype.scaleTextureCoords = function (lengthS, lengthT){
	
	for (var i = 0; i < this.texCoords.length; i += 2) {
		this.texCoords[i] = this.texCoords[i] / lengthS;
		this.texCoords[i + 1] = this.texCoords[i+1] / lengthT;
	}
	
	this.updateTexCoordsGLBuffers();
};
