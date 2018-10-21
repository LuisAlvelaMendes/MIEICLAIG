/**
/**
 * MyTorus
 * @constructor
 */
class MyTorus extends CGFobject
{
	constructor(scene, outer, inner, loops, slices) 
	{
		super(scene);
		this.scene = scene;
		this.inner = inner;
		this.loops = loops;
		this.outer = outer;
		this.slices = slices;
		this.initBuffers();    
	};
	
	initBuffers() 
	{	
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		for (var j = 0; j <= this.loops; j ++) {
			for (var i = 0; i <= this.slices; i ++) {
				var delta_long = i / this.slices * Math.PI * 2;
				var delta_lat = j / this.loops * Math.PI * 2;

				var vertexVector = vec3.create();

				vertexVector = [
					( this.inner + this.outer * Math.cos( delta_lat ) ) * Math.cos( delta_long ), 
					( this.inner + this.outer * Math.cos( delta_lat ) ) * Math.sin( delta_long ), 
					this.outer * Math.sin( delta_lat )
				];
	
				this.vertices.push(vertexVector[0], vertexVector[1], vertexVector[2]);

				var centerVector = vec3.create();

				centerVector = [
					this.inner * Math.cos( delta_long ),
					this.inner * Math.sin( delta_long ),
					0
				];

				var N = vec3.create() //n - normal ao torus

				vec3.cross(N, vertexVector, centerVector);
		
				vec3.normalize(N, N);
	
				this.normals.push(N[0], N[1], N[2]);
	
				// textures
	
				this.texCoords.push( i / this.slices );
				this.texCoords.push( j / this.loops );
			}
		}
	
		// generate indices
	
		for ( j = 1; j <= this.loops; j ++ ) {
			for ( i = 1; i <= this.slices; i ++ ) {
	
				// indices
	
				var a = ( this.slices + 1 ) * j + i - 1;
				var b = ( this.slices + 1 ) * ( j - 1 ) + i - 1;
				var c = ( this.slices + 1 ) * ( j - 1 ) + i;
				var d = ( this.slices + 1 ) * j + i;
	
				// faces
	
				this.indices.push( a, b, d );
				this.indices.push( b, c, d );
			}
		}

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
