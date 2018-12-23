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

        //this.defaultCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        //this.rotationCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 0, 0), vec3.fromValues(3, 0, 3));

        //this.playerRed = new Player
        //this.playerWhite = new Player

        this.state = {
            WAITING_FOR_START:0,
            RED_PLAYER_PICK_CITY:1,
            BLACK_PLAYER_PICK_CITY:2,
            RED_PLAYER_TURN:3
        };

        this.mode = {
            HUMAN_VS_HUMAN: 0,
            HUMAN_VS_COMPUTER: 1,
            COMPUTER_VS_COMPUTER: 2
        };

        this.board = [];
        this.moves = [];
        this.player = 0;

        this.currentState = this.state.WAITING_FOR_START;
        this.previousState = this.state.WAITING_FOR_START;

        this.citySavedRow;
        this.citySavedColumn;

        this.currentlySelectedRow;
        this.currentlySelectedColumn;
        
        //this.scene.camera = this.defaultCamera;

        //this.scene.information = "Choose a Game Mode and press Start Game to play Cannon.";
    };

    start(gameMode, gameLevel) {

        if(this.currentState == this.state.WAITING_FOR_START){

            switch (gameMode) {
                case "Human vs Human":
                    this.gameMode = this.mode.HUMAN_VS_HUMAN;
                    this.currentState = this.state.RED_PLAYER_PICK_CITY;
                    break;
            }
                
                /*    case "Human vs Computer":
                    this.gameMode = this.mode.HUMAN_VS_COMPUTER;
                    break;
                case "Computer vs Computer":
                    this.gameMode = this.mode.COMPUTER_VS_COMPUTER;
                    break;
                default:
                    break;
                    */
        }

            /*
            switch (gameLevel) {
                case "Easy":
                    this.gameLevel = 0;
                    break;
                case "Agressive":
                    this.gameLevel = 1;
                    break;
                default: // human vs human has no dificulty 
                    this.gameLevel = -1;
                    break;
            }

            this.setVariables();
            this.getInitialBoard();
        } */

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
    }

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
    }

    selectedCell(row, column){
        this.currentlySelectedRow = row;
        this.currentlySelectedColumn = column;

        if(this.currentState == this.state.RED_PLAYER_PICK_CITY || this.currentState == this.state.BLACK_PLAYER_PICK_CITY){
            this.citySelect();
        }
    }

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
    }
};
