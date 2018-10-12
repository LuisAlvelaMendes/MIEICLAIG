/**
 * MyWheel
 * @constructor
 */

class MyWheel extends CGFobject
{
    constructor(scene, type) 
    {
        super(scene);

        this.cylinder = new MyCylinder(this.scene,100,10);
        this.circleFront = new MyCircle(this.scene,100,10);
        this.circleBack = new MyCircle(this.scene,100,10);

        if(type==="vehicle"){
            this.tireAppearance = new CGFappearance(this.scene);
            this.tireAppearance.loadTexture("./resources/images/tire.png");
            this.tireAppearance.setAmbient(0.05, 0.05,0.05, 1);
            this.tireAppearance.setDiffuse(0.05,0.05, 0.05, 1);
            this.tireAppearance.setSpecular(0.05,0.05,0.05, 1);
        }else if(type ==="crane"){
            this.tireAppearance = new CGFappearance(this.scene);
            this.tireAppearance.loadTexture("./resources/images/yellow.jpeg");
            this.tireAppearance.setAmbient(0.9, 0.9, 0.9, 0.2);
        }
        else if(type ==="iman"){
            this.tireAppearance = new CGFappearance(this.scene);
            this.tireAppearance.loadTexture("./resources/images/iman.jpg");
            this.tireAppearance.setAmbient(0.9, 0.9, 0.9, 0.2);
        }

    };

    display() 
    {
    
        // cylinder
        this.scene.pushMatrix();
        this.scene.scale(0.7,0.7, 0.5);
        this.tireAppearance.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        //Cilinder A
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0);
        this.scene.rotate((-180*(3.14/180)), 1, 0,0);
        this.scene.scale(0.7,0.7, 0.5);
        this.tireAppearance.apply();
        this.circleFront.display();
        this.scene.popMatrix();

        //Cilinder B
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.scene.scale(0.7,0.7, 0.5);
        this.tireAppearance .apply();
        this.circleBack.display();
        this.scene.popMatrix();



    };
};
