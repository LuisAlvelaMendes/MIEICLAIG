/**
/**
 * MyTorus
 * @constructor
 */
class MyTorus extends CGFobject
{
	constructor(scene, inner, outer, loops, slices) 
	{
		super(scene);
		this.scene = scene;
		this.inner = inner;
		this.loops = loops;
		this.slices = slices;
		this.initBuffers();    
	};
	
	initBuffers() 
	{	
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];
		this.originalCoords = this.texCoords.slice();
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	resetCoords(){
		this.texCoords = this.originalCoords.slice();
	}

	scaleTextureCoords(lengthS, lengthT){
		
		for (var i = 0; i < this.texCoords.length; i += 2) {
			this.texCoords[i] = this.texCoords[i] / lengthS;
			this.texCoords[i + 1] = this.texCoords[i+1] / lengthT;
		}
		
		this.updateTexCoordsGLBuffers();
	};

};
