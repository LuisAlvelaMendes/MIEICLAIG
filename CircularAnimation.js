var DEGREE_TO_RAD = (Math.PI / 180);
/**
 * CircularAnimation
 * @constructor
 */
class CircularAnimation extends Animation
{
	constructor(scene, id, durationTime, centerCoords, radius, initialAngle, rotationAngle) 
	{
        super(scene, id, durationTime);

        //Pontos do Centro
        this.centerX = centerCoords[0];
        this.centerY = centerCoords[1];
        this.centerZ = centerCoords[2];

        //Angles
        this.radius = radius;
        this.initialAngle = initialAngle * DEGREE_TO_RAD;
        this.rotationAngle = rotationAngle * DEGREE_TO_RAD;

        this.totalDistance = this.rotationAngle * this.radius;

        this.angularVelocity = (this.totalDistance/this.time);

        this.atualdist = 0;
        this.atualAngle = 0;
        this.animationReachedLoop = false;
    };
   
    update(deltaTime){
        // Velocidade angular
        if(this.atualAngle < this.rotationAngle){
            this.atualdist += this.angularVelocity*deltaTime;
            this.atualAngle = this.atualdist/this.radius;
        } else{
            this.animationReachedLoop = true;
        }

    };

    apply(){
        //Por objto na origem
        this.scene.translate(this.centerX, this.centerY, this.centerZ);
        //Movimento de Translacao
        this.scene.translate(this.radius * Math.cos(this.initialAngle + this.atualAngle), 0, -this.radius  * Math.sin(this.initialAngle + this.atualAngle));
    };

};
