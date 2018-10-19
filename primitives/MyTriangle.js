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

		this.minS = 0;
		this.maxT = 1;
		this.maxS = 1;
		this.minT = 0;

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
		//c é  a distância: P2-P3
		//a é a distância: P3-P1
		//b  é a distâcia: P1-P2

    	var c = Math.sqrt(Math.pow(this.p2[0] - this.p3[0], 2) + Math.pow(this.p2[1] - this.p3[1], 2) + Math.pow(this.p2[2] - this.p3[2], 2));
    	var a = Math.sqrt(Math.pow(this.p1[0] - this.p3[0], 2) + Math.pow(this.p1[1] - this.p3[1], 2) + Math.pow(this.p1[2] - this.p3[2], 2));
		var b = Math.sqrt(Math.pow(this.p2[0] - this.p1[0], 2) + Math.pow(this.p2[1] - this.p1[1], 2) + Math.pow(this.p2[2] - this.p1[2], 2));

		//considerar-se-á que v é a distância desde a base (c) até ao ponto mais alto do triângulo

		//tirado do documento fornecido do moodle
		var angBeta = Math.acos((Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2)) / (2 * a * c));

		var v = a*Math.sin(angBeta);

		this.texCoords = [
		0, v/lengthT,
		c/lengthS, v/lengthT,
		(c-a*Math.cos(angBeta))/lengthS, (v-a*Math.sin(angBeta))/lengthT
		];
		
		this.updateTexCoordsGLBuffers();
	};

};
