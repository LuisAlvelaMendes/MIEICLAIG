/**
/**
 * TransparentCells
 * @constructor
 */
class TransparentCells extends CGFobject
{
	constructor(scene, cannon) 
	{
        super(scene);
        this.scene = scene;
        this.pieces = [];
        this.animationEnabledRow = 0;
        this.animationEnabledColumn = 0;
        this.game = cannon;
		this.initBuffers();    
	};

	initBuffers() 
	{	
        this.redAppearance = new CGFappearance(this.scene);
        this.redAppearance.loadTexture("scenes/images/pieceTexture.jpg");
        this.redAppearance.setAmbient(1, 1, 1, 1);
        this.redAppearance.setDiffuse(1, 1, 1, 1);

        this.blackAppearance = new CGFappearance(this.scene);
        this.blackAppearance.loadTexture("scenes/images/pieceTexture2.jpg");
        this.blackAppearance.setAmbient(1, 1, 1, 1);
        this.blackAppearance.setDiffuse(1, 1, 1, 1);

        this.highlightAppearanceMove = new CGFappearance(this.scene);
        this.highlightAppearanceMove.setAmbient(0.3, 1, 1, 1);
        this.highlightAppearanceMove.setDiffuse(1, 0.2, 1, 1);
        this.highlightAppearanceMove.setSpecular(1, 0.1, 0.1, 1);

        this.highlightAppearanceCapture = new CGFappearance(this.scene);
        this.highlightAppearanceCapture.setAmbient(1, 0.3, 1, 1);
        this.highlightAppearanceCapture.setDiffuse(1, 1, 0.2, 1);
        this.highlightAppearanceCapture.setSpecular(0.1, 1, 0.1, 1);

        this.highlightAppearanceCannon = new CGFappearance(this.scene);
        this.highlightAppearanceCannon.setAmbient(1, 1, 0.3, 1);
        this.highlightAppearanceCannon.setDiffuse(1, 1, 0.2, 1);
        this.highlightAppearanceCannon.setSpecular(0, 0, 1, 1);

        this.objects= [
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2),
            new MyPlane(this.scene, 'plane', 2, 2)
        ];

        this.piecesReserve = [
            new City(this.scene, 3, "redCityPiece", this.redAppearance),
            new City(this.scene, 4, "blackCityPiece", this.blackAppearance)
        ]

        this.redPlayerCapturedPieces = [];
        this.blackPlayerCapturedPieces = [];

    };

    giveRedPlayerAPiece(){
        this.redPlayerCapturedPieces.push(new Piece(this.scene, -1, "blackSoldier", this.blackAppearance));
    }

    giveBlackPlayerAPiece(){
        this.blackPlayerCapturedPieces.push(new Piece(this.scene, -1, "redSoldier", this.redAppearance));
    }

    updatePieces(board){

        var tempPieces = [];
        var waitForAnimationToFinish = false;

        if(this.pieces.length != 0){
            if(this.pieces[this.animationEnabledRow][this.animationEnabledColumn] != null && this.pieces[this.animationEnabledRow][this.animationEnabledColumn].animationEnabled == true){
                waitForAnimationToFinish = true;
            }
        }

        if(!waitForAnimationToFinish){

            this.game.transitionBackToMove();

            if(board.length != 0){
                for(var i = 0; i < 10; i++){
                    
                    var row = [];
    
                    for(var j = 0; j < 10; j++){
    
                        if(board[i][j] == "emptyCell"){
                            row.push(null);
                        }
    
                        else{
                            if(board[i][j] == "redSoldier"){
                                row.push(new Piece(this.scene, i*j, "redSoldier", this.redAppearance));
                            }
    
                            if(board[i][j] == "blackSoldier"){
                                row.push(new Piece(this.scene, i*j, "blackSoldier", this.blackAppearance));
                            }
    
                            if(board[i][j] == "redCityPiece"){
                                row.push(this.piecesReserve[0]);
                            }
    
                            if(board[i][j] == "blackCityPiece"){
                                row.push(this.piecesReserve[1]);
                            }
                        }
    
                    }
    
                    tempPieces.push(row);
                }
            }
    
            this.pieces = tempPieces;
        }

    }

    highLight(cellCoords, action){

        for(var i=0; i < cellCoords.length; i++){
            
            var row = cellCoords[i][0];
            var column = cellCoords[i][1];

            var index = (row*10) + column;

            if(action == "move"){
                this.objects[index].setMaterial(this.highlightAppearanceMove);
            }

            if(action == "capture"){
                this.objects[index].setMaterial(this.highlightAppearanceCapture);
            } 

            if(action == "cannon"){
                this.objects[index].setMaterial(this.highlightAppearanceCannon);
            } 

            if(action == "default"){
                this.objects[index].setMaterial(this.scene.materialDefault);
            }

        }
    }

    setPieceAnimation(pieceRow, pieceColumn, newRow, newColumn, color){

        var controlPoints = [];

        var index1 = (pieceRow*10) + pieceColumn;

        var index2 = (newRow*10) + (newColumn);

        var xDiff = Math.abs(this.objects[index1].coordsX - this.objects[index2].coordsX);
        var zDiff = this.objects[index1].coordsZ - this.objects[index2].coordsZ;

        if(xDiff == 0 && zDiff < 0){
            zDiff = zDiff - 3;
        }

        if(xDiff == 0 && zDiff > 0){
            zDiff = zDiff + 3;
        }

        if(Math.round(xDiff) == 3 && zDiff == 0){
            xDiff = -9;
        }

        if(Math.round(xDiff) == 3 && zDiff < 0){
            xDiff = -6;
            zDiff = zDiff - 3;
        }

        if(Math.round(xDiff) == 3 && zDiff > 0){
            xDiff = -6;
            zDiff = zDiff + 3;
        }

        if(xDiff > 0 && Math.round(xDiff) != 3 && zDiff == 0){
            xDiff = xDiff + 3;
        }

        if(xDiff > 0 && Math.round(xDiff) != 3 && zDiff < 0){
            xDiff = xDiff + 3;
            zDiff = zDiff - 3;
        }

        if(xDiff < 0 && zDiff > 0){
            xDiff = xDiff - 3;
            zDiff = zDiff + 3;
        }

        if(xDiff > 0 && Math.round(xDiff) != 3 && zDiff > 0){
            xDiff = xDiff + 3;
            zDiff = zDiff + 3;
        }

        if(xDiff < 0 && zDiff < 0){
            xDiff = xDiff - 3;
            zDiff = zDiff - 3;
        }

        var point1 = vec3.fromValues(0,0,0);
        var point2 = vec3.fromValues(0,0,3);

        if(color == "red"){
            var point3 = vec3.fromValues(xDiff, zDiff, 3);
            var point4 = vec3.fromValues(xDiff, zDiff, 0.7);
        }

        if(color == "black"){
            var point3 = vec3.fromValues(-xDiff, zDiff, 3);
            var point4 = vec3.fromValues(-xDiff, zDiff, 0.7);
        }

        controlPoints = [point1, point2, point3, point4];

        this.animationEnabledRow = pieceRow;
        this.animationEnabledColumn = pieceColumn;

        this.pieces[pieceRow][pieceColumn].setAnimation(controlPoints);
    }

    setCannonAnimation(pieceRow, pieceColumn){
        this.animationEnabledRow = pieceRow;
        this.animationEnabledColumn = pieceColumn;
        this.pieces[pieceRow][pieceColumn].setCannonAnimation();
    }

    update(deltaTime){

        for(var i = 0; i < this.pieces.length; i++){
            for(var j = 0; j < this.pieces[i].length; j++){
                if(this.pieces[i][j] != null && this.pieces[i][j].animationEnabled == true){
                    this.pieces[i][j].update(deltaTime);
                }
            }
        }

    }

    display()
    {
        var xCoord = 3.44;
        var zCoord = 13.75;
        var objectIndex = 0;

        if(this.redPlayerCapturedPieces.length != 0){

            var yIncrement = 0;

            for(var i = 0; i < this.redPlayerCapturedPieces.length; i++){
                this.scene.pushMatrix();
                this.scene.translate(3.44, -0.56+yIncrement, 15.75);
                this.redPlayerCapturedPieces[i].display();
                this.scene.popMatrix();

                yIncrement += 0.6;
            }
        }

        if(this.blackPlayerCapturedPieces.length != 0){

            var yIncrement = 0;

            for(var i = 0; i < this.blackPlayerCapturedPieces.length; i++){
                this.scene.pushMatrix();
                this.scene.translate(16.75, -0.56+yIncrement, -2.5);
                this.blackPlayerCapturedPieces[i].display();
                this.scene.popMatrix();

                yIncrement += 0.6;
            }
        }

        for(var i = 0; i < 10; i++){

            for(var j = 0; j < 10; j++){
                this.scene.pushMatrix();

                this.scene.translate(xCoord, -0.56 , zCoord);
                this.scene.registerForPick(objectIndex+1, this.objects[objectIndex]);

                if(this.pieces.length != 0){
                    if(this.pieces[i][j] != null){
                        this.scene.pushMatrix();
                        this.pieces[i][j].display();
                        this.scene.popMatrix();
                    }
                }

                // set coords in objects, obtain object coords in function of their row and column and then make the control points.
                this.objects[objectIndex].setCoords(xCoord, zCoord);
                this.objects[objectIndex].material.apply();
                this.objects[objectIndex].display();

                this.scene.popMatrix();
                zCoord -= 1.56;

                objectIndex++;
            }

            xCoord += 1.5;
            zCoord = 13.75;
        }

    };


	resetCoords(){

	}
	
	scaleTextureCoords(lengthS, lengthT){

	};

};
