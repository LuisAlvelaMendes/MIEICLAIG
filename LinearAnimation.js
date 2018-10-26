var DEGREE_TO_RAD = (Math.PI / 180);

/**
 * LinearAnimation
 * @constructor
 */
class LinearAnimation extends Animation
{
	constructor(scene, id, totalTime, controlPoints) 
	{
        super(scene, id, totalTime)
        this.linearVector = controlPoints;
    };
    
    applyAnimation(){
        //console.log("Linear animation!");
    };

    calculateVelocity(){
        this.distance = 0;
        var directionVector = vec3.create();
        
        for (let i = 1; i < this.linearVector.length; i++) {
            vec3.sub(directionVector, this.linearVector[i], this.linearVector[i - 1]);
            this.distance += vec3.length(directionVector);
        }
        
        this.velocity = this.distance / this.time;
    };

};
