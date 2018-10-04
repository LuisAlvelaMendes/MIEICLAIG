var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

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

        // Default camera coordinates:
        this.near = 0.1;
        this.far = 500;

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

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

            //Parse MATERIALS block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse MATERIALS block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse NODES block
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

        this.log("x = " + x + " y = " + y + " z = " + z);

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
            this.default = this.reader.getString(viewNode, 'default');
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

                singleView.push(Id, near, far, angle, from, to);
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
                
                singleView.push(Id, near, far, left, right, top, bottom);
            }

            this.views.push(singleView);
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

        this.log("r = " + r + " g = " + g + " b = " + b + " a = " + a);

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
     * Checks if the light ID is already in the <lights> block or not
     * @param {*} children 
     * @param {*} lightID 
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

            if(children[i].nodeName == "spot"){
               
                var angle = this.reader.getFloat(children[i], 'angle');
                if(angle == null || isNaN(angle)){
                    this.onXMLError("Angle is null for light of id " + lightId);
                    return null;
                }
               
                var exponent = this.reader.getFloat(children[i], 'exponent');
                if(exponent == null || isNaN(exponent)){
                    this.onXMLError("Exponent is null for " + lightId);
                    return null;
                }

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
                    this.onXMLError("unable to parse x-coordinate of the light position for ID = " + lightId);
                    return null;
                }
                else
                    positionLight.push(w);
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

            // TODO: Retrieve the diffuse component
            var diffuseIllumination = [];
            if (diffuseIndex != -1){
                diffuseIllumination = this.rgbParser(grandChildren, diffuseIndex);
            }

            // TODO: Retrieve the specular component
            var specularIllumination = [];
            if (specularIndex != -1){
                specularIllumination = this.rgbParser(grandChildren, specularIndex);
            }

            if(children[i].nodeName == "spot"){
                var targetIndex = nodeNames.indexOf("target");
                
                var target = [];

                target = this.parseCoordinates(grandChildren[targetIndex]);

                singleLight.push(enableLight, angle, exponent, target, positionLight, ambientIllumination, diffuseIllumination, specularIllumination);
            }
            
            else{
                singleLight.push(enableLight, positionLight, ambientIllumination, diffuseIllumination, specularIllumination);
            }

            // TODO: Store Light global information.
            this.lights[lightId] = singleLight;
            numLights++;
        }

        if (numLights == 0)
           this.onXMLMinorError("At least one light must be defined");
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");0

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
                return null;
            }

            var file = this.reader.getString(children[i], "file");

            if(file == null){
                this.onXMLError("no file defined for texture");
                return null;
            }

            console.log("Parsed texture id " + textureId + " and file " + file + ".");
            this.textures.push(textureId, file);
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
                else
                    console.log("Material ID is right.")

                var materialShi = this.reader.getFloat(children[i], 'shininess');
                if (materialShi == null){
                    return "no shininess defined for material";
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

                this.materials.push(materialId, materialShi, emission, ambient, diffuse, specular);
                numMaterials++;
            }
        }

        // Check number Materials
        if(numMaterials == 0)
            this.onXMLMinorError("at least one Material must be defined");
        else if (numMaterials > 8)
            this.onXMLMinorError("too many Materials defined; WebGL imposes a limit of 8 materials");

        this.log("Parsed materials");
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
        var translation = [];
        var rotation = [];
        var scale = [];

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
                return null;
            }

            var grandChildren = children[i].children;

            if(grandChildren.length < 1){
                this.onXMLError("There must be at least one transformation declared");
                return null;
            }

            this.transformations.push(transformationId);
            numTransformations++;

            for(var j = 0; j < grandChildren.length; j++){

                if(grandChildren[j].nodeName != "translate" && grandChildren[j].nodeName != "rotate" && grandChildren[j].nodeName != "scale"){
                    this.onXMLError("unkown tag < " + grandChildren[j].nodeName +" >.");
                    continue;
                }
                
                if(grandChildren[j].nodeName == "translate"){
                    translation = this.parseCoordinates(grandChildren[j]);
                    this.transformations.push(translation);
                }

                if(grandChildren[j].nodeName == "rotate"){
                    var axis = this.reader.getString(grandChildren[j], "axis");
    
                    if(axis == null || (axis != "x" && axis != "y" && axis != "z")){
                        this.onXMLError("Axis wrongly declared, must be x, y or z for transformation: " + transformationId);
                        return null;
                    }

                    console.log("axis: " + axis);
        
                    var angle = this.reader.getFloat(grandChildren[j], "angle");
                    if(angle == null || isNaN(angle)){
                        this.onXMLError("invalid angle for transformation " + transformationId);
                        return null;
                    }

                    console.log("angle: " + angle);
        
                    rotation.push(axis, angle);

                    this.transformations.push(rotation);
                }

                if(grandChildren[j].nodeName == "scale"){
                    scale = this.parseCoordinates(grandChildren[j]);
                    this.transformations.push(scale);
                }
            }
        }

        if(numTransformations == 0){
            this.onXMLError("There must at least be one transformation declared.");
            return null;
        }

        this.log("Parsed transformations");
        return null;
    }

    parsePrimitiveCoords(element, symbol, shape){
        var coordinate = this.reader.getFloat(element, symbol);
        if (!(coordinate != null && !isNaN(coordinate)))
            this.onXMLError("unable to parse " + symbol + " of " + shape);
        
        return coordinate;
    }

    parsePrimitiveCoordsInteger(element, symbol, shape){
        var coordinate = this.reader.getFloat(element, symbol);
        if (!(coordinate != null && isInt(coordinate)))
            this.onXMLError("unable to parse " + symbol + " of " + shape);
        
        return coordinate;
    }

    isInt(n) {
        return n % 1 == 0;
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

            // Check the tag name in materials
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

                    //this.primitives.push(primitiveId);

                    if(grandChildren.length > 1)
                        console.log("Too many primitives.");

                    else{

                        if(grandChildren[0].nodeName == "rectangle"){
                            console.log("Looking for rectangle.");

                            var x1 = this.parsePrimitiveCoords(grandChildren[0], 'x1', "rectangle");
                            var x2 = this.parsePrimitiveCoords(grandChildren[0], 'y1', "rectangle");
                            var y1 = this.parsePrimitiveCoords(grandChildren[0], 'y1', "rectangle");
                            var y2 = this.parsePrimitiveCoords(grandChildren[0], 'y2', "rectangle");

                            this.rectangle = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                            console.log("x1 = " + x1 + " x2 = " + x2 + " y1 = " + y1 + " y2 = " + y2);
                            this.primitives[primitiveId] = this.rectangle;
                        }

                        if(grandChildren[0].nodeName == "triangle"){
                            console.log("Triangle");

                            var triangleCoords = [];

                            var x1 = this.parsePrimitiveCoords(grandChildren[0], 'x1', "triangle");
                            var x2 = this.parsePrimitiveCoords(grandChildren[0], 'x2', "triangle");
                            var x3 = this.parsePrimitiveCoords(grandChildren[0], 'x3', "triangle");
                            var y1 = this.parsePrimitiveCoords(grandChildren[0], 'y1', "triangle");
                            var y2 = this.parsePrimitiveCoords(grandChildren[0], 'y2', "triangle");
                            var y3 = this.parsePrimitiveCoords(grandChildren[0], 'y3', "triangle");
                            var z1 = this.parsePrimitiveCoords(grandChildren[0], 'z1', "triangle");
                            var z2 = this.parsePrimitiveCoords(grandChildren[0], 'z2', "triangle");
                            var z3 = this.parsePrimitiveCoords(grandChildren[0], 'z3', "triangle");

                            triangleCoords.push(x1, x2, x3, y1, y2, y3, z1, z2, z3);
                            this.primitives.push(triangleCoords);
                        }

                        if(grandChildren[0].nodeName == "sphere"){
                            console.log("Sphere");

                            var sphereCoords = [];

                            var radius = this.parsePrimitiveCoords(grandChildren[0], 'radius', "sphere");
                            var slices = this.parseCoordinatesInteger(grandChildren[0], "slices", "sphere");
                            var stacks = this.parseCoordinatesInteger(grandChildren[0], "stacks", "sphere");

                            sphereCoords.push(radius, slices, stacks);
                            this.primitives.push(sphereCoords);
                        }

                        if(grandChildren[0].nodeName == "cylinder base"){
                            console.log("Cylinder Base");

                            var cylinderCoords = [];

                            var base = this.parsePrimitiveCoords(grandChildren[0], 'base', "sphere");
                            var top = this.parsePrimitiveCoords(grandChildren[0], 'top', "sphere");
                            var height = this.parsePrimitiveCoords(grandChildren[0], 'height', "sphere");
                            var slices = this.parseCoordinatesInteger(grandChildren[0], "slices", "sphere");
                            var stacks = this.parseCoordinatesInteger(grandChildren[0], "stacks", "sphere");

                            cylinderCoords.push(base, top, height, slices, stacks);
                            this.primitives.push(cylinderCoords);
                        }
                    }
                }
            }

            numPrimitives++;
        }

        if(numPrimitives == 0)
            this.onXMLMinorError("at least one Primitive must be defined");

        this.log("Parsed primitives");
        return null;
    }

    parseComponentTransformation(subNodeTransformation){
        
        var children = subNodeTransformation.children;
        var translation = [];
        var rotation = [];
        var scale = [];
        var transformations = [];
        var transformationrefId = null;
        
        for(var j = 0; j < children.length; j++){

            if(children[j].nodeName != "translate" && children[j].nodeName != "rotate" && children[j].nodeName != "scale" && children[j].nodeName != "transformationref"){
                this.onXMLError("unkown tag < " + children[j].nodeName +" >.");
                continue;
            }

            if(children[j].nodeName == "transformationref"){
                transformationrefId = this.reader.getString(children[j], "id");
                
                if(transformationrefId == null){
                    this.onXMLError("invalid transformationref!");
                    return null;
                }

                transformations.push(transformationrefId);
            }
                
            if(children[j].nodeName == "translate"){
                translation = this.parseCoordinates(children[j]);
                transformations.push(translation);
            }

            if(children[j].nodeName == "rotate"){
                var axis = this.reader.getString(children[j], "axis");

                if(axis == null || (axis != "x" && axis != "y" && axis != "z")){
                    this.onXMLError("Axis wrongly declared, must be x, y or z for component");
                    return null;
                }

                console.log("axis: " + axis);
    
                var angle = this.reader.getFloat(children[j], "angle");
                if(angle == null || isNaN(angle)){
                    this.onXMLError("invalid angle for component");
                    return null;
                }

                console.log("angle: " + angle);
    
                rotation.push(axis, angle);

                transformations.push(rotation);
            }

            if(children[j].nodeName == "scale"){
                scale = this.parseCoordinates(children[j]);
                transformations.push(scale);
            }
        }

        return transformations;
    }

    parseComponentMaterial(subNodeMaterial){
        var children = subNodeMaterial.children;

        var materials = [];
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
                else
                    console.log("Material ID is right.")

                var materialShi = this.reader.getFloat(children[i], 'shininess');
                if (materialShi == null){
                    return "no shininess defined for material";
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

                this.materials.push(materialId, materialShi, emission, ambient, diffuse, specular);
                numMaterials++;
            }
        }
        
        if(numMaterials == 0){
            this.onXMLError("you must declare a material for the materials block in components");
            return null;
        }

        return materials;
    }

    parseComponentTextures(subNodeTextures){

        var textures = [];
        
        var textureId = this.reader.getString(subNodeTextures, "id");
        if(textureId == null){
            this.onXMLError("Null texture id for component");
            return null;
        }

        textures.push(textureId);

        var length_s = this.reader.getFloat(subNodeTextures, "length_s");
        if(length_s == null || isNaN(length_s)){
            this.onXMLError("Length_s invalid");
            return null;
        }

        textures.push(length_s);
     
        var length_t = this.reader.getFloat(subNodeTextures, "length_t");
        if(length_t == null || isNaN(length_t)){
            this.onXMLError("Length_t invalid");
            return null;
        }

        textures.push(length_t);

        return textures;
    }
    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {

        var children = componentsNode.children;

        this.components = [];
        var transformations = [];
        var textures = [];
        var materials = [];
        var primOrCompRefId = null;
        var primitiveChildren = [];
        var componentChildren = [];

        for (var i = 0; i < children.length; i++) {

            // Check the tag name in materials
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

                    this.components.push(componentId);

                    for (var j = 0; j < grandChildren.length; j++) {

                        if(grandChildren[j].nodeName == "transformation"){
                            transformations = this.parseComponentTransformation(grandChildren[j]);
                            //this.components.push(transformations);
                        }

                        if(grandChildren[j].nodeName == "materials"){
                            materials = this.parseComponentMaterial(grandChildren[j]);
                            //this.components.push(materials);
                        }

                        if(grandChildren[j].nodeName == "texture"){
                            textures = this.parseComponentTextures(grandChildren[j]);
                            //this.components.push(textures);
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
                                        console.log("DEBUG 1: " + primOrCompRefId);
                                        primitiveChildren.push(primOrCompRefId);
                                    }

                                    else if(greatGrandChildren[k].nodeName == "componentref"){
                                        console.log("DEBUG 2: " + primOrCompRefId);
                                        componentChildren.push(primOrCompRefId);
                                    }
                                }

                                var component = new Component(this.scene, componentId, transformations, materials, textures, primitiveChildren, componentChildren, this.primitives, this.components, this.transformations);

                                this.components[componentId] = component;
                            }
                        }

                    }

                }
            }
        }

        this.log("Parsed components");
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

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
        this.components["comp1"].display();
    }
}

//TODO: Ver se é um warning ou return para terminar o programa
// entender melhor a função initLights()
// como fazer display