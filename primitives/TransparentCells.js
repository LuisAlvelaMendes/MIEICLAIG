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

    logPicking()
    {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i=0; i< this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj)
                    {
                        var customId = this.pickResults[i][1];				
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                    }
                }

                this.pickResults.splice(0,this.pickResults.length);
            }		
        }
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
