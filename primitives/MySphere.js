/**
 * MySphere
 * @constructor
 */
class MySphere extends CGFobject
{
    constructor(scene, id, slices, stacks, radius, minS, maxS, minT, maxT){
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.radius = radius;
        this.id = id;

        this.minS = minS || 0.0;
        this.minT = minT || 0.0;
        this.maxS = maxS || 1.0;
        this.maxT = maxT || 1.0;

        this.initBuffers();
    }

    initBuffers()
    {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
    
        // variables
        var delta_long = 2*Math.PI/this.slices;
        var delta_lat = Math.PI/this.stacks;
        var r = this.radius;
        var index = 0;
    
        for(var i = 0; i <= this.stacks; i++){
            for(var j= 0; j <= this.slices; j++){
                
                var teta = Math.PI-i*delta_lat;
                
                this.vertices.push(
                    r * Math.sin(teta) * Math.cos(j*delta_long),
                    r * Math.sin(teta) * Math.sin(j*delta_long),
                    r * Math.cos(teta)
                );
                
                this.normals.push(
                    Math.sin(teta) * Math.cos(j*delta_long),
                    Math.sin(teta) * Math.sin(j*delta_long),
                    Math.cos(teta)
                );
                
                this.texCoords.push(
                    j/this.slices,
                    1 - i/this.stacks
                );
                
                index++;
            }
        }

        for(var i = 0; i < this.stacks; i++){

            for(var j = 0; j < this.slices; j++){
    
                this.indices.push(
                    i*(this.slices + 1) +j,
                    i*(this.slices + 1) +(j+1),
                    (i+1)*(this.slices + 1) +(j+1)
                );

                this.indices.push(
                    (i+1)*(this.slices + 1) +(j+1),
                    (i+1)*(this.slices + 1) +j,
                    i*(this.slices + 1) +j
                );

            }
        }
    
        if(this.bottom){
            var lowcenter = index++;
            this.vertices.push(0,0,0);
            this.normals.push(0,0,-1);
            var storedindex = index;
        
            //bottom
            for(var j= 0; j < this.slices-1; j++){

                this.vertices.push(
                    r * Math.cos((j)*delta_long),
                    r * Math.sin((j)*delta_long),
                    0
                );
                
                this.vertices.push(
                    r * Math.cos((j+1)*delta_long),
                    r * Math.sin((j+1)*delta_long),
                    0
                );
                
                this.indices.push(lowcenter, index+1, index);

                for(var rep = 0; rep < 2 ; rep++){
                    this.normals.push(0,0,-1);
                }
        
                index+=2;
            }
            
            this.indices.push(storedindex,index-1,lowcenter);
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
