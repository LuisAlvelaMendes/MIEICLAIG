/**
 * MyNurbsCylinder
 * @constructor
 */
class MyNurbsCylinder extends CGFobject
{
    constructor(scene, id, slices, stacks, top, base, height) 
    {
        super(scene);
        this.id = id;
        this.base = base;
        this.top = top;
        this.slices = slices;
        this.stacks = stacks;
        this.height = height;

        this.cylinderHalf1 = new MyNurbsCylinderHalf(this.scene, this.slices, this.stacks, this.base, this.top, this.height);
        this.cylinderHalf2 = new MyNurbsCylinderHalf(this.scene, this.slices, this.stacks, this.base, this.top, this.height);
    };

    display() 
    {
        // glue two halves of the cylinder together with transformations
        this.scene.pushMatrix();
        /*
        transformations go here 
        */
        this.scene.popMatrix();
    };


    // Not sure about textures ...

    resetCoords(){

    };

    
	scaleTextureCoords(lengthS, lengthT){

    };
};
