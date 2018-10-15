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
        this.circleFront = new MyCircle(this.scene, this.slices, this.top);
        this.circleBack = new MyCircle(this.scene, this.slices, this.base);
        this.cylinder = new MyCylinderBody(this.scene, this.slices, this.stacks, this.base, this.top, this.height);
    };

    display() 
    {
    
        // cylinder
        this.scene.pushMatrix();
        this.scene.scale(0.7,0.7, 0.5);
        this.cylinder.display();
        this.scene.popMatrix();

        //Cilinder A
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0);
        this.scene.rotate((-180*(Math.PI/180)), 1, 0,0);
        this.scene.scale(0.7,0.7, 0.5);
        this.circleFront.display();
        this.scene.popMatrix();

        //Cilinder B
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.scene.scale(0.7,0.7, 0.5);
        this.circleBack.display();
        this.scene.popMatrix();

    };

    resetCoords(){
        this.circleFront.resetCoords();
        this.circleBack.resetCoords();
        this.cylinder.resetCoords();
    };

    
	scaleTextureCoords(lengthS, lengthT){
        this.circleFront.scaleTextureCoords(lengthS, lengthT);
        this.circleBack.scaleTextureCoords(lengthS, lengthT);
        this.cylinder.scaleTextureCoords(lengthS, lengthT);
    };
};
