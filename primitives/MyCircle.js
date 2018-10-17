/**
 * MyCircle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyCircle(scene,slices, radius, minS, maxS, minT, maxT) {
	CGFobject.call(this,scene);
	minS = typeof minS !== 'undefined' ? minS : 0.0;
	maxS = typeof maxS !== 'undefined' ? maxS : 1.0;
	minT = typeof minT !== 'undefined' ? minT : 0.0;
	maxT = typeof maxT !== 'undefined' ? maxT : 1.0;
	this.slices = slices;
	this.minS = minS;
	this.maxS = maxS;
	this.minT = minT;
	this.maxT = maxT;
	
	if(radius == 0){

	}
	
	this.radius = radius || 1;

	this.initBuffers();
};

MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor=MyCircle;

MyCircle.prototype.initBuffers = function () {
	
	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	
	var angle = 2*Math.PI/this.slices;
	var r = this.radius;

	console.log("RADIUS HERE: " + this.radius);

	var index = 1;
	
	this.vertices.push(
		0,
		0,
		0
	);
	this.normals.push(
		0,
		0,
		1
	);
	this.texCoords.push(
				.5,
				.5
		);
 
	//top
	for(var j= 0; j < this.slices; j++){
		this.vertices.push(
			r * Math.cos((j)*angle),
			r * Math.sin((j)*angle),
			0
			);
		this.vertices.push(
			r * Math.cos((j+1)*angle),
			r * Math.sin((j+1)*angle),
			0
			);
		this.texCoords.push(
				-.5 *  Math.cos((j)*angle) +.5,
				.5 * Math.sin((j)*angle)+.5
		);
		this.texCoords.push(
				-.5 * Math.cos((j+1)*angle) +.5,
				.5 * Math.sin((j+1)*angle)+.5
		);
		this.indices.push(
		1, index, index+1
		);
		for(var rep = 0; rep < 2 ; rep++){
			this.normals.push(0,0,1);
		}
		index+=2;	
	}
	this.indices.push(index-1,0,1);

	this.originalCoords = this.texCoords.slice();
	
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
};

MyCircle.prototype.resetCoords = function (){
	this.texCoords = this.originalCoords.slice();
};

MyCircle.prototype.scaleTextureCoords = function(lengthS, lengthT){
	
	for (var i = 0; i < this.texCoords.length; i += 2) {
		this.texCoords[i] = this.texCoords[i] / lengthS;
		this.texCoords[i + 1] = this.texCoords[i+1] / lengthT;
	}
	
	this.updateTexCoordsGLBuffers();
};