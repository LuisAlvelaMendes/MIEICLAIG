/**
 * MyClockHand
 * @constructor
 */

function MyClockHand(scene, radius, height) {
    CGFobject.call(this, scene);

    this.pointer = new MyCylinder(this.scene,12,6);
    this.pointer.initBuffers();

    this.materialDefault = new CGFappearance(this.scene);
    this.materialDefault.setDiffuse(1.6,1.6,0.6,1);
    this.materialDefault.setAmbient(1.3,1.3,0.3,1); //
    
    this.materialDefault.setSpecular(1.0, 1.0, 0.8, 1);


    this.radius= radius;
    this.height = height;
    this.angle = 0;
};

MyClockHand.prototype = Object.create(CGFobject.prototype);

MyClockHand.prototype.constructor = MyClockHand;

MyClockHand.prototype.getAngle = function() {
    return this.angle;
};


MyClockHand.prototype.setAngle = function(angle) {
    this.angle = angle;
}


MyClockHand.prototype.display = function() {

    this.scene.pushMatrix();
    //this.scene.translate(0,-0.5,0);
    this.scene.rotate(3*Math.PI/2,1,0,0);
    this.scene.rotate(this.angle*Math.PI/180,0,1,0);
    
    this.scene.scale(this.radius, this.radius, this.height);
    
    this.pointer.display();
    this.materialDefault.apply();
    this.scene.popMatrix();
}