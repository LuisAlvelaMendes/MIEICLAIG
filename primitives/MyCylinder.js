/**
 * MyWheel
 * @constructor
 */

class MyCylinder extends CGFobject
{
    constructor(scene, id, slices, stacks, base, top, height) 
    {
        super(scene);
        this.id = id;
        this.base = base;
        this.top = top;
        this.slices = slices;
        this.stacks = stacks;
        this.height = height;
        
        if(this.top != 0){
            this.circleFront = new MyCircle(this.scene, this.slices, this.top);
        }
        
        if(this.base != 0){
            this.circleBack = new MyCircle(this.scene, this.slices, this.base);
        }

        this.cylinder = new MyCylinderBody(this.scene, this.slices, this.stacks, this.base, this.top, this.height);
    };

    display() 
    {
    
        // cylinder
        this.scene.pushMatrix();
        this.cylinder.display();
        this.scene.popMatrix();


        if(this.top != 0){
            //Circle A
            this.scene.pushMatrix();
            this.scene.rotate((-180*(Math.PI/180)), 1, 0,0);
            this.circleFront.display();
            this.scene.popMatrix();
        }

        if(this.base != 0){
            //Circle B
            this.scene.pushMatrix();

            if(this.height != 1){
                this.scene.translate(0, 0, this.height/2);
            }

            else{
                this.scene.translate(0, 0, 0.5);
            }
            
            this.circleBack.display();
            this.scene.popMatrix();
        }
  
    };

    resetCoords(){
        if(this.top != 0){
            this.circleFront.resetCoords();
        }
        
        if(this.base != 0){
            this.circleBack.resetCoords();
        }
      
        this.cylinder.resetCoords();
    };

    
	scaleTextureCoords(lengthS, lengthT){
        if(this.top != 0){
            this.circleFront.scaleTextureCoords(lengthS, lengthT);
        }
       
        if(this.base != 0){
            this.circleBack.scaleTextureCoords(lengthS, lengthT);
        }
     
        this.cylinder.scaleTextureCoords(lengthS, lengthT);
    };
};
