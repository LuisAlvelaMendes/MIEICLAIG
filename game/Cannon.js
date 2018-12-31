var DEGREE_TO_RAD = (Math.PI / 180);
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
        
        this.rotationCamera = new CGFcamera(40*DEGREE_TO_RAD, 0.45, 500, vec3.fromValues(315.4, 110, 390), vec3.fromValues(250, 80, 390));
        this.defaultCamera = new CGFcamera(40*DEGREE_TO_RAD, 0.45, 500, vec3.fromValues(154, 110, 390), vec3.fromValues(250, 80, 390));    

        this.state = {
            WAITING_FOR_START:0,
            RED_PLAYER_PICK_CITY:1,
            BLACK_PLAYER_PICK_CITY:2,
            RED_PLAYER_TURN:3,
            RED_PLAYER_MOVE:4,
            BLACK_PLAYER_TURN:5,
            BLACK_PLAYER_MOVE:6,
            ANIMATION:7,
            CANNON_MOVE:8,
            GAME_OVER:9
        };

        this.currentCamera = "default";

        this.mode = {
            HUMAN_VS_HUMAN: 0,
            HUMAN_VS_COMPUTER: 1,
            COMPUTER_VS_COMPUTER: 2
        };

        this.level = {
            AGRESSIVE:0,
            EASY:1
        }

        this.board = [];
        this.moves = [];

        this.currentState = this.state.WAITING_FOR_START;
        this.previousState;

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

            switch (gameMode) {
                case "Human vs Computer":
                    this.gameMode = this.mode.HUMAN_VS_COMPUTER;

                    if(gameLevel == "easy"){
                        this.currentLevel = this.level.EASY;
                    }

                    if(gameLevel == "agressive"){
                        this.currentLevel = this.level.AGRESSIVE;
                    }

                    this.currentState = this.state.RED_PLAYER_PICK_CITY;
                    break;
            }

            switch (gameMode) {
                case "Computer vs Computer":
                    this.gameMode = this.mode.COMPUTER_VS_COMPUTER;
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

    transitionBackToMove(){

        if(this.previousState == this.state.RED_PLAYER_MOVE){
            this.currentState = this.state.BLACK_PLAYER_TURN;
            this.previousState = null;
            
            if(this.gameMode == this.mode.COMPUTER_VS_COMPUTER || this.gameMode == this.mode.HUMAN_VS_COMPUTER){
                this.rotateCamera();
                this.scene.pickResults = [[-1,-1]];
                return; 
            }

            this.rotateCamera();
        }

        if(this.previousState == this.state.BLACK_PLAYER_MOVE){
            this.currentState = this.state.RED_PLAYER_TURN;
            this.previousState = null;

            if(this.gameMode == this.mode.COMPUTER_VS_COMPUTER || this.gameMode == this.mode.HUMAN_VS_COMPUTER){
                this.rotateCamera();
                this.scene.pickResults = [[-1,-1]];
                return; 
            }

            this.rotateCamera();
        }
    }

    humanVsHumanLogic(row, column){
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
                this.selectCannonMove();
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
    }

    humanVsComputerLogic(row, column){

        // It is presumed that the computer will always be the black player and the red player will always be the human.

        this.currentlySelectedRow = row;
        this.currentlySelectedColumn = column;

        if(this.currentState == this.state.RED_PLAYER_PICK_CITY){
            this.citySelect();
        }

        if(this.currentState == this.state.BLACK_PLAYER_PICK_CITY){
            this.computerCitySelect();
        }
        
        if(this.currentState == this.state.RED_PLAYER_TURN){
            if(row >= 0 && column >=0){
                this.oldRow = row;
                this.oldColumn = column;
                this.selectPieceToMove();
            }
        }

        if(this.currentState == this.state.RED_PLAYER_MOVE){
            if(this.checkIfValidMoveCell(row, column) == 1){
                this.movePiece(this.newMoveRow, this.newMoveColumn);
            }

            if(this.checkIfValidMoveCell(row, column) == 2){
                this.movePiece(this.newCaptureRow, this.newCaptureColumn);
            }

            if(this.checkIfValidMoveCell(row, column) == 3){
                this.selectCannonMove();
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
                
        if(this.currentState == this.state.BLACK_PLAYER_TURN){
            this.computerMoveRandomPiece();
        }

        if(this.currentState == this.state.GAME_OVER){
            console.log("GAME OVER!");
        }
        
    }

    computerVsComputerLogic(){

        if(this.currentState == this.state.RED_PLAYER_PICK_CITY || this.currentState == this.state.BLACK_PLAYER_PICK_CITY){
            this.computerCitySelect();
        }
        
        if(this.currentState == this.state.RED_PLAYER_TURN || this.currentState == this.state.BLACK_PLAYER_TURN){
            this.computerMoveRandomPiece();
        }

        if(this.currentState == this.state.GAME_OVER){
            console.log("GAME OVER!");
        }
        
    }

    selectedCell(row, column){
        if(this.gameMode == this.mode.HUMAN_VS_HUMAN){
            this.humanVsHumanLogic(row, column);
        }

        if(this.gameMode == this.mode.HUMAN_VS_COMPUTER){
            this.humanVsComputerLogic(row, column);
        }

        if(this.gameMode == this.mode.COMPUTER_VS_COMPUTER){
            this.computerVsComputerLogic();
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
                    console.log("swapping state");
                    self.currentState = self.state.BLACK_PLAYER_PICK_CITY;
                    self.rotateCamera();
                    
                    if(self.gameMode == self.mode.HUMAN_VS_COMPUTER){
                        self.scene.pickResults = [[-1,-1]];
                    }
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
                    self.rotateCamera();
                },
    
                function() {
                    //onError
                    console.log(" > Cannon: ERROR! COULDN'T SELECT CITY BLACK PLAYER");
                }
    
            );
        }
    };

    computerCitySelect(){
        var self = this;
        var player = "";
        
        if(this.currentState == this.state.RED_PLAYER_PICK_CITY){
            player = "red";
        }

        if(this.currentState == this.state.BLACK_PLAYER_PICK_CITY){
            player = "black";
        }

        var boardString = this.parseBoardToPLOG();
        var command = "placeCityComputer(" + boardString + "," + player + ")";

        this.client.getPrologRequest(

            command,

            function(data) {
                //onSuccess

                if(self.currentState == self.state.RED_PLAYER_PICK_CITY){
                    self.cityRedSavedColumn = parseInt(data.target.response[1]);
                }                
                
                else if(self.currentState == self.state.BLACK_PLAYER_PICK_CITY){
                    self.cityBlackSavedColumn = parseInt(data.target.response[1]);
                }  

                var temp = data.target.response.substring(2);
                var actualBoard = temp.replace(/^.{1}/g, '[');

                self.parseResponseBoard(actualBoard);

                if(self.currentState == self.state.RED_PLAYER_PICK_CITY){
                    self.currentState = self.state.BLACK_PLAYER_PICK_CITY;
                    self.scene.pickResults = [[-1,-1]];
                    self.rotateCamera();
                }

                else if(self.currentState == self.state.BLACK_PLAYER_PICK_CITY){
                    self.currentState = self.state.RED_PLAYER_TURN;
                    self.scene.pickResults = [[-1,-1]];
                    self.rotateCamera();
                }
            },

            function() {
                //onError
                console.log(" > Cannon: ERROR! COULDN'T SELECT CITY BLACK PLAYER COMPUTER");
            }

        );
    }

    computerMoveRandomCannon(){

        var player = "";

        if(this.currentState == this.state.RED_PLAYER_TURN){
            player = "red";
        }

        if(this.currentState == this.state.BLACK_PLAYER_TURN){
            player = "black";
        }

        var self = this;

        var boardString = this.parseBoardToPLOG();

        var botType = "";

        if(this.gameMode == this.mode.COMPUTER_VS_COMPUTER){
            botType = "agressive";
        }

        else {
            if(this.currentLevel == this.level.EASY){
                botType = "easy";
            }

            if(this.currentLevel == this.level.AGRESSIVE){
                botType = "agressive";
            }
        }

        var command = "moveRandomPieceButWithCannon(" + boardString + "," + player + "," + botType + ")";

        this.client.getPrologRequest(

            command,

            function(data) {
                //onSuccess
                if(data.target.response != "Bad Request"){
                    var actualBoard = data.target.response.replace(/\[\d,\d\],\[\d,\d\],/, "");
                    self.parseResponseBoard(actualBoard);

                    if(self.currentState == self.state.RED_PLAYER_TURN){
                        self.currentState = self.state.BLACK_PLAYER_TURN;
                        self.rotateCamera();
                        self.scene.pickResults = [[-1,-1]];
                    }

                    else if(self.currentState == self.state.BLACK_PLAYER_TURN){
                        self.currentState = self.state.RED_PLAYER_TURN;
                        self.rotateCamera();
                        self.scene.pickResults = [[-1,-1]];
                    }
                }

                else{
                    if(self.currentState == self.state.RED_PLAYER_TURN){
                        self.currentState = self.state.BLACK_PLAYER_TURN;
                        self.rotateCamera();
                        self.scene.pickResults = [[-1,-1]];
                    }

                    else if(self.currentState == self.state.BLACK_PLAYER_TURN){
                        self.currentState = self.state.RED_PLAYER_TURN;
                        self.rotateCamera();
                        self.scene.pickResults = [[-1,-1]];
                    }
                }

            },

            function() {
                //onError
                console.log(" > Cannon: ERROR! COULDN'T MOVE CANNON BLACK PLAYER COMPUTER");
            }

        );
    }

    computerMoveRandomPiece(){

        var player = "";

        if(this.currentState == this.state.RED_PLAYER_TURN){
            player = "red";
        }

        if(this.currentState == this.state.BLACK_PLAYER_TURN){
            player = "black";
        }

        var self = this;

        var boardString = this.parseBoardToPLOG();

        var botType = "";

        if(this.gameMode == this.mode.COMPUTER_VS_COMPUTER){
            botType = "agressive";
        }

        else {
            if(this.currentLevel == this.level.EASY){
                botType = "easy";
            }

            if(this.currentLevel == this.level.AGRESSIVE){
                botType = "agressive";
            }
        }

        var command = "moveRandomPiece(" + boardString + "," + player + "," + botType + ")";

        this.client.getPrologRequest(

            command,

            function(data) {
                //onSuccess
                if(!self.gameOver()){
                    if(data.target.response != "Bad Request"){
                        var oldRow = parseInt(data.target.response[2]);
                        var oldColumn = parseInt(data.target.response[4]);
                        var newRow = parseInt(data.target.response[8]);
                        var newColumn = parseInt(data.target.response[10]);
                        
                        var actualBoard = data.target.response.replace(/\[\d,\d\],\[\d,\d\],/, "");
    
                        self.parseResponseBoard(actualBoard);
    
                        if(!self.gameOver()){
                            self.scene.setPieceAnimations(oldRow, oldColumn, newRow, newColumn, player);
                            
                            if(player == "red"){
                                self.previousState = self.state.RED_PLAYER_MOVE;
                            } 
    
                            if(player == "black"){
                                self.previousState = self.state.BLACK_PLAYER_MOVE;
                            }
    
                            self.currentState = self.state.ANIMATION;
                        }
                    }
    
                    else{
                        self.computerMoveRandomCannon();
                    }
                }
            },

            function() {
                //onError
                console.log(" > Cannon: ERROR! COULDN'T MOVE PIECE BLACK PLAYER COMPUTER");
            }

        ); 
    }

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
                    console.log(data.target.response);

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
                    self.scene.setPickEnabled(false);
                }

                else if(data.target.response == "yesBlack"){
                    self.winner = "Red";
                    self.currentState = self.state.GAME_OVER;
                    self.scene.setPickEnabled(false);
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
                    self.scene.highLightCells(self.validCannonCells, "default");

                    if(!self.gameOver()){
                        self.scene.setPieceAnimations(self.oldRow, self.oldColumn, newRow, newColumn, "red");
                        self.currentState = self.state.ANIMATION;
                        self.previousState = self.state.RED_PLAYER_MOVE;
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
                        self.scene.setPieceAnimations(self.oldRow, self.oldColumn, newRow, newColumn, "black");
                        self.currentState = self.state.ANIMATION;
                        self.previousState = self.state.BLACK_PLAYER_MOVE;
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

    selectCannonMove(){
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
                    self.rotateCamera();

                    if(self.gameMode == self.mode.HUMAN_VS_COMPUTER){
                        self.scene.pickResults = [[-1,-1]];
                    }
                }

                else {
                    self.currentState = self.state.RED_PLAYER_TURN;
                    self.rotateCamera();
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
                        self.rotateCamera();

                        if(self.gameMode == self.mode.HUMAN_VS_COMPUTER){
                            self.scene.pickResults = [[-1,-1]];
                        }
                    }

                    else {
                        self.currentState = self.state.RED_PLAYER_TURN;
                        self.rotateCamera();
                    }
                }
            },

            function() {
                //onError
                console.log(" > Cannon: ERROR! COULDN'T SELECT CANNON");
            }

        );
    }

    /*
    * CAMERA
    */
    setCamera() {

        if(this.currentCamera == "default") {
            this.defaultCamera.setPosition([154, 110, 390]);
            this.scene.camera = this.defaultCamera;
        } 
        
        else if(this.currentCamera == "rotation") {
            this.rotationCamera.setPosition([315.4, 110, 390]);
            this.scene.camera = this.rotationCamera;
        }
    };
    
    rotateCamera() {

        if(this.currentCamera == "default"){
            this.previousCamera = this.currentCamera;
            this.currentCamera = "rotation";
        }
        
        else if(this.currentCamera == "rotation"){
            this.previousCamera = this.currentCamera;
            this.currentCamera = "default";
        }

        this.scene.cameraRotationAngle = Math.PI;
        this.scene.cameraRotationActive = true;
    };

};
