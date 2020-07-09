let game, gameOptions, gameConfig;
window.onload = function(){
    gameOptions = {
        tileSize: 200,
        tileSpacing: 20,
        boardSize: {
            rows: 4,
            cols: 4
        }
    }
    gameConfig = {
        width: gameOptions.boardSize.cols * (gameOptions.tileSize + gameOptions.tileSpacing) + gameOptions.tileSpacing,
        height: gameOptions.boardSize.rows * (gameOptions.tileSize + gameOptions.tileSpacing) + gameOptions.tileSpacing,
        backgroundColor: 0xecf0f1,
        scene: [bootGame, playGame]
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
    resizeGame();
    window.addEventListener("resize", resizeGame);

}

//This functionality makes the game fill the whole height of the window regardless of manual resize:
    //NOTE: This only works as should on google chrome and not microsoft edge
function resizeGame(){
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    let gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + 'px';
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}

class bootGame extends Phaser.Scene{
    constructor(){
        super("BootGame");
    }
    preload(){
        this.load.image("emptytile", "./assets/sprites/emptytile.png");
    }
    create(){
        console.log("game is booting...");
        this.scene.start("PlayGame")
    }
}

class playGame extends Phaser.Scene{
    constructor(){
        super("PlayGame");
    }
    create(){
        //console.log("this is the awesome game");
        //this.add.image(100, 100, "emptytile")
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++ ){
                let tilePosition = this.getTilePosition(i, j);
                this.add.image(tilePosition.x, tilePosition.y, "emptytile");
                //this.add.image(120 + j * 220, 120 + i * 220, "emptytile");
            }
        }
    }
    getTilePosition(row, col){
        let posX = gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize * (col + 0.5);
        let posY = gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize * (row + 0.5);
        return new Phaser.Geom.Point(posX, posY);
    }
}

