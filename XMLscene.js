var DEGREE_TO_RAD = Math.PI / 180;
var FPS = 60;

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

        this.game = new Cannon(this);
        this.game.start("Human vs Human", -1);

        this.enableTextures(true);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.materialDefault = new CGFappearance(this);
        this.lastTime = -1;
        this.deltaTime = 0;
        this.setUpdatePeriod(1000 * (1/FPS));

        this.setPickEnabled(true);
    }

    logPicking()
    {
        let column = Math.ceil((i + 1) / 11);
        let row = i + 1 - 10 * (column - 1);

        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i=0; i< this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj)
                    {
                        var customId = this.pickResults[i][1];
                        let row = Math.ceil(customId / 10);
                        let column = customId - 10 * (row - 1);
                        console.log("Picked with pick id " + customId + " it is in row " + row + " and column " + column);
                        this.game.selectedCell(row-1, column-1);
                    }
                }

                this.pickResults.splice(0,this.pickResults.length);
            }		
        }
    };
    

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(1.6, 1.1, 550, vec3.fromValues(140, 120, 30), vec3.fromValues(0,1,0));      
    }

    update(currTime) {

        // update animations
        var deltaTime = (currTime - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = currTime;

        for (var componentsId in this.graph.components) {
            
            var component = this.graph.components[componentsId];
            
            if(component.animationsID != undefined && component.animationsID.length != 0){
            
                if(this.graph.animations[component.animationsID[component.currentAnimationIndex]].animationReachedLoop == false){
                    this.graph.components[componentsId].update(deltaTime);
                }

                else{
                    if(component.animationsID.length > 1 && component.currentAnimationIndex < component.animationsID.length){
                        this.graph.components[componentsId].incrementAnimation();
                    }

                    if(component.currentAnimationIndex >= component.animationsID.length){
                        this.graph.components[componentsId].decrementAnimation();
                    }
                }
                
            }
        }

        if(this.graph.primitives != undefined){
            this.graph.primitives["myWater"].update(currTime/90);
        }
    }

    // Take values from Parser to actually create CGF Cameras
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
                
                if(this.graph.views[key].length <= 5){
                    angle = this.graph.views[key][4];
                    this.cameraParser[key] = new CGFcamera(angle*DEGREE_TO_RAD, near, far, vec3.fromValues(from_x, from_y, from_z), vec3.fromValues(to_x,to_y,to_z));
                }

                else {
                    left = this.graph.views[key][4];
                    right = this.graph.views[key][5];
                    top = this.graph.views[key][6];
                    bottom = this.graph.views[key][7];
                    var upVector = [0, 1, 0];
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
        
        // Make sure the view selected by default is the "default" one from the views block.
        this.selectedCamera = this.graph.defaultCamera;

        this.sceneInited = true;
    }


    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup
        
        this.logPicking();
        this.clearPickRegistration();

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
                this.interface.setActiveCamera(this.camera);
                this.selectedCamera = "";
            }

            // Displays the scene (MySceneGraph function).

            this.graph.displayScene(this.game);
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