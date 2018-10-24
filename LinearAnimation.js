var DEGREE_TO_RAD = (Math.PI / 180);

/**
 * LinearAnimation
 * @constructor
 */
class LinearAnimation extends Animation
{
	constructor(scene, controlPoint1, controlPoint2, controlPoint3, totalTime) 
	{
        this.scene = scene;
        this.linearVector = [controlPoint1, controlPoint2, controlPoint3];
        this.duration = totalTime;
    };
    
    applyAnimation(){
        
    };

};
