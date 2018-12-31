/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    initKeys() {
		this.scene.gui=this;
		this.processKeyboard=function(){};
		this.activeKeys={};
	}

    processKeyDown(event) {
		this.activeKeys[event.code]=true;
	};

	processKeyUp(event) {
		this.activeKeys[event.code]=false;
	};

	isKeyPressed(keyCode) {
		return this.activeKeys[keyCode] || false;
    };

    getCurrentSelection(){
		return this.selection;
	};
    
    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        this.initKeys();

        // add a group of controls (and open/expand by defult)

        var self = this;
        var obj = { undo:function(){ self.scene.undo(); }};
        this.gui.add(obj,'undo');

        return true;
    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key][0];
                group.add(this.scene.lightValues, key);
            }
        }
    }

    /**
     * Adds a folder containing the IDs of the views passed as parameter.
     * @param {array} views
     */
    addViewsGroup(views) {

        var sendID =[];

        for (var key in views){
            if (views.hasOwnProperty(key)){
                sendID.push(key)
            }
        }

        this.gui.add(this.scene, 'selectedCamera', sendID);
    }

    addOptionsGroup(){
        var group = this.gui.addFolder("Options");
        group.open();

        group.add(this.scene, "undo");
    }
}