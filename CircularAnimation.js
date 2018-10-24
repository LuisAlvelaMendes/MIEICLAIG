var DEGREE_TO_RAD = (Math.PI / 180);

/**
 * CircularAnimation
 * @constructor
 */
class CircularAnimation extends Animation
{
	constructor(scene, centerCoords, radius, initialAngle, rotationAngle) 
	{
        this.scene = scene;
        this.centerCoords = centerCoords;
        this.radius = radius;
        this.initialAngle = initialAngle;
        this.rotationAngle = rotationAngle;
    };
    

    applyAnimation(){
        
    };

};
