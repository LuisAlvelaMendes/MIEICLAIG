/**
/**
 * MyTriangle
 * 
 * NEEDS BETTER TEXTURES!!!!!!!!
 * 
 * @constructor
 */
class MyTriangle extends CGFobject
{
	constructor(scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3) 
	{
		super(scene);
		this.id = id;
		this.p1 = [x1, y1, z1];
		this.p2 = [x2, y2, z2];
		this.p3 = [x3, y3, z3];

		this.initBuffers();    
	};

	initBuffers() 
	{	
		
		this.vertices = [
			this.p1[0], this.p1[1], this.p1[2],
			this.p2[0], this.p2[1], this.p2[2],
			this.p3[0], this.p3[1], this.p3[2]
		];

		this.indices = [0, 1, 2];
		
		this.primitiveType = this.scene.gl.TRIANGLES;

		var p21 = vec3.create();  //vetor de p2 a p1 (P2 - P1)

		var p21 = [
			this.p2[0]-this.p1[0],
			this.p2[1]-this.p1[1],
			this.p2[2]-this.p1[2]
		];
	
		var p32 = vec3.create(); //vetor de p3 a p2 (P3-P2)
		
		var p32 =[
			this.p3[0]-this.p2[0],
			this.p3[1]-this.p2[1],
			this.p3[2]-this.p2[2]
		];
	
		var N = vec3.create() //n - normal ao triangulo

		vec3.cross(N, p21, p32);

		vec3.normalize(N, N);

		this.normals = [
			N[0], N[1], N[2],
			N[0], N[1], N[2],
			N[0], N[1], N[2]
		];

		this.texCoords = [
            this.minS,this.maxT,
            this.maxS,this.maxT,
            this.minS,this.minT,
            this.maxS,this.minT
		];
		
		this.originalCoords = this.texCoords.slice();

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
