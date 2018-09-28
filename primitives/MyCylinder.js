/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, slices, stacks) {
 	CGFobject.call(this,scene);

	//if slices not define, set to 6
 	slices = typeof slices !== 'undefined' ? slices : 6;

 	//if stacks not define, set to 5
 	stacks = typeof stacks !== 'undefined' ? stacks : 5;
	
	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();
 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.initBuffers = function() {
 	var sides = this.slices;
 	var stacks = this.stacks;
	var n = 2*Math.PI / sides;
	var z=1/this.stacks;
	this.vertices = [];
	this.normals = [];
	this.indices = [];
	var indice=0;
	


	for(var x = 0; x < this.stacks; x++){
					
		
				for(var i = 0; i < sides; i++){
			
					this.vertices.push(Math.cos(i * n), Math.sin(i* n), z*x);
					this.vertices.push(Math.cos(i * n), Math.sin(i* n), z*(x+1));
					this.vertices.push(Math.cos((i+1) * n), Math.sin((i+1)* n), z*x);
					this.vertices.push(Math.cos((i+1) * n), Math.sin((i+1)* n), z*(x+1));

					this.indices.push(indice, indice+2, indice+3);
					this.indices.push(indice+1, indice, indice+3);

					this.normals.push(Math.cos((i) * n), Math.sin((i) * n), 0);
					this.normals.push(Math.cos((i) * n), Math.sin((i) * n), 0);
					this.normals.push(Math.cos((i+1) * n), Math.sin((i+1) * n), 0);
					this.normals.push(Math.cos((i+1) * n), Math.sin((i+1) * n), 0);
	
					indice = indice + 4;
		}

	}
	
	
 	this.primitiveType = this.scene.gl.TRIANGLES;

 	this.initGLBuffers();
 };
