
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


        this.bodyUpA = new MyUnitCubeQuad(this.scene);
        this.bodyUpB = new MyUnitCubeQuad(this.scene);
        this.wheel1 = new MyUnitCubeQuad(this.scene);
        this.wheel2 = new MyUnitCubeQuad(this.scene);
        this.nurbsSurface = new MyNurbsCylinderHalf(this.scene, "half", 20, 20, 2, 2, 2);
        this.back = new MyTriangle(this.scene,"t1",0,0,0,0,4,0,0,2,2);
        
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
         // body
        this.scene.pushMatrix();
        this.scene.translate(0, 2.2, 0);
        this.scene.scale(7, 1, 2.5);
        this.bodyUpA.display();
        this.scene.popMatrix();

        // nurbs
        this.scene.pushMatrix();
        this.scene.translate(0, 2.6, 0);
        this.scene.scale(1, 1, 1);
        this.nurbsSurface.display();
        this.scene.popMatrix();

        // wings
        this.scene.pushMatrix();
        this.scene.translate(0, 2, 0);
        this.scene.scale(0.4, 0.6, 17.5);
        this.bodyUpB.display();
        this.scene.popMatrix();

        // wheel1
        this.scene.pushMatrix();
        this.scene.translate(0,1.5, 1);
        this.scene.scale(0.6, 1, 0.2);
        this.wheel1.display();
        this.scene.popMatrix();

        // wheel1
        this.scene.pushMatrix();
        this.scene.translate(0, 1.5, -1);
        this.scene.scale(0.6, 1, 0.2);
        this.wheel2.display();
        this.scene.popMatrix();
    };

    scaleTextureCoords(tex1, tex2)
	{
	
	};

	resetCoords()
	{

	};

};