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
            BLACK_PLAYER_MOVE:6
        };

        this.mode = {
            HUMAN_VS_HUMAN: 0,
            HUMAN_VS_COMPUTER: 1,
            COMPUTER_VS_COMPUTER: 2
        };

        this.board = [];
        this.moves = [];

        this.currentState = this.state.WAITING_FOR_START;

        this.citySavedRow;
        this.citySavedColumn;

        this.currentlySelectedRow;
        this.currentlySelectedColumn;

        this.validMoveCells;
        this.validCaptureCells = [];

        this.oldRow;
        this.oldColumn;

        this.newMoveRow;
        this.newMoveColumn;

        this.newCaptureRow;
        this.newCaputureColumn;
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
        }
    };

    citySelect() {
        var self = this;

        if(this.currentState ==  this.state.RED_PLAYER_PICK_CITY){

            var boardString = this.parseBoardToPLOG();
            var command = "placeCityRed(" + boardString + "," + this.currentlySelectedColumn + "," + this.currentlySelectedRow + ")";

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

                    self.currentState = self.state.BLACK_PLAYER_MOVE;
                },
    
                function() {
                    //onError
                    console.log(" > Cannon: ERROR! COULDN'T SELECT BLACK PLAYER");
                }
    
            );
        }
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
                    self.currentState = self.state.BLACK_PLAYER_TURN;
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
                    self.currentState = self.state.RED_PLAYER_TURN;
                },
    
                function() {
                    //onError
                    console.log(" > Cannon: ERROR! COULDN'T SELECT BLACK PLAYER");
                }
    
            );
        }
    }
};
