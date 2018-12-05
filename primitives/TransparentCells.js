/**
/**
 * TransparentCells
 * @constructor
 */
class TransparentCells extends CGFobject
{
	constructor(scene) 
	{
        super(scene);
        this.scene = scene;
		this.initBuffers();    
	};

	initBuffers() 
	{	
        this.objects= [
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2)
        ];
    
    };
    
    display()
    {
        var xCoord = 5.12;
        var zCoord = 12.75;
        var objectIndex = 0;

        for(var i = 0; i < 10; i++){

            for(var j = 0; j < 10; j++){
                this.scene.pushMatrix();
    
                console.log("translate " + xCoord + " translate " + zCoord);

                this.scene.translate(xCoord, 1.46 , zCoord);
                this.scene.registerForPick(objectIndex+1, this.objects[objectIndex]);
                
                this.objects[i].display();
                this.scene.popMatrix();
                zCoord -= 0.16;
                objectIndex++;
            }

            xCoord -= 0.14;
        }
    };


	resetCoords(){

	}
	
	scaleTextureCoords(lengthS, lengthT){

	};

};
