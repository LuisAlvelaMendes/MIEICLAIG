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

        this.highlightAppearance = new CGFappearance(this.scene);
        this.highlightAppearance.setAmbient(0.3, 1, 1, 1);
        this.highlightAppearance.setDiffuse(1, 0.2, 1, 1);
        this.highlightAppearance.setSpecular(1, 0.1, 0.1, 1);

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

            if(action == "paint"){
                this.objects[index].setMaterial(this.highlightAppearance);
            }

            else {
                this.objects[index].setMaterial(this.scene.materialDefault);
            }

        }
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
