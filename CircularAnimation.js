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
        this.centerCoords = centerCoords;
        this.radius = radius;
        this.initialAngle = initialAngle;
        this.rotationAngle = rotationAngle;
    };

    apply(){
        //console.log("here as well but circular");
    };

    
    update(deltaTime){
        //console.log("doing nothing circular");
    };

};
