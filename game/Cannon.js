/**
 * Cannon
 * @constructor
 */
class Cannon
{
    Cannon(scene) {
        console.log(" > Cannon: NEW GAME");
        
        this.scene = scene;

        this.client = new Client();

        this.defaultCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        this.rotationCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 0, 0), vec3.fromValues(3, 0, 3));

        //this.playerRed = new Player
        //this.playerWhite = new Player

        this.state = {
            WAITING_FOR_START:0
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
        
        this.scene.camera = this.defaultCamera;

        this.scene.information = "Choose a Game Mode and press Start Game to play Cannon.";
    };

    start(gameMode, gameLevel) {
        if(this.currentState == this.state.WAITING_FOR_START){

            switch (gameMode) {
                case "Human vs Human":
                    this.gameMode = this.mode.HUMAN_VS_HUMAN;
                    break;
                case "Human vs Computer":
                    this.gameMode = this.mode.HUMAN_VS_COMPUTER;
                    break;
                case "Computer vs Computer":
                    this.gameMode = this.mode.COMPUTER_VS_COMPUTER;
                    break;
                default:
                    break;
            }

            switch (gameLevel) {
                case "Easy":
                    this.gameLevel = 0;
                    break;
                case "Agressive":
                    this.gameLevel = 1;
                    break;
                default:
                    break;
            }

            this.setVariables();
            this.getInitialBoard();
        }
    };

    setVariables() {
        this.moves = [];
        this.player = 1;
        this.previousPlayer = 1;
    };

    getInitialBoard() {

        var self = this;

        this.client.getPrologRequest(

            "initialBoard",

            function(data) {
                //onSuccess
                console.log(data.response);
                console.log(JSON.parse(data.response));
            },

            function(data) {
                //onError
                console.log(" > Cannon: ERROR! COULDN'T GET INITIAL BOARD");
            }

        );
    };
};
