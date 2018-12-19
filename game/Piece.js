/**
 * Piece
 * @constructor
 */

class Piece extends CGFobject
{
    constructor(scene, id, type, appearance) 
    {
       super(scene);
       this.scene = scene;
       this.id = id;
       this.type = type;
       this.ComponentApperance = appearance;
    };

    display() 
    {
        this.scene.pushMatrix();
        this.ComponentApperance.apply();
        this.scene.scale(0.35,0.35,0.35);
        this.scene.rotate(-90*3.14/180,1,0,0);
        var cylinder = new MyCylinder(this.scene, "cyl", 20, 20, 1, 1, 1);
        cylinder.display();
        this.scene.popMatrix();
    };
    

};
