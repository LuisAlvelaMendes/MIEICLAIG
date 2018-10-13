/**
 * MyVehicle
 * @constructor
 */

var degToRad = Math.PI / 180.0;

class MyVehicle extends CGFobject
{
    constructor(scene) 
    {
        super(scene);

        this.subVelocity = 0;
        this.posX = 0;
        this.posZ = 15;
        this.angle = 0;

        //frente - tras
        this.wheelAngle = 0;
        // rotation
        this.wheelRotate = 0;

        this.bodyUpA = new MyUnitCubeQuad(this.scene);
        this.bodyUpB = new MyUnitCubeQuad(this.scene);
        this.back = new MyUnitCubeQuad(this.scene);
        this.front = new MyUnitCubeQuad(this.scene);
        this.mirror = new MyUnitCubeQuad(this.scene);
        this.windowFront = new MyUnitCubeQuad(this.scene);
        this.windowBack = new MyUnitCubeQuad(this.scene);
        this.backWheelLeft = new MyWheel(this.scene,"vehicle");
        this.frontWheelLeft = new MyWheel(this.scene,"vehicle");
        this.backWheelRight = new MyWheel(this.scene,"vehicle");
        this.frontWheelRight = new MyWheel(this.scene,"vehicle");
        this.mirrorLeft = new MyUnitCubeQuad(this.scene);
        this.mirrorRight = new MyUnitCubeQuad(this.scene);
        this.lightLeft = new MyCarLight(this.scene);
        this.lightRight = new MyCarLight(this.scene);

         
        this.carColor = new CGFappearance(this.scene);
        this.carColor.loadTexture("./resources/images/red.jpeg");
        this.carColor.setAmbient(0.9, 0.9, 0.9, 0.2);

        this.glass = new CGFappearance(this.scene);
        this.glass.loadTexture("./resources/images/glass.jpg");
        this.glass.setAmbient(0.9, 0.9, 0.9, 0.2);



    };

    init(){
        this.materialDefault = new CGFappearance(this);
        this.materialA = new CGFappearance(this);
        this.materialA.setAmbient(0.3,0.3,0.3,1); //o alfa por omissao é 1?
        this.materialA.setDiffuse(0.6,0.6,0.6,1);
        this.materialA.setSpecular(0.0, 0.0, 0.8, 1);
        this.materialA.setShininess(120);
    };

    display() 
    {

          // mirror left
        this.scene.pushMatrix();
        this.scene.translate(1.5, 1.8, -1.4);
        this.scene.scale(0.1, 0.3, 0.3);
		this.carColor.apply();
		this.mirrorLeft.display();
        this.scene.popMatrix();

        // mirror right
        this.scene.pushMatrix();
        this.scene.translate(1.5, 1.8, 1.4);
        this.scene.scale(0.1, 0.3, 0.3);
		this.carColor.apply();
        this.mirrorRight.display();
        this.scene.popMatrix();

        // mirror
        this.scene.pushMatrix();
        this.scene.translate(1.35, 1.7, 0);
        this.scene.scale(1, 1.1, 2.498);
        this.scene.rotate((130*(3.14/180)), 0, 0, 1);
        this.glass.apply();
        this.mirror.display();
        this.scene.popMatrix();

      
        
        //frontLight
        this.scene.pushMatrix();
        this.scene.translate(2.64, 1.3, 0.7);
        this.scene.scale(0.55, 0.55, 0.55);
        this.lightLeft.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(2.64, 1.3, -0.7);
        this.scene.scale(0.55, 0.55, 0.55);
        this.lightRight.display();
        this.scene.popMatrix();

        // WindoeFront
        this.scene.pushMatrix();
        this.scene.translate(0.65, 2.1, 0);
        this.scene.scale(0.95, 0.7, 2.55);
        this.glass.apply();
        this.bodyUpB.display();
        this.scene.popMatrix();

        // WindorBack
        this.scene.pushMatrix();
        this.scene.translate(-0.55, 2.1, 0);
        this.scene.scale(1, 0.7, 2.55);
        this.glass.apply();
        this.bodyUpB.display();
        this.scene.popMatrix();

         // TopA
        this.scene.pushMatrix();
        this.scene.translate(0, 1.2, 0);
        this.scene.scale(3, 1, 2.5);
        this.carColor.apply();
        this.bodyUpA.display();
        this.scene.popMatrix();

        // TopB
        this.scene.pushMatrix();
        this.scene.translate(0, 2.1, 0);
        this.scene.scale(2.81, 0.91, 2.5);
        this.bodyUpB.display();
        this.scene.popMatrix();

        // Back
        this.scene.pushMatrix();
        this.scene.translate(-1.6, 1.2, 0);
        this.scene.scale(0.8, 1, 2.5);
        this.back.display();
        this.scene.popMatrix();

        // Front
        this.scene.pushMatrix();
        this.scene.translate(2, 1.2, 0);
        this.scene.scale(1.5, 1, 2.5);
        this.back.display();
        this.scene.popMatrix();

        //backWheelLeft
        this.scene.pushMatrix();
        this.scene.translate(1.5, 0.7, 0.9);
        this.backWheelLeft.display();
        this.scene.popMatrix();

        //frontWheelLeft
        this.scene.pushMatrix();
        this.scene.translate(-0.6, 0.7, 0.9);
        this.frontWheelLeft.display();
        this.scene.popMatrix();

        //backWheelRight
        this.scene.pushMatrix();
        this.scene.translate(1.5, 0.7, -1.4);
        this.backWheelRight.display();
        this.scene.popMatrix();

        //frontWheelRight
        this.scene.pushMatrix();
        this.scene.translate(-0.6, 0.7, -1.4);
        this.frontWheelRight.display();
        this.scene.popMatrix();


      
    };
};
