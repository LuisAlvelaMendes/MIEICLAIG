/**
 * MyWheel
 * @constructor
 */

class MyCylinder extends CGFobject
{
    constructor(scene, id, slices, stacks, base, top, height) 
    {
        super(scene);
        this.cylinder = new MyCylinderBody(this.scene,100,100,1,1,1,1);
        this.circleFront = new MyCircle(this.scene,100);
        this.circleBack = new MyCircle(this.scene,100);
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
        this.scene.rotate((-180*(3.14/180)), 1, 0,0);
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
};
