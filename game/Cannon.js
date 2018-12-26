/**
 * Cannon
 * @constructor
 */
class Cannon
{
    constructor(scene) {
        console.log(" > Cannon: NEW GAME");
        
        this.scene = scene;

        this.client = new Client(scene);

        this.state = {
            WAITING_FOR_START:0,
            RED_PLAYER_PICK_CITY:1,
            BLACK_PLAYER_PICK_CITY:2,
            RED_PLAYER_TURN:3,
            RED_PLAYER_MOVE:4,
            BLACK_PLAYER_TURN:5,
            BLACK_PLAYER_MOVE:6,
            CANNON_MOVE:7,
            GAME_OVER:8
        };

        this.mode = {
            HUMAN_VS_HUMAN: 0,
            HUMAN_VS_COMPUTER: 1,
            COMPUTER_VS_COMPUTER: 2
        };

        this.board = [];
        this.moves = [];

        this.currentState = this.state.WAITING_FOR_START;

        this.cityRedSavedColumn;
        this.cityBlackSavedColumn;

        this.currentlySelectedRow;
        this.currentlySelectedColumn;

        this.validMoveCells;
        this.validCaptureCells = [];
        this.validCannons = [];
        this.validCannonCells;

        this.oldRow;
        this.oldColumn;

        this.newMoveRow;
        this.newMoveColumn;

        this.newCaptureRow;
        this.newCaputureColumn;

        this.cannonType;
        this.pieceNumber;
        this.cannonMovements;
        this.selectedCannonMove;
        this.playerUsingCannon;
        this.winner = "none";
    };

    start(gameMode, gameLevel) {

        if(this.currentState == this.state.WAITING_FOR_START){

            switch (gameMode) {
                case "Human vs Human":
                    this.gameMode = this.mode.HUMAN_VS_HUMAN;
                    this.currentState = this.state.RED_PLAYER_PICK_CITY;
                    break;
            }
    
        }

        this.getInitialBoard();
    };

    setVariables() {
        this.moves = [];
        this.player = 1;
        this.previousPlayer = 1;
    };

    parseResponseBoard(data){

        var responseReplaceString = data.replace(/emptyCell/g, '"emptyCell"');
        var responseReplaceString2 = responseReplaceString.replace(/redSoldier/g, '"redSoldier"');
        var responseReplaceString3 = responseReplaceString2.replace(/blackSoldier/g, '"blackSoldier"');
        var responseReplaceString4 = responseReplaceString3.replace(/redCityPiece/g, '"redCityPiece"');
        var responseReplaceString5 = responseReplaceString4.replace(/blackCityPiece/g, '"blackCityPiece"');
        
        this.board = JSON.parse(responseReplaceString5);
    };

    parseResponseCannon(data){
        var responseReplaceString = data.replace(/verticalCannon/g, '"verticalCannon"');
        var responseReplaceString2 = responseReplaceString.replace(/diagonalNWSECannon/g, '"diagonalNWSECannon"');
        var responseReplaceString3 = responseReplaceString2.replace(/diagonalSWNECannon/g, '"diagonalSWNECannon"');
        var responseReplaceString4 = responseReplaceString3.replace(/horizontalCannon/g, '"horizontalCannon"');

        return responseReplaceString4;
    }

    getInitialBoard() {

        var self = this;

        this.client.getPrologRequest(

            "initialBoard",

            function(data) {
                //onSuccess
                self.parseResponseBoard(data.target.response);
            },

            function() {
                //onError
                console.log(" > Cannon: ERROR! COULDN'T GET INITIAL BOARD");
            }

        );
    };

    getBoard(){
        return this.board;
    };

    parseBoardToPLOG(){
        var boardString = "";
        boardString = boardString + "[";
      
        for (let i = 0; i < this.board.length; i++) {
          boardString = boardString + "[";
      
          for (let j = 0; j < this.board[i].length; j++) {
            var elem = this.board[i][j];
      
            boardString = boardString + elem;
            if (j != this.board[i].length - 1) boardString = boardString + ",";
          }
      
          boardString = boardString + "]";
          if (i != this.board.length - 1) boardString = boardString + ",";
        }

        boardString = boardString + "]";

        return boardString;
    };

    checkIfValidMoveCell(row, column){

        var foundMatch = 0;

        for(var i = 0; i < this.validMoveCells.length; i++){
            
            var cellCoord = this.validMoveCells[i];

            if(row == cellCoord[0] && column == cellCoord[1]){
                foundMatch = 1;
                this.newMoveRow = row;
                this.newMoveColumn = column;
                return foundMatch;
            }
        }

        for(var i = 0; i < this.validCaptureCells.length; i++){
            
            var captureCoord = this.validCaptureCells[i];

            if(row == captureCoord[0] && column == captureCoord[1]){
                foundMatch = 2;
                this.newCaptureRow = row;
                this.newCaptureColumn = column;
                return foundMatch;
            }
        }

        for(var i = 0; i < this.validCannons.length; i++){
            
            var cannonExtremity = this.validCannons[i];

            if(row == cannonExtremity[2] && column == cannonExtremity[3]){
                foundMatch = 3;
                this.cannonType = cannonExtremity[0];
                this.pieceNumber = cannonExtremity[1];
                return foundMatch;
            }
        }

        return 0;
    }

    checkIfValidMoveCannon(row, column){

        var foundMatch = 0;

        for(var i = 0; i < this.cannonMovements.length; i++){

            if(row == this.cannonMovements[i][1] && column == this.cannonMovements[i][2]){
                foundMatch = 1;
                this.selectedCannonMove = this.cannonMovements[i][0];
                return foundMatch;
            }
        }

        for(var i = 0; i < this.validCaptureCells.length; i++){

            if(row == this.validCaptureCells[i][0] && column == this.validCaptureCells[i][1]){
                foundMatch = 2;
                this.newCaptureRow = row;
                this.newCaptureColumn = column;
                return foundMatch;
            }
        } 

        return 0;
    }

    selectedCell(row, column){
        this.currentlySelectedRow = row;
        this.currentlySelectedColumn = column;

        if(this.currentState == this.state.RED_PLAYER_PICK_CITY || this.currentState == this.state.BLACK_PLAYER_PICK_CITY){
            this.citySelect();
        }

        if(this.currentState == this.state.RED_PLAYER_TURN || this.currentState == this.state.BLACK_PLAYER_TURN){
            this.oldRow = row;
            this.oldColumn = column;
            this.selectPieceToMove();
        }

        if(this.currentState == this.state.RED_PLAYER_MOVE || this.currentState == this.state.BLACK_PLAYER_MOVE){
            if(this.checkIfValidMoveCell(row, column) == 1){
                this.movePiece(this.newMoveRow, this.newMoveColumn);
            }

            if(this.checkIfValidMoveCell(row, column) == 2){
                this.movePiece(this.newCaptureRow, this.newCaptureColumn);
            }

            if(this.checkIfValidMoveCell(row, column) == 3){
                this.moveCannon();
            }
        }

        if(this.currentState == this.state.CANNON_MOVE){
            if(this.checkIfValidMoveCannon(row, column) == 1){
                this.moveCannonDirection();
            }

            if(this.checkIfValidMoveCannon(row, column) == 2){
                this.captureCannonDirection(this.newCaptureRow, this.newCaptureColumn);
            }
        }

        if(this.currentState == this.state.GAME_OVER){
            console.log("GAME OVER!");
        }
    };

    citySelect() {
        var self = this;

        if(this.currentState ==  this.state.RED_PLAYER_PICK_CITY){

            var boardString = this.parseBoardToPLOG();
            var command = "placeCityRed(" + boardString + "," + this.currentlySelectedColumn + "," + this.currentlySelectedRow + ")";

            this.cityRedSavedColumn = this.currentlySelectedColumn;

            this.client.getPrologRequest(

                command,
    
                function(data) {
                    //onSuccess
                    self.parseResponseBoard(data.target.response);
                    self.currentState = self.state.BLACK_PLAYER_PICK_CITY;
                },
    
                function() {
                    //onError
                    console.log(" > Cannon: ERROR! COULDN'T SELECT CITY RED PLAYER");
                }
    
            );
        }
        
        if(this.currentState ==  this.state.BLACK_PLAYER_PICK_CITY){

            var boardString = this.parseBoardToPLOG();
            var command = "placeCityBlack(" + boardString + "," + this.currentlySelectedColumn + "," + this.currentlySelectedRow + ")";

            this.cityBlackSavedColumn = this.currentlySelectedColumn;

            this.client.getPrologRequest(

                command,
    
                function(data) {
                    //onSuccess
                    self.parseResponseBoard(data.target.response);
                    self.currentState = self.state.RED_PLAYER_TURN;
                },
    
                function() {
                    //onError
                    console.log(" > Cannon: ERROR! COULDN'T SELECT CITY BLACK PLAYER");
                }
    
            );
        }
    };

    formatCannonCells(possibleCannons, startingArray){

        for(var i = 0; i < possibleCannons.length; i++){
            var extremityCoords = [possibleCannons[i][2], possibleCannons[i][3]];
            startingArray.push(extremityCoords);
        }

        return startingArray;
    }

    selectPieceToUseCannon(player){
        var self = this;

        if(player == "redSoldier"){
            self.playerUsingCannon = "red";
        }

        else {
            self.playerUsingCannon = "black";
        }

        var boardString = this.parseBoardToPLOG();
        var command = "validatePieceCannon(" + boardString + "," + this.currentlySelectedColumn + "," + this.currentlySelectedRow + "," + player + ")";

        this.client.getPrologRequest(

            command,

            function(data) {
                //onSuccess
                var formattedResponse = self.parseResponseCannon(data.target.response);
                var possibleCannons = JSON.parse(formattedResponse);


                if(possibleCannons.length != 0){
                    self.validCannons = possibleCannons;
                    var temp = [[self.currentlySelectedRow, self.currentlySelectedColumn]];
                    self.validCannonCells = self.formatCannonCells(possibleCannons, temp);
                    self.scene.highLightCells(self.validCannonCells, "cannon");
                }
                
            },

            function() {
                //onError
                console.log(" > Cannon: ERROR! COULDN'T SELECT RED PLAYER");
            }

        );
        
    }
    
    selectPieceToCapture(){
        var self = this;

        var boardString = this.parseBoardToPLOG();
        var command = "validatePieceCapture(" + boardString + "," + this.currentlySelectedColumn + "," + this.currentlySelectedRow + ")";

        this.client.getPrologRequest(

            command,

            function(data) {
                //onSuccess
                var placesToCapture = JSON.parse(data.target.response);

                if(placesToCapture.length != 0){
                    self.validCaptureCells = placesToCapture;
                    self.scene.highLightCells(placesToCapture, "capture");
                }
                
            },

            function() {
                //onError
                console.log(" > Cannon: ERROR! COULDN'T SELECT RED PLAYER");
            }

        );
        
    }

    selectPieceToMove(){
        var self = this;

        if(this.currentState == this.state.RED_PLAYER_TURN){

            var boardString = this.parseBoardToPLOG();
            var command = "validatePiece(" + boardString + "," + this.currentlySelectedColumn + "," + this.currentlySelectedRow + "," + "red" + ")";

            this.client.getPrologRequest(

                command,
    
                function(data) {
                    //onSuccess

                    var placesToMove = JSON.parse(data.target.response);

                    self.validMoveCells = placesToMove;
                    self.scene.highLightCells(placesToMove, "move");

                    self.selectPieceToCapture();
                    
                    self.selectPieceToUseCannon("redSoldier");

                    self.currentState = self.state.RED_PLAYER_MOVE;
                },
    
                function() {
                    //onError
                    console.log(" > Cannon: ERROR! COULDN'T SELECT RED PLAYER");
                }
    
            );
        }

        if(this.currentState == this.state.BLACK_PLAYER_TURN){

            var boardString = this.parseBoardToPLOG();
            var command = "validatePiece(" + boardString + "," + this.currentlySelectedColumn + "," + this.currentlySelectedRow + "," + "black" +  ")";

            this.client.getPrologRequest(

                command,
    
                function(data) {
                    //onSuccess
                    var placesToMove = JSON.parse(data.target.response);
                    self.validMoveCells = placesToMove;
                    self.scene.highLightCells(placesToMove, "move");

                    self.selectPieceToCapture();

                    self.selectPieceToUseCannon("blackSoldier");

                    self.currentState = self.state.BLACK_PLAYER_MOVE;
                },
    
                function() {
                    //onError
                    console.log(" > Cannon: ERROR! COULDN'T SELECT BLACK PLAYER");
                }
    
            );
        }
    }

    gameOver(){
        var self = this;

        var boardString = this.parseBoardToPLOG();
        var command = "gameOver(" + this.cityRedSavedColumn + "," + this.cityBlackSavedColumn + "," + boardString + ")"; 

        this.client.getPrologRequest(
            command,

            function(data){

                console.log(data.target.response);

                if(data.target.response == "yesRed"){
                    self.winner = "Black";
                    self.currentState = self.state.GAME_OVER;
                }

                else if(data.target.response == "yesBlack"){
                    self.winner = "Red";
                    self.currentState = self.state.GAME_OVER;
                }
            },

            function() {
                //onError
                console.log(" > Cannon: ERROR! gameover");
            }
        );

        if(this.winner != "none"){
            return 1;
        }

        return 0;
    }

    movePiece(newRow, newColumn){
        var self = this;

        if(this.currentState == this.state.RED_PLAYER_MOVE){

            var boardString = this.parseBoardToPLOG();
            var command = "moveRedPiece(" + boardString + "," + this.oldRow + "," + this.oldColumn + "," + newRow + "," + newColumn + ")";

            this.client.getPrologRequest(

                command,
    
                function(data) {
                    //onSuccess
                    self.parseResponseBoard(data.target.response);
                    self.scene.highLightCells(self.validMoveCells, "default");
                    self.scene.highLightCells(self.validCaptureCells, "default");
                    console.log(self.validCannonCells);
                    self.scene.highLightCells(self.validCannonCells, "default");

                    if(!self.gameOver()){
                        self.currentState = self.state.BLACK_PLAYER_TURN;
                    }
                },
    
                function() {
                    //onError
                    console.log(" > Cannon: ERROR! COULDN'T SELECT RED PLAYER");
                }
    
            );
        }

        if(this.currentState == this.state.BLACK_PLAYER_MOVE){

            var boardString = this.parseBoardToPLOG();
            var command = "moveBlackPiece(" + boardString + "," + this.oldRow + "," + this.oldColumn + "," + newRow + "," + newColumn + ")";

            this.client.getPrologRequest(

                command,
    
                function(data) {
                    //onSuccess
                    self.parseResponseBoard(data.target.response);
                    self.scene.highLightCells(self.validMoveCells, "default");
                    self.scene.highLightCells(self.validCaptureCells, "default");
                    self.scene.highLightCells(self.validCannonCells, "default");
                    
                    if(!self.gameOver()){
                        self.currentState = self.state.RED_PLAYER_TURN;
                    }
                },
    
                function() {
                    //onError
                    console.log(" > Cannon: ERROR! COULDN'T SELECT BLACK PLAYER");
                }
    
            );
        }
    }

    captureCannon(){
        var self = this;
        var boardString = this.parseBoardToPLOG();        
        var command = "captureCannon(" + boardString + "," + this.validCannonCells[0][0] + "," + this.validCannonCells[0][1] + "," + this.cannonType + "," + this.pieceNumber +  ")";

        this.client.getPrologRequest(

            command,

            function(data) {
                //onSuccess

                var temp = JSON.parse(data.target.response);
                
                console.log(temp);

                if(temp.length != 0){
                    self.validCaptureCells = temp;
                    self.scene.highLightCells(self.validCaptureCells, "capture");
                }

            },

            function() {
                //onError
                console.log(" > Cannon: ERROR! COULDN'T SELECT CANNON");
            }

        );
    }

    moveCannon(){
        var self = this;
        var boardString = this.parseBoardToPLOG();
        var command = "moveCannon(" + boardString + "," + this.validCannonCells[0][0] + "," + this.validCannonCells[0][1] + "," + this.cannonType + "," + this.pieceNumber + ")";

        this.client.getPrologRequest(

            command,

            function(data) {
                //onSuccess
                self.scene.highLightCells(self.validMoveCells, "default");
                self.scene.highLightCells(self.validCaptureCells, "default");
                self.scene.highLightCells(self.validCannonCells, "default");

                var responseReplaceString = data.target.response.replace(/forward/g, '"forward"');
                var final = responseReplaceString.replace(/backward/g, '"backward"');

                var temp = JSON.parse(final);

                self.cannonMovements = temp;

                var validCells = [];

                for(var i = 0; i < temp.length; i++){
                    var coords = [temp[i][1], temp[i][2]];
                    validCells.push(coords);
                }

                if(validCells.length != 0){
                    self.validMoveCells = validCells;
                    self.scene.highLightCells(self.validMoveCells, "move");
                    self.captureCannon();
                    self.currentState = self.state.CANNON_MOVE;
                }

                else {
                    if(self.playerUsingCannon == "red"){
                        self.currentState = self.state.RED_PLAYER_TURN;
                    }
    
                    else {
                        self.currentState = self.state.BLACK_PLAYER_TURN;
                    }
                }
            },

            function() {
                //onError
                console.log(" > Cannon: ERROR! COULDN'T SELECT CANNON");
            }

        );
    }

    moveCannonDirection(){
        var self = this;
        var boardString = this.parseBoardToPLOG();

        var command = "moveCannonDirection(" + this.selectedCannonMove + "," + this.validCannonCells[0][0] + "," + this.validCannonCells[0][1] + "," + boardString + "," + this.cannonType + "," + this.pieceNumber + ")";

        this.client.getPrologRequest(

            command,

            function(data) {
                //onSuccess
                self.parseResponseBoard(data.target.response);
                self.scene.highLightCells(self.validMoveCells, "default");
                self.scene.highLightCells(self.validCaptureCells, "default");

                if(self.playerUsingCannon == "red"){
                    self.currentState = self.state.BLACK_PLAYER_TURN;
                }

                else {
                    self.currentState = self.state.RED_PLAYER_TURN;
                }
            },

            function() {
                //onError
                console.log(" > Cannon: ERROR! COULDN'T SELECT CANNON");
            }

        );
    }

    captureCannonDirection(){
        var self = this;
        var boardString = this.parseBoardToPLOG();

        var command = "captureCannonDirection(" + boardString + "," + this.newCaptureRow + "," + this.newCaptureColumn + ")";

        this.client.getPrologRequest(

            command,

            function(data) {
                //onSuccess
                self.parseResponseBoard(data.target.response);
                self.scene.highLightCells(self.validMoveCells, "default");
                self.scene.highLightCells(self.validCaptureCells, "default");

                if(!self.gameOver()){
                    if(self.playerUsingCannon == "red") {
                        self.currentState = self.state.BLACK_PLAYER_TURN;
                    }

                    else {
                        self.currentState = self.state.RED_PLAYER_TURN;
                    }
                }
            },

            function() {
                //onError
                console.log(" > Cannon: ERROR! COULDN'T SELECT CANNON");
            }

        );
    }

};
