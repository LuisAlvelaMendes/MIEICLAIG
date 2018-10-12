/**
 * MyCarLight
 * @constructor
 */

class MyCarLight extends CGFobject
{
    constructor(scene) 
    {
        super(scene);

        this.cylinder = new MyCylinder(this.scene,100,10);
        this.circleFront = new MyCircle(this.scene,100,10);

        this.tireAppearance = new CGFappearance(this.scene);
        this.tireAppearance.loadTexture("./resources/images/carlight.png");
        this.tireAppearance.setAmbient(0.9, 0.9, 0.9, 0.2);

    };

    display() 
    {
    
        // cylinder
        this.scene.pushMatrix();
        this.scene.scale(0.3,0.3, 0.3);
        this.scene.rotate((90*(3.14/180)), 0, 1, 0);
        this.cylinder.display();
        this.scene.popMatrix();

        //Cilinder B
        this.scene.pushMatrix();
        this.scene.translate(0.3, 0, 0);
        this.scene.scale(0.3,0.3, 0.3);
        this.scene.rotate((90*(3.14/180)), 0, 1, 0);
        this.tireAppearance .apply();
        this.circleFront.display();
        this.scene.popMatrix();



    };
};
