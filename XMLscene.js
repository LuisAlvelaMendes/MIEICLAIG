var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
        this.cameraParser = [];
        this.selectedCamera = "";
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();
        

        this.enableTextures(true);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.materialDefault = new CGFappearance(this);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        //var f = this.graph.lights 40 20 30 , 
        this.camera = new CGFcamera(0.6, 0.1, 550, vec3.fromValues(40, 20, 30), vec3.fromValues(0,1,0));      
    }


    cross(out, a, b) {
        let ax = a[0], ay = a[1], az = a[2];
        let bx = b[0], by = b[1], bz = b[2];
        out[0] = ay * bz - az * by;
        out[1] = az * bx - ax * bz;
        out[2] = ax * by - ay * bx;
        return out;
    }

    // Take valeus from Parser to actually create CGF Cameras
    recoverParsedCameras(){
        for (var key in this.graph.views) {
            if (this.graph.views.hasOwnProperty(key)) {
                var from_x = this.graph.views[key][0][0]
                var from_y = this.graph.views[key][0][1]
                var from_z = this.graph.views[key][0][2]
                var to_x = this.graph.views[key][1][0]
                var to_y = this.graph.views[key][1][1]
                var to_z = this.graph.views[key][1][2]
                var near = this.graph.views[key][2]
                var far = this.graph.views[key][3]
                var angle = 0;
                var left = 0;
                var right = 0;
                var top = 0;
                var bottom = 0;

                console.log(this.graph.views);
                
                if(this.graph.views[key].length <= 5){
                    angle = this.graph.views[key][4];
                    this.cameraParser[key] = new CGFcamera(angle, near, far, vec3.fromValues(from_x, from_y, from_z), vec3.fromValues(to_x,to_y,to_z));
                }

                else {
                    left = this.graph.views[key][4];
                    right = this.graph.views[key][5];
                    top = this.graph.views[key][6];
                    bottom = this.graph.views[key][7];
                    var placeHolder = new CGFcameraOrtho(left, right, bottom, top, near, far, vec3.fromValues(from_x, from_y, from_z), vec3.fromValues(to_x,to_y,to_z), null);
                    var direction = placeHolder.calculateDirection();
                    var sideVector = [0, 0, 0];
                    var upVector = [0, 0, 0];
                    this.cross(sideVector, direction, [0, 1, 0]); 
                    this.cross(upVector, direction, sideVector);
                    this.cameraParser[key] = new CGFcameraOrtho(left, right, bottom, top, near, far, vec3.fromValues(from_x, from_y, from_z), vec3.fromValues(to_x,to_y,to_z), upVector);
                }
           }
        }
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                console.log(light);

                //lights are predefined in cgfscene
                if(light.length == 5){
                    this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
                    this.lights[i].setAmbient(light[2]["r"], light[2]["g"], light[2]["b"], light[2]["a"]);
                    this.lights[i].setDiffuse(light[3]["r"], light[3]["g"], light[3]["b"], light[3]["a"]);
                    this.lights[i].setSpecular(light[4]["r"], light[4]["g"], light[4]["b"], light[4]["a"]);
                }

                else {
                    this.lights[i].setSpotCutOff(light[1]);
                    this.lights[i].setSpotExponent(light[2]);
                    this.lights[i].setSpotDirection(light[3][0], light[3][1], light[3][2], light[3][3])
                    this.lights[i].setPosition(light[4][0], light[4][1], light[4][2], light[4][3]);
                    this.lights[i].setAmbient(light[5]["r"], light[5]["g"], light[5]["b"], light[5]["a"]);
                    this.lights[i].setDiffuse(light[6]["r"], light[6]["g"], light[6]["b"], light[6]["a"]);
                    this.lights[i].setSpecular(light[7]["r"], light[7]["g"], light[7]["b"], light[7]["a"]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.camera.near = this.graph.near;
        this.camera.far = this.graph.far;
        this.axis = new CGFaxis(this,this.graph.Axis_Length);
        
        this.setGlobalAmbientLight(this.graph.ambientRGB["r"], this.graph.ambientRGB["g"], this.graph.ambientRGB["b"], this.graph.ambientRGB["a"]);
        this.gl.clearColor(this.graph.backgroundRGB["r"], this.graph.backgroundRGB["g"], this.graph.backgroundRGB["b"], this.graph.backgroundRGB["a"]);


        this.initLights();
        this.recoverParsedCameras();

        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);

        // Adds views group.
        this.interface.addViewsGroup(this.graph.views);

        this.sceneInited = true;
    }


    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();
            this.materialDefault.apply();

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            if(this.selectedCamera != ""){
                this.camera = this.cameraParser[this.selectedCamera];
                this.selectedCamera = "";
            }

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }

        else {
            // Draw axis
            this.axis.display();
            this.materialDefault.apply();
        }

        this.popMatrix();
       
        // ---- END Background, camera and axis setup
    }
}