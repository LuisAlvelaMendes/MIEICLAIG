/**
/**
 * TransparentCells
 * @constructor
 */
class TransparentCells extends CGFobject
{
	constructor(scene) 
	{
        super(scene);
        this.scene = scene;
        this.pieces = [];
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
            new Piece(this.scene, 1, "redSoldier", this.redAppearance),
            new Piece(this.scene, 2, "blackSoldier", this.blackAppearance),
            new City(this.scene, 3, "redCityPiece", this.redAppearance),
            new City(this.scene, 4, "blackCityPiece", this.blackAppearance)
        ]

    };

    updatePieces(board){

        var tempPieces = [];

        if(board.length != 0){
            for(var i = 0; i < 10; i++){
                
                var row = [];

                for(var j = 0; j < 10; j++){

                    if(board[i][j] == "emptyCell"){
                        row.push(null);
                    }

                    else{
                        if(board[i][j] == "redSoldier"){
                            row.push(this.piecesReserve[0]);
                        }

                        if(board[i][j] == "blackSoldier"){
                            row.push(this.piecesReserve[1]);
                        }

                        if(board[i][j] == "redCityPiece"){
                            row.push(this.piecesReserve[2]);
                        }

                        if(board[i][j] == "blackCityPiece"){
                            row.push(this.piecesReserve[3]);
                        }
                    }

                }

                tempPieces.push(row);
            }
        }

        this.pieces = tempPieces;
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

    setPieceAnimation(pieceRow, pieceColumn, newRow, newColumn){

        console.log(pieceRow);
        console.log(pieceColumn);

        var index1 = (pieceRow*10) + pieceColumn;
        console.log(index1);
        var coord1 = [this.objects[index1].coordsX, this.objects[index1].coordsY, this.objects[index1].coordsZ];

        var index2 = (newRow*10) + newColumn;
        var coord2 = [this.objects[index2].coordsX, this.objects[index2].coordsY, this.objects[index2].coordsZ];

        var controlPoints = [coord1, coord2];

        console.log(controlPoints);

        this.pieces[pieceRow][pieceColumn].setAnimation(controlPoints);
    }

    display()
    {
        var xCoord = 3.44;
        var zCoord = 13.75;
        var objectIndex = 0;

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
