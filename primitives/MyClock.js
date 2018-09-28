/**
 * MyClock
 * @constructor
 */

function MyClock(scene) {
    CGFobject.call(this, scene);

    this.time=0;

    this.cilinder = new MyCylinder(this.scene, 12, 1);
    
    this.cilinder.initBuffers();

    this.clockAppearance = new CGFappearance(this.scene);
    this.clockAppearance.loadTexture("./resources/images/clock.png");
    this.clockAppearance.setAmbient(0.9, 0.9, 0.9, 0.2);

    this.materialDefault = new CGFappearance(this.scene);
    
    this.materialDefault.setAmbient(0.3,0.3,0.3,1); //o alfa por omissao é 1?

    this.materialDefault.setDiffuse(0.6,0.6,0.6,1);
    
    this.materialDefault.setSpecular(0.0, 0.0, 0.8, 1);

    this.circle = new MyCircle(this.scene, 12);
    this.circle.initBuffers();

    this.seconds = new MyClockHand(this.scene, 0.015,0.8);
    this.mins = new MyClockHand(this.scene, 0.03,0.8);
    this.hours = new MyClockHand(this.scene, 0.035,0.5);

    // 45 segundos
    this.seconds.setAngle(270);
    // 30 min
    this.mins.setAngle(180);
    // 3 horas
    this.hours.setAngle(90);


};

MyClock.prototype.constructor = MyClock;

MyClock.prototype = Object.create(CGFobject.prototype);



MyClock.prototype.display = function() {

    this.scene.pushMatrix();
    this.materialDefault.apply();
    this.cilinder.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    //move the image to front and back
    this.scene.translate(0, 0, 0.98);
    this.clockAppearance.apply();
    this.circle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.materialDefault.apply();
    this.scene.translate(0, 0, 1.1);
    this.seconds.display();
    this.mins.display();
    //this.materialDefault.apply();
    this.hours.display();
    this.scene.popMatrix();

}

MyClock.prototype.update = function(deltaTime){

    let time = deltaTime/1000;
    let hourAngle=(this.hours.angle + time * 360/60/60/12)%360;
    let secAngle=(this.seconds.angle + time * 360/60)%360;
    let minAngle=(this.mins.angle + time * 360/60/60)%360;
  

      this.seconds.setAngle(secAngle);
      this.mins.setAngle(minAngle);
      this.hours.setAngle(hourAngle);


}