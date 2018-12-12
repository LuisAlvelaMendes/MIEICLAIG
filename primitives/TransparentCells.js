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
        var xCoord = 3.44;
        var zCoord = 13.75;
        var objectIndex = 0;

        for(var i = 0; i < 10; i++){

            for(var j = 0; j < 10; j++){
                this.scene.pushMatrix();

                this.scene.translate(xCoord, -0.56 , zCoord);
                this.scene.registerForPick(objectIndex, this.objects[objectIndex]);
                
                this.objects[i].display();
                this.scene.popMatrix();
                zCoord -= 1.56;

                objectIndex++;
            }

            xCoord += 1.5;
            zCoord = 13.75;
        }
    };


	resetCoords(){

	}
	
	scaleTextureCoords(lengthS, lengthT){

	};

};
