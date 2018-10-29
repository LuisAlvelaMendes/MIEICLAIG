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
        this.controlPoints = controlPoints;

        // first piece of animation "path" that will have to be made, from control point [0] to c.p [1]
        this.pathBetweenControlPoints = vec3.create();

        vec3.sub(this.pathBetweenControlPoints, this.controlPoints[1], this.controlPoints[0]);
        this.pathLength = vec3.length(this.pathBetweenControlPoints);

        // calculate horizontal angle with Z axis and vertical angle with Y axis
        this.calculateAngles();
 
        // current position of the object
        this.currentPosition = vec3.create(); 

        // distance travelled so far 
        this.distanceTravelled = 0;

        // control point you want to go to from your current point. At the beginning it is 1 because you want to go from c.p [0] --> c.p[1]
        this.destinationPoint = 1;

        this.calculateVelocity();

        // tell us if the animation has reached its end point, where it must loop back to the start.
        this.animationReachedLoop = false;
    };

    /**
     * Calculates vertical and horizontal angle.
     */
    calculateAngles(){
        this.pathOrientationXZ = vec3.fromValues(this.pathBetweenControlPoints[0], 0, this.pathBetweenControlPoints[2]);
        this.horizontalAngle = this.calcAux([0, 0, 1], this.pathOrientationXZ) * DEGREE_TO_RAD;

        this.pathOrientationYZ = vec3.fromValues(0, this.pathBetweenControlPoints[1], this.pathBetweenControlPoints[2]);
        this.verticalAngle = this.calcAux([0, 0, 1], this.pathOrientationYZ) * DEGREE_TO_RAD;
    }

    /**
     * Auxiliary generic function for angle calculation using vec3
     * @param {*} a 
     * @param {*} b 
     */
    calcAux(a,b){
        var tempA = vec3.fromValues(a[0], a[1], a[2]);
        var tempB = vec3.fromValues(b[0], b[1], b[2]);
  
        vec3.normalize(tempA, tempA);
        vec3.normalize(tempB, tempB);
  
        var checkCos = vec3.dot(tempA, tempB);
        if (checkCos > 1.0) {
            return 0;
        } else {
            return Math.acos(checkCos);
        }
      }

    /**
     * Calculates velocity based on a pair of vectors drawn from the received control points, adding their length and dividing by animation time.
     */
    calculateVelocity(){
        this.distance = 0;
        var path = vec3.create();
        
        for (var i = 1; i < this.controlPoints.length; i++) {
            vec3.sub(path, this.controlPoints[i], this.controlPoints[i - 1]);
            this.distance += vec3.length(path);
        }
        
        this.velocity = this.distance / this.time;
    };
    
    /**
     * Constantly updates the animation
     * @param {*} deltaTime 
     */
    update(deltaTime){
        this.distanceTravelled += deltaTime * this.velocity;

        if(this.distanceTravelled > this.pathLength){
            // when this happens, you have already gone beyond the path from control point a -> b and are now somewhere between b -x--> c (at x)
            this.distanceTravelled -= this.pathLength;
            this.goToNextPath();
        }

        // now that you have updated the path, time to update the position with a scalar value
        var scalarValue = this.distanceTravelled / this.pathLength;
        
        vec3.scale(this.currentPosition, this.pathBetweenControlPoints, scalarValue);
    };

    /**
     * Updates the path between points being studied at the current moment
     */
    goToNextPath(){
        this.destinationPoint++;

        if(this.destinationPoint >= this.controlPoints.length){
            // means you have reached the end of the animation, time to loop back to the beginning
            this.destinationPoint = 1;
            this.animationReachedLoop = true;
        }

        // If it hasn't ended, you must calculate the next path
        vec3.sub(this.pathBetweenControlPoints, this.controlPoints[this.destinationPoint], this.controlPoints[this.destinationPoint - 1]);
        this.pathLength = vec3.length(this.pathBetweenControlPoints);
    }

    apply(){

        // first, translate the object to the beginning point in the animation
        var x = this.controlPoints[this.destinationPoint-1][0];
        var y = this.controlPoints[this.destinationPoint-1][1];
        var z = this.controlPoints[this.destinationPoint-1][2];
        this.scene.translate(x,y,z);

        // translate accordingly to the path
        this.scene.translate(this.currentPosition[0],this.currentPosition[1],this.currentPosition[2]);

        // rotate horizontally, along Y
        //this.scene.rotate(this.horizontalAngle, 0, 1, 0);

        // rotate vertically, along x
        //this.scene.rotate(this.verticalAngle, 1, 0, 0);
    };

};
