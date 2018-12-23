/**
 * City
 * @constructor
 */

class City extends CGFobject
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
        this.scene.scale(0.6,3.5,0.6);
        this.scene.rotate(-90*3.14/180,1,0,0);
        var cube = new MyUnitCubeQuad(this.scene);
        cube.display();
        this.scene.popMatrix();
    };
    

};
