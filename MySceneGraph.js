var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.
        this.Axis_Length = 0;

        // Default camera coordinates before views are parsed:
        this.near = 0.1;
        this.far = 500;

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        this.swapMaterial = false;

        this.componentIds = [];

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;
        this.nodes = nodes;
        
        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;
        var index;

        // Processes each node, verifying errors.

        // <scene>
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }


        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse LIGHTS block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse TEXTURES block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse MATERIALS block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse TRANSFORMATION block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

         // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");
                
            //Parse Animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse PRIMITIVES block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse COMPONENTS block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }

    }

    /**
     * Parses the <scene> block.
     */
    parseScene(sceneNode){

        if(!sceneNode.hasAttribute("root")){
            this.onXMLError("no root found on scene");
            return null;
        }

        else {
            this.idRoot = this.reader.getString(sceneNode, 'root');
        }

        if(!sceneNode.hasAttribute("axis_length")){
            this.onXMLError("no axis_length found on scene");
            return null;
        }

        else {
            this.Axis_Length = this.reader.getFloat(sceneNode, 'axis_length');

            if(isNaN(this.Axis_Length)){
                this.onXMLError("axis length is not a number");
                return null;
            }
        }

        this.log("Parsed scene root " + this.idRoot + " and axis " + this.Axis_Length);
        return null;
    }

    parseCoordinates(element){

        var result = [];

        // x
        var x = this.reader.getFloat(element, 'x');
        if (!(x != null && !isNaN(x)))
            this.onXMLError("unable to parse x-coordinate");
        else
        result.push(x);

        // y
        var y = this.reader.getFloat(element, 'y');
        if (!(y != null && !isNaN(y)))
            this.onXMLError("unable to parse y-coordinate");
        else
        result.push(y);

        // z
        var z = this.reader.getFloat(element, 'z');
        if (!(z != null && !isNaN(z)))
            this.onXMLError("unable to parse z-coordinate");
        else
        result.push(z);

        return result;
    }

    /**
     * Parses the views block.
     * @param {views block element} viewNode
     */
    parseViews(viewNode){

        if(!viewNode.hasAttribute("default")){
            this.onXMLError("view has no default");
        }

        else {
            // This will be used later on to swap to this camera once the views have been parse and the scene is rendered.
            this.defaultCamera = this.reader.getString(viewNode, 'default');
        }

        var children = viewNode.children;
        var grandChildren = [];
        this.views = [];
        var from = [];
        var to = [];
        var numViews = 0;

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "perspective" && children[i].nodeName != "ortho") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var singleView = [];

            // gets id component
            var Id = this.reader.getString(children[i], 'id');
            if (Id == null)
                return "no ID defined for " + children[i].nodeName;

            if(this.checkEqualId(children) == null){
                this.onXMLError("ID repeated for views " + Id);
                return null;
            }

            // gets near component
            var near = this.reader.getFloat(children[i], 'near');
            if (!(near != null && !isNaN(near)))
                return "no Near defined for " + children[i].nodeName;

            //gets far component
            var far = this.reader.getFloat(children[i], 'far');
            if (!(far != null && !isNaN(far)))
                return "no Far defined for " + children[i].nodeName;

            // presuming the view is a perspective ..
            if (children[i].nodeName == "perspective") {

                //gets angle
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "no angle defined for " + children[i].nodeName;
                else this.log("Parsed perspective " + Id + " near = " + near + " far = " + far + " angle = " + angle);

                grandChildren = children[i].children;

                // parsing from and to grandchildren ..
                for (var j = 0; j < grandChildren.length; j++) {

                    if (grandChildren[j].nodeName != "from" && grandChildren[j].nodeName != "to") {
                        this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                        continue;
                    }

                    // from
                    if (grandChildren[j].nodeName == "from") {
                        from = this.parseCoordinates(grandChildren[j]);
                    }

                    // to
                    if (grandChildren[j].nodeName == "to") {
                        to = this.parseCoordinates(grandChildren[j]);
                    }

                }

                singleView.push(from, to, near, far, angle);
            }

            if (children[i].nodeName == "ortho") {
                //gets left
                var left = this.reader.getFloat(children[i], 'left');
                if (!(left != null && !isNaN(left)))
                    return "no left defined for " + children[i].nodeName;

                //gets right
                var right = this.reader.getFloat(children[i], 'right');
                if (!(right != null && !isNaN(right)))
                    return "no right defined for " + children[i].nodeName;

                //gets top
                var top = this.reader.getFloat(children[i], 'top');
                if (!(top != null && !isNaN(top)))
                    return "no top defined for " + children[i].nodeName;

                //gets bottom
                var bottom = this.reader.getFloat(children[i], 'bottom');
                if (!(bottom != null && !isNaN(bottom)))
                    return "no bottom defined for " + children[i].nodeName;

                else this.log("Parsed ortho " + Id + " near = " + near + " far = " + far + " left = " + left + " right = " + right + " top " + top + " bottom " + bottom);

                grandChildren = children[i].children;

                // parsing from and to grandchildren ..
                for (var j = 0; j < grandChildren.length; j++) {

                    if (grandChildren[j].nodeName != "from" && grandChildren[j].nodeName != "to") {
                        this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                        continue;
                    }

                    // from
                    if (grandChildren[j].nodeName == "from") {
                        from = this.parseCoordinates(grandChildren[j]);
                    }

                    // to
                    if (grandChildren[j].nodeName == "to") {
                        to = this.parseCoordinates(grandChildren[j]);
                    }

                }
                
                singleView.push(from, to, near, far, left, right, top, bottom);
            }

            this.views[Id] = singleView;
            numViews++;
        }

        if (numViews == 0) this.onXMLMinorError("at least one view must be defined");

        this.log("Parsed views");
        return null;
    }
    
    rgbParser(genericarray, index) {

        var result = [];

        // subcomponent1
        var r = this.reader.getFloat(genericarray[index], 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            this.onXMLError("unable to parse r component");
        else
            result["r"] = r;

        // subcomponent2
        var g = this.reader.getFloat(genericarray[index], 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            this.onXMLError("unable to parse g component");
        else
            result["g"] = g;

        // subcomponent3
        var b = this.reader.getFloat(genericarray[index], 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            this.onXMLError("unable to parse b component");
        else
            result["b"]=b;

        // subcomponent4
        var a = this.reader.getFloat(genericarray[index], 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            this.onXMLError("unable to parse a component");
        else
            result["a"]=a;

        return result;
    }

    /**
     * Parses the <ambient> block.
     * @param {ambient block element} ambientNode
     */
    parseAmbient(ambientNode) {
        var children = ambientNode.children;

        this.ambientRGB = [];
        this.backgroundRGB = [];
        
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "ambient" && children[i].nodeName != "background") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            if(children[i].nodeName == "ambient"){
                this.ambientRGB = this.rgbParser(children, i);
            }

            if(children[i].nodeName == "background"){
                this.backgroundRGB = this.rgbParser(children, i);
            }
        }
        
        this.log("Parsed ambient");
        return null;
    }

    /**
     * Checks equal IDs
     * @param {*} children 
     */
    checkEqualId(children){
        for(var i = 0; i < children.length; i++){
            for(var j = 0; j < children.length; j++){
                if(children[i].getAttribute("id") == children[j].getAttribute("id") && i!=j){
                    this.onXMLError("Cannot have the same ID! Conflict: " + children[i].getAttribute("id"));
                    return null;
                }
            }
        }

        return 0;
    }

    /**
     * Parses the <LIGHTS> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            var angle = null;
            var exponent = null;

            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var singleLight = [];

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null){
                this.onXMLError("no ID defined for light");
                return null;
            }

            if(this.checkEqualId(children) == null){
                this.onXMLError("ID repeated for lights " + lightId);
                return null;
            }
            
            //get the enable flag here
            var enable = this.reader.getFloat(children[i], 'enabled');

            // Light enable/disable
            var enableLight = true;
            
            if (enable  == null) {
                this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
                return null;
            }
            else {
                var aux = this.reader.getFloat(children[i], 'enabled');
                if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1)))
                    this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
                else
                    enableLight = aux == 0 ? false : true;
            }

            // Specifications for the current light.

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var positionIndex = nodeNames.indexOf("location");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Retrieves the light position.
            var positionLight = [];

            if (positionIndex != -1) {
                positionLight = this.parseCoordinates(grandChildren[positionIndex]);

                // w
                var w = this.reader.getFloat(grandChildren[positionIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1)){
                    this.onXMLError("unable to parse w-coordinate of the light position for ID = " + lightId);
                    return null;
                }
                else positionLight.push(w);
            }

            else{
                this.onXMLError("light position undefined for ID = " + lightId);
                return null;
            }

            // Retrieves the ambient component.
            var ambientIllumination = [];

            if (ambientIndex != -1) {
                ambientIllumination = this.rgbParser(grandChildren, ambientIndex);
            }
            else{
                this.onXMLError("ambient component undefined for ID = " + lightId);
                return null;
            }

            // Retrieve the diffuse component
            var diffuseIllumination = [];

            if (diffuseIndex != -1){
                diffuseIllumination = this.rgbParser(grandChildren, diffuseIndex);
            }

            // Retrieve the specular component
            var specularIllumination = [];

            if (specularIndex != -1){
                specularIllumination = this.rgbParser(grandChildren, specularIndex);
            }

            if(children[i].nodeName == "spot"){ 
                angle = this.reader.getFloat(children[i], 'angle');
                if(angle == null || isNaN(angle)){
                    this.onXMLError("Angle is null for light of id " + lightId);
                    return null;
                }
                
                exponent = this.reader.getFloat(children[i], 'exponent');
                if(exponent == null || isNaN(exponent)){
                    this.onXMLError("Exponent is null for " + lightId);
                    return null;
                }

                var targetIndex = nodeNames.indexOf("target");
                
                var target = [];

                target = this.parseCoordinates(grandChildren[targetIndex]);

                singleLight.push(enableLight, angle, exponent, target, positionLight, ambientIllumination, diffuseIllumination, specularIllumination);
            }
            
            else{
                singleLight.push(enableLight, positionLight, ambientIllumination, diffuseIllumination, specularIllumination);
            }

            // Store Light global information.
            this.lights[lightId] = singleLight;
            numLights++;
        }

        if (numLights == 0)
           this.onXMLMinorError("At least one light must be defined");
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");
        
        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <TEXTURES> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var children = texturesNode.children;

        this.textures = [];
        var numTextures = 0;

        for(var i = 0; i < children.length; i++){
            
            if(children[i].nodeName != "texture"){
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var textureId = this.reader.getString(children[i], "id");

            if(textureId == null){
                this.onXMLError("no ID defined for texture");
                return null;
            }

            if(this.checkEqualId(children) == null){
                this.onXMLError("Repeated ID texture" + textureId);
                return null;
            }

            var file = this.reader.getString(children[i], "file");

            if(file == null){
                this.onXMLError("no file defined for texture");
                return null;
            }

            console.log("Parsed texture id " + textureId + " and file " + file + ".");

            var textureObject = new CGFtexture(this.scene, file);

            this.textures[textureId] = textureObject;
            numTextures++;
        }

        if(numTextures == 0) this.onXMLMinorError("at least one Texture must be defined");

        console.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <MATERIALS> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {

        var children = materialsNode.children;

        this.materials = [];
        var numMaterials = 0;

        for (var i = 0; i < children.length; i++) {

            // Check the tag name in materials
            if(children[i].nodeName != "material") 
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");

            else{
                var materialId = this.reader.getString(children[i], 'id');

                if (materialId == null)
                    return "no ID defined for material";

                // Checks for repeated IDs.
                if (this.materials[materialId] != null)
                    return "ID must be unique for each materials (conflict: ID = " + materialId + ")";

                var materialShi = this.reader.getFloat(children[i], 'shininess');
                if (materialShi == null || isNaN(materialShi)){
                    this.onXMLError("invalid shininess for material " + materialId);
                    return null;
                }

                var grandChildren = children[i].children;
               
                var nodeNames = [];
                
                for (var j = 0; j < grandChildren.length; j++) {
                    nodeNames.push(grandChildren[j].nodeName);
                }

                var emissionIndex = nodeNames.indexOf("emission");
                var ambientIndex = nodeNames.indexOf("ambient");
                var diffuseIndex = nodeNames.indexOf("diffuse");
                var specularIndex = nodeNames.indexOf("specular");

                var emission = [];
                if(emissionIndex != -1){
                    emission = this.rgbParser(grandChildren, emissionIndex);
                }

                else {
                    this.onXMLError("no emission component");
                }

                var ambient = [];
                if(ambientIndex != -1){
                    ambient = this.rgbParser(grandChildren, ambientIndex);
                }

                else {
                    this.onXMLError("no ambient component");
                }
                
                var diffuse = [];
                if(diffuseIndex != -1){
                    diffuse = this.rgbParser(grandChildren, diffuseIndex);
                }

                else {
                    this.onXMLError("no diffuse component");
                }
                
                var specular = [];
                if(specularIndex != -1){
                    specular = this.rgbParser(grandChildren, specularIndex);
                }

                else {
                    this.onXMLError("no specular component");
                }

                var ComponentAppearance = new CGFappearance(this.scene);
		        ComponentAppearance.setShininess(materialShi);
		        ComponentAppearance.setEmission(emission["r"], emission["g"], emission["b"], emission["a"]);
                ComponentAppearance.setAmbient(ambient["r"], ambient["g"], ambient["b"], ambient["a"]);
		        ComponentAppearance.setDiffuse(diffuse["r"], diffuse["g"], diffuse["b"], diffuse["a"]);
		        ComponentAppearance.setSpecular(specular["r"], specular["g"], specular["b"], specular["a"]);

                this.materials[materialId] = ComponentAppearance;
                numMaterials++;
            }
        }

        // Check number Materials
        if(numMaterials == 0)
            this.onXMLMinorError("at least one Material must be defined");
        else if (numMaterials > 8)
            this.onXMLMinorError("too many Materials defined; WebGL imposes a limit of 8 materials");


        console.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> node.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        
        var children = transformationsNode.children;

        this.transformations = [];
        var numTransformations = 0;

        for(var i = 0; i < children.length; i++){

            if(children[i].nodeName != "transformation"){
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var transformationId = this.reader.getString(children[i], "id");

            if(transformationId == null){
                this.onXMLError("No ID for transformation");
                return null;
            }

            if(this.checkEqualId(children) == null){
                this.onXMLError("Repeated ID transformation" + transformationId);
                return null;
            }

            var grandChildren = children[i].children;

            if(grandChildren.length < 1){
                this.onXMLError("There must be at least one transformation declared");
                return null;
            }

            numTransformations++;

            // Creating matrix to apply transformations
            var mat = mat4.create();

            for(var j = 0; j < grandChildren.length; j++){

                if(grandChildren[j].nodeName != "translate" && grandChildren[j].nodeName != "rotate" && grandChildren[j].nodeName != "scale"){
                    this.onXMLError("unkown tag < " + grandChildren[j].nodeName +" >.");
                    continue;
                }
                
                if(grandChildren[j].nodeName == "translate"){
                    // Applying translations
                    mat4.translate(mat, mat, this.parseCoordinates(grandChildren[j]));
                }

                if(grandChildren[j].nodeName == "rotate"){
                    // Applying rotations
                    var axis = this.reader.getString(grandChildren[j], "axis");
    
                    if(axis == null || (axis != "x" && axis != "y" && axis != "z")){
                        this.onXMLError("Axis wrongly declared, must be x, y or z for transformation: " + transformationId);
                        return null;
                    }
        
                    var angle = this.reader.getFloat(grandChildren[j], "angle");
                    if(angle == null || isNaN(angle)){
                        this.onXMLError("invalid angle for transformation " + transformationId);
                        return null;
                    }

                    if(axis == 'x'){
                        mat4.rotate(mat, mat, angle*DEGREE_TO_RAD, [1, 0, 0]);
                    }
    
                    if(axis == 'y'){
                        mat4.rotate(mat, mat, angle*DEGREE_TO_RAD, [0, 1, 0]);
                    }
    
                    if(axis == 'z'){
                        mat4.rotate(mat, mat, angle*DEGREE_TO_RAD, [0, 0, 1]);
                    }
                }

                if(grandChildren[j].nodeName == "scale"){
                    // Applying scaling
                    mat4.scale(mat, mat, this.parseCoordinates(grandChildren[j]));
                }
                
            }

            // Storing matrix in this array
            this.transformations[transformationId] = mat;
        }

        if(numTransformations == 0){
            this.onXMLError("There must at least be one transformation declared.");
            return null;
        }

        console.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <animations> node.
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode){
        var children = animationsNode.children;
        this.animations = [];
        var anim;

        for(var i = 0; i < children.length; i++){

            if(children[i].nodeName != "linear" && children[i].nodeName != "circular"){
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var animationsId = this.reader.getString(children[i], "id");

            if(animationsId == null){
                this.onXMLError("No ID for animation");
                return null;
            }

            if(this.checkEqualId(children) == null){
                this.onXMLError("Repeated ID animation" + animationsId);
                return null;
            }

            if(children[i].nodeName == "linear"){
                var id = this.reader.getString(children[i], 'id');
                var time = this.reader.getFloat(children[i], 'span');

                var grandChildren = children[i].children;
                var numControlPoints = 0;
                var points = [];

                for(var j = 0; j < grandChildren.length; j++){
                    if(grandChildren[j].nodeName != "controlpoint"){
                        this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                        continue;
                    }

                    var p1X = this.reader.getFloat(grandChildren[j], 'xx');
                    var p1Y = this.reader.getFloat(grandChildren[j], 'yy');
                    var p1Z = this.reader.getFloat(grandChildren[j], 'zz');

                    points.push([p1X, p1Y, p1Z]);
                    numControlPoints++;
                }

                if(numControlPoints < 2){
                    this.onXMLError("Cannot define linear animation of id " + animationsId + " with less than 2 control poins.");
                }

                anim = new LinearAnimation(this.scene, id, time, points);
            }

            if(children[i].nodeName == "circular"){
                var id = this.reader.getString(children[i], 'id');
                var time = this.reader.getFloat(children[i], 'span');
                var circleCoords = this.reader.getString(children[i], 'center').split(" ");
                circleCoords[0] = parseFloat(circleCoords[0]);
                circleCoords[1] = parseFloat(circleCoords[1]);
                circleCoords[2] = parseFloat(circleCoords[2]);
                var radius = this.reader.getFloat(children[i], 'radius');
                var initAngle = this.reader.getFloat(children[i], 'startang');
                var rotAngle = this.reader.getFloat(children[i], 'rotang');

                anim = new CircularAnimation(this.scene, id, time, circleCoords, radius, initAngle, rotAngle);
            }

            this.animations[animationsId] = anim;
        }

        console.log("Parsed animations");
        return null;
    }

    parsePrimitiveCoords(element, symbol, shape){
        var coordinate = this.reader.getFloat(element, symbol);
        if (!(coordinate != null && !isNaN(coordinate)))
            this.onXMLError("unable to parse " + symbol + " of " + shape);
        
        return coordinate;
    }

    isInt(n) {
        return n % 1 == 0;
    }

    parsePrimitiveCoordsInteger(element, symbol, shape){
        var coordinate = this.reader.getFloat(element, symbol);
        if (!(coordinate != null && this.isInt(coordinate)))
            this.onXMLError("unable to parse " + symbol + " of " + shape);
        
        return coordinate;
    }

    /**
     * Parses the <primitives> node.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {

        var children = primitivesNode.children;

        this.primitives = [];
        var numPrimitives = 0;

        for (var i = 0; i < children.length; i++) {

            if(children[i].nodeName != "primitive") 
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");

            else{
                var grandChildren = children[i].children;

                if(grandChildren.length < 1){
                    this.onXMLError("you must declare 1 primitive");
                    return null;
                }

                var primitiveId = this.reader.getString(children[i], 'id');

                if (primitiveId == null || (this.checkEqualId(children) == null))
                    return "no valid ID defined for primitive, cannot be null or repeated";

                else{

                    if(grandChildren.length > 1)
                        console.log("Too many primitives.");

                    else{

                        if(grandChildren[0].nodeName == "rectangle"){
                            
                            var x1 = this.parsePrimitiveCoords(grandChildren[0], 'x1', "rectangle");
                            var y1 = this.parsePrimitiveCoords(grandChildren[0], 'y1', "rectangle");
                            var x2 = this.parsePrimitiveCoords(grandChildren[0], 'x2', "rectangle");
                            var y2 = this.parsePrimitiveCoords(grandChildren[0], 'y2', "rectangle");

                            var rectangle = new MyRectangle(this.scene, primitiveId, x1, y1, x2, y2);

                            this.primitives[primitiveId] = rectangle;
                        }

                        if(grandChildren[0].nodeName == "triangle"){

                            var x1 = this.parsePrimitiveCoords(grandChildren[0], 'x1', "triangle");
                            var x2 = this.parsePrimitiveCoords(grandChildren[0], 'x2', "triangle");
                            var x3 = this.parsePrimitiveCoords(grandChildren[0], 'x3', "triangle");
                            var y1 = this.parsePrimitiveCoords(grandChildren[0], 'y1', "triangle");
                            var y2 = this.parsePrimitiveCoords(grandChildren[0], 'y2', "triangle");
                            var y3 = this.parsePrimitiveCoords(grandChildren[0], 'y3', "triangle");
                            var z1 = this.parsePrimitiveCoords(grandChildren[0], 'z1', "triangle");
                            var z2 = this.parsePrimitiveCoords(grandChildren[0], 'z2', "triangle");
                            var z3 = this.parsePrimitiveCoords(grandChildren[0], 'z3', "triangle");


                            var triangle = new MyTriangle(this.scene, primitiveId, x1, y1, z1, x2, y2, z2, x3, y3, z3);
                            this.primitives[primitiveId] = triangle;
                        }

                        if(grandChildren[0].nodeName == "sphere"){

                            var radius = this.parsePrimitiveCoords(grandChildren[0], 'radius', "sphere");
                            var slices = this.parsePrimitiveCoordsInteger(grandChildren[0], "slices", "sphere");
                            var stacks = this.parsePrimitiveCoordsInteger(grandChildren[0], "stacks", "sphere");

                            var sphere = new MySphere(this.scene, primitiveId, slices, stacks, radius);
                            this.primitives[primitiveId] = sphere;
                        }

                        if(grandChildren[0].nodeName == "cylinder"){

                            var base = this.parsePrimitiveCoords(grandChildren[0], 'base', "cylinder");
                            var top = this.parsePrimitiveCoords(grandChildren[0], 'top', "cylinder");
                            var height = this.parsePrimitiveCoords(grandChildren[0], 'height', "cylinder");
                            var slices = this.parsePrimitiveCoordsInteger(grandChildren[0], "slices", "cylinder");
                            var stacks = this.parsePrimitiveCoordsInteger(grandChildren[0], "stacks", "cylinder");

                            var cylinder = new MyCylinder(this.scene, primitiveId, slices, stacks, base, top, height);
                            this.primitives[primitiveId] = cylinder;
                        }

                        if(grandChildren[0].nodeName == "cylinder2"){

                            var base = this.parsePrimitiveCoords(grandChildren[0], 'base', "cylinder2");
                            var top = this.parsePrimitiveCoords(grandChildren[0], 'top', "cylinder2");
                            var height = this.parsePrimitiveCoords(grandChildren[0], 'height', "cylinder2");
                            var slices = this.parsePrimitiveCoordsInteger(grandChildren[0], "slices", "cylinder2");
                            var stacks = this.parsePrimitiveCoordsInteger(grandChildren[0], "stacks", "cylinder2");

                            var cylinder2 = new MyNurbsCylinder(this.scene, primitiveId, slices, stacks, base, top, height);
                            this.primitives[primitiveId] = cylinder2;
                        }

                        if(grandChildren[0].nodeName == "vehicle"){
                            var myVehicle = new MyVehicle(this.scene);
                            this.primitives[primitiveId] = myVehicle;
                        }

                        if(grandChildren[0].nodeName == "torus"){

                            var inner = this.parsePrimitiveCoords(grandChildren[0], 'inner', "torus");
                            var outer = this.parsePrimitiveCoords(grandChildren[0], 'outer', "torus");
                            var loops = this.parsePrimitiveCoordsInteger(grandChildren[0], 'loops', "torus");
                            var slices = this.parsePrimitiveCoordsInteger(grandChildren[0], "slices", "torus");

                            var torus = new MyTorus(this.scene, primitiveId, inner, outer, loops, slices);
                            this.primitives[primitiveId] = torus;
                        }

                        if(grandChildren[0].nodeName == "plane"){

                            var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
                            if (!(npartsU != null && this.isInt(npartsU)))
                                this.onXMLError("unable to parse npartsU of " + primitiveId);

                            var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
                            if (!(npartsV != null && this.isInt(npartsV)))
                                this.onXMLError("unable to parse npartsU of " + primitiveId);

                            var plane = new MyPlane(this.scene, primitiveId, npartsU, npartsV);
                            this.primitives[primitiveId] = plane;
                        }

                        if(grandChildren[0].nodeName == "patch"){

                            var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');

                            if (!(npartsU != null && this.isInt(npartsU)))
                                this.onXMLError("unable to parse npartsU of " + primitiveId);

                            var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');

                            if (!(npartsV != null && this.isInt(npartsV)))
                                this.onXMLError("unable to parse npartsU of " + primitiveId);

                            var npointsU = this.reader.getFloat(grandChildren[0], 'npointsU');

                            if (!(npointsU != null && this.isInt(npointsU)))
                                this.onXMLError("unable to parse npartsU of " + primitiveId);

                            var npointsV = this.reader.getFloat(grandChildren[0], 'npointsV');

                            if (!(npointsV != null && this.isInt(npointsV)))
                                this.onXMLError("unable to parse npartsU of " + primitiveId);

                            var xx = 0;
                            var yy = 0;
                            var zz = 0;
                            var controlPoints = [];
                            var numControlPoints = 0;

                            var greatGrandChildren = grandChildren[0].children;
                            
                            for(var z = 0; z < greatGrandChildren.length; z++){
                                xx = this.reader.getFloat(greatGrandChildren[z], 'xx');
                                yy = this.reader.getFloat(greatGrandChildren[z], 'yy');
                                zz = this.reader.getFloat(greatGrandChildren[z], 'zz');

                                controlPoints.push([xx, yy, zz]);
                                numControlPoints++;
                            }

                            if(numControlPoints < npointsU * npointsV || numControlPoints < 2){
                                this.onXMLError("Not enough control points declared, expected " + (npointsU*npointsV) + " but was " + numControlPoints + " for patch named " + primitiveId);
                                return;
                            } 

                            var patch = new MyPatch(this.scene, npointsU, npointsV, npartsU, npartsV, controlPoints);
                            this.primitives[primitiveId] = patch;
                        }

                        if(grandChildren[0].nodeName == "terrain"){

                            var idtexture = this.reader.getString(grandChildren[0], 'idtexture');
                            var idheightmap = this.reader.getString(grandChildren[0], 'idheightmap');
                            var parts = this.reader.getFloat(grandChildren[0], 'parts');
                            var heightscale = this.reader.getFloat(grandChildren[0], 'heightscale');

                            var terrain = new Terrain(this.scene, idtexture, idheightmap, parts, heightscale);
                            this.primitives[primitiveId] = terrain;
                        }

                        if(grandChildren[0].nodeName == "water"){

                            var idtexture = this.reader.getString(grandChildren[0], 'idtexture');
                            var idwavemap = this.reader.getString(grandChildren[0], 'idwavemap');
                            var parts = this.reader.getFloat(grandChildren[0], 'parts');
                            var heightscale = this.reader.getFloat(grandChildren[0], 'heightscale');
                            var texscale = this.reader.getFloat(grandChildren[0], 'texscale');

                            var water = new Water(this.scene, idtexture, idwavemap, parts, heightscale, texscale);
                            this.primitives[primitiveId] = water;
                        }

                        if(grandChildren[0].nodeName == "cells"){
                            var cells = new TransparentCells(this.scene, this.scene.game);
                            this.primitives[primitiveId] = cells;
                        }
                        
                    }

                }

            }
            
            numPrimitives++;
        }

        if(numPrimitives == 0)
            this.onXMLMinorError("at least one Primitive must be defined");

        console.log("Parsed primitives");
        return null;
    }

    checkIfReferenceExists(reference, arrayWhereReferenceIsSupposedToBe){
        if(arrayWhereReferenceIsSupposedToBe[reference] != null){
            return 1;
        }
        
        else{
            return 0;
        }
    }

    parseComponentTransformation(subNodeTransformation){
        
        var children = subNodeTransformation.children;
        var transformationrefId = null;

        var mat = mat4.create();
        
        for(var j = 0; j < children.length; j++){

            if(children[j].nodeName != "translate" && children[j].nodeName != "rotate" && children[j].nodeName != "scale" && children[j].nodeName != "transformationref"){
                this.onXMLError("unkown tag < " + children[j].nodeName +" >.");
                continue;
            }

            //If Transformation is a Reference
            
            if(children[j].nodeName == "transformationref"){
                transformationrefId = this.reader.getString(children[j], "id");
                
                if(transformationrefId == null){
                    this.onXMLError("invalid transformationref!");
                    return null;
                }

                if(!(this.checkIfReferenceExists(transformationrefId, this.transformations))){
                    this.onXMLError("reference doesn't point to any known transformation: " + transformationrefId);
                    return null;
                }

                return transformationrefId;
            }

            //If trasnformation is specific

            else {
                
                if(children[j].nodeName == "translate"){
                    mat4.translate(mat, mat, this.parseCoordinates(children[j]));
                }

                if(children[j].nodeName == "rotate"){
                    var axis = this.reader.getString(children[j], "axis");

                    if(axis == null || (axis != "x" && axis != "y" && axis != "z")){
                        this.onXMLError("Axis wrongly declared, must be x, y or z for component");
                        return null;
                    }
        
                    var angle = this.reader.getFloat(children[j], "angle");
                    if(angle == null || isNaN(angle)){
                        this.onXMLError("invalid angle for component");
                        return null;
                    }
        
                    if(axis == 'x'){
                        mat4.rotate(mat, mat, angle*DEGREE_TO_RAD, [1, 0, 0]);
                    }
    
                    if(axis == 'y'){
                        mat4.rotate(mat, mat, angle*DEGREE_TO_RAD, [0, 1, 0]);
                    }
    
                    if(axis == 'z'){
                        mat4.rotate(mat, mat, angle*DEGREE_TO_RAD, [0, 0, 1]);
                    }
                }

                if(children[j].nodeName == "scale"){
                    mat4.scale(mat, mat, this.parseCoordinates(children[j]));
                }
            }
        }

        return mat;
    }

    parseComponentMaterial(subNodeMaterial){
        var children = subNodeMaterial.children;
        var materialId = [];

        for (var i = 0; i < children.length; i++) {
            // Check the tag name in materials
            if(children[i].nodeName != "material") 
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
            else{
                var matID = this.reader.getString(children[i], 'id');

                if (matID == null)
                    return "no ID defined for material";

                if(this.materials[matID] == null && matID != "inherit"){
                    this.onXMLError("No material that is declared exists: " + matID);
                    return null;
                }

                materialId.push(matID);

                if(this.matID == "inherit"){
                    break;
                }
            }
        }

        return materialId;
    }

    parseComponentTextures(subNodeTextures){

        var textures = [];
        
        var textureId = this.reader.getString(subNodeTextures, "id");
        if(textureId == null){
            this.onXMLError("Null texture id for component");
            return null;
        }

        var length_s = this.reader.getFloat(subNodeTextures, "length_s");
        if(length_s == null || isNaN(length_s)){
            this.onXMLMinorError("Length_s invalid");
        }

        var length_t = this.reader.getFloat(subNodeTextures, "length_t");
        if(length_t == null || isNaN(length_t)){
            this.onXMLMinorError("Length_t invalid");
        }

        if(textureId != "inherit" && textureId != "none" && this.textures[textureId] == null){
            this.onXMLMinorError("There is no texture declared for the reference: " + textureId);
        }

        textures.push(textureId, length_s, length_t);

        return textures;
    }

    parseComponentAnimation(subNodeAnimation){
        var children = subNodeAnimation.children;
        var animations = [];

        for (var i = 0; i < children.length; i++) {
        
            if(children[i].nodeName != "animationref") 
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");

            else{
                var animID = this.reader.getString(children[i], 'id');

                if (animID == null){
                    this.onXMLError("no ID defined for animation");
                    return null;
                }

                if(this.animations[animID] == null){
                    this.onXMLError("No animation that is declared exists: " + animID);
                    return null;
                }

                animations.push(animID);
            }
        }

        return animations;
    }
    
    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {

        var children = componentsNode.children;

        this.components = [];

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component")
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");

            else {
                var grandChildren = children[i].children
                var componentId = this.reader.getString(children[i], 'id');

                if (componentId == null)
                    return "no ID defined for component";

                // Checks for repeated IDs.
                if (this.components[componentId] != null)
                    return "ID must be unique for each component (conflict: ID = " + componentId + ")";

                else {

                    var primitiveChildren = [];
                    var componentChildren = [];
                    var transformations = null;
                    var textures = [];
                    var materials = [];
                    var animations = [];
                    var primOrCompRefId = null;

                    for (var j = 0; j < grandChildren.length; j++) {

                        if(grandChildren[j].nodeName == "transformation"){
                            //get all  transformations & transf_REF in <Transformations> section
                            transformations = this.parseComponentTransformation(grandChildren[j]);
                        }

                        if(grandChildren[j].nodeName == "materials"){
                            materials = this.parseComponentMaterial(grandChildren[j]);
                        }

                        if(grandChildren[j].nodeName == "texture"){
                            textures = this.parseComponentTextures(grandChildren[j]);
                        }

                        if(grandChildren[j].nodeName == "texture"){
                            textures = this.parseComponentTextures(grandChildren[j]);
                        }

                        if(grandChildren[j].nodeName == "animations"){
                            animations = this.parseComponentAnimation(grandChildren[j]);
                        }

                        if (grandChildren[j].nodeName == "children"){
                            if (grandChildren[j].children.length < 1)
                                this.onXMLMinorError("there must exist more than 1 reference.");

                            else {
                               
                                if(this.checkEqualId(grandChildren[j].children) == null){
                                    this.onXMLError("two children have the same ID for component " + componentId);
                                    return null;
                                }

                                var greatGrandChildren = grandChildren[j].children;

                                for(var k = 0; k < greatGrandChildren.length; k++){
                                    if(greatGrandChildren[k].nodeName != "primitiveref" && greatGrandChildren[k].nodeName != "componentref"){
                                        this.onXMLError("Unkown tag < " + greatGrandChildren[k].nodeName + ">.");
                                        return null;
                                    }

                                    primOrCompRefId = this.reader.getString(greatGrandChildren[k], "id");

                                    if(primOrCompRefId == null){
                                        this.onXMLError("Null reference for component child.");
                                        return null;
                                    }

                                    if(greatGrandChildren[k].nodeName == "primitiveref"){
                                        
                                        if(!(this.checkIfReferenceExists(primOrCompRefId, this.primitives))){
                                            this.onXMLError("Invalid primitive reference " + primOrCompRefId);
                                            return null;
                                        }

                                        primitiveChildren.push(primOrCompRefId);
                                    }

                                    else if(greatGrandChildren[k].nodeName == "componentref"){
                                        componentChildren.push(primOrCompRefId) ;
                                    }
                                }

                                var component = new Component(this.scene, componentId, transformations, materials, textures, animations, primitiveChildren, componentChildren);
                                this.components[componentId] = component;
                                this.componentIds.push(componentId);
                            }
                        }

                    }

                }
            }
        }

        console.log("Parsed components");
        return null;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    checkIfKeyMPressed() {
        if (this.scene.gui.isKeyPressed("KeyM")) {
            this.swapMaterial = true;
        }
    }

    highLightCells(cellCoords, action){
        this.primitives["myCells"].highLight(cellCoords, action);
    }

    setPieceAnimations(pieceRow, pieceColumn, newRow, newColumn, color){
        this.primitives["myCells"].setPieceAnimation(pieceRow, pieceColumn, newRow, newColumn, color);
    }

    setCannonAnimation(pieceRow, pieceColumn){
        this.primitives["myCells"].setCannonAnimation(pieceRow, pieceColumn);
    }

    giveRedPlayerAPiece(){
        this.primitives["myCells"].giveRedPlayerAPiece();
    }

    giveBlackPlayerAPiece(){
        this.primitives["myCells"].giveBlackPlayerAPiece();
    }

    takePieceRed(){
        this.primitives["myCells"].takePieceRed();
    }

    takePieceBlack(){
        this.primitives["myCells"].takePieceBlack();
    }


    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene(game) {

        this.checkIfKeyMPressed();

        if(this.swapMaterial){

            for(var i = 0; i < this.componentIds.length; i++){
                this.components[this.componentIds[i]].incrementIndex();
            }

            this.swapMaterial = false;
        }

        this.components[this.idRoot].display(game.getBoard());
    }
}