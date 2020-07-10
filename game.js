let game, gameOptions, gameConfig;
const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;
window.onload = function(){
    gameOptions = {
        tileSize: 200,
        tileSpacing: 20,
        boardSize: {
            rows: 4,
            cols: 4
        },
        tweenSpeed: 2000,
        //swipe variables:
        swipeMaxTime: 1000,
        swipeMinDistance: 20,
        swipeMinNormal: 0.85
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
        this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
            frameWidth: gameOptions.tileSize,
            frameHeight: gameOptions.tileSize
        });
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
        this.canMove = false;
        this.boardArray = [];
        for(let i = 0; i < gameOptions.boardSize.rows; i++){
            this.boardArray[i] = [];
            for(let j = 0; j < 4; j++ ){
                let tilePosition = this.getTilePosition(i, j);
                //Adding the empty tile gives the sprite from the sheet a shadow:
                this.add.image(tilePosition.x, tilePosition.y, "emptytile");
                let tile = this.add.sprite(tilePosition.x, tilePosition.y, "tiles", 0);
                tile.visible = false;
                this.boardArray[i][j] = {
                    tileValue: 0,
                    tileSprite: tile
                }
            }
        }

        this.addTile();
        this.addTile();

        //Player Input listeners:
        this.input.keyboard.on("keydown", this.handleKey, this);
        this.input.on("pointerup", this.handleSwipe, this);
    }
    getTilePosition(row, col){
        let posX = gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize * (col + 0.5);
        let posY = gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize * (row + 0.5);
        return new Phaser.Geom.Point(posX, posY);
    }
    addTile(){
        let emptyTiles = [];
        for(let i = 0; i < gameOptions.boardSize.rows; i++){
            for(let j = 0; j < gameOptions.boardSize.cols; j++){
                if(this.boardArray[i][j].tileValue == 0){
                    emptyTiles.push({
                        row: i,
                        col: j
                    })
                }
            }
        }
        //If we actually have empty tiles on the board:
        if(emptyTiles.length > 0){
            let chosenTile = Phaser.Utils.Array.GetRandom(emptyTiles);
            this.boardArray[chosenTile.row][chosenTile.col].tileValue = 1;
            this.boardArray[chosenTile.row][chosenTile.col].tileSprite.visible = true;
            this.boardArray[chosenTile.row][chosenTile.col].tileSprite.setFrame(0); 
            //Tween animation:
            this.boardArray[chosenTile.row][chosenTile.col].tileSprite.alpha = 0;
            this.tweens.add({
                targets: [this.boardArray[chosenTile.row][chosenTile.col].tileSprite],
                alpha: 1,
                duration: gameOptions.tweenSpeed,
                //Tween completion indicator:
                callbackScope: this,
                onComplete: function(){
                    this.canMove = true;
                    console.log("Tween Completed");
                }
            });

        }
    }
    handleKey(e){
        if(this.canMove){
            switch(e.code){
                case "KeyA":
                case "ArrowLeft":
                    this.makeMove(LEFT);
                    break;
                case "KeyD":
                case "ArrowRight":
                    this.makeMove(RIGHT);
                    break;
                case "KeyW":
                case "ArrowUp":
                    this.makeMove(UP)
                    break;
                case "KeyS":
                case "ArrowDown":
                    this.makeMove(DOWN);
                    break;
            }
        }
    }
    handleSwipe(e){
        let swipeTime = e.upTime - e.downTime;
        let fastEnough = swipeTime < gameOptions.swipeMaxTime;
        let swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
        let swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
        let longEnough = swipeMagnitude > gameOptions.swipeMinDistance;
        if(longEnough && fastEnough){
            Phaser.Geom.Point.SetMagnitude(swipe, 1);
            if(swipe.x > gameOptions.swipeMinNormal){
                this.makeMove(RIGHT);
            }
            if(swipe.x < -gameOptions.swipeMinNormal){
                this.makeMove(LEFT);
            }
            if(swipe.y > gameOptions.swipeMinNormal){
                this.makeMove(DOWN);
            }
            if(swipe.y < -gameOptions.swipeMinNormal){
                this.makeMove(UP);
            }
        }        

        // console.log("Movement time:", swipe.x + "ms");
        // console.log("Horizontal Distance: ", swipe.x , "pixels");
        // console.log("Vertical Distance:", swipe.y, "pixels");
    }
    makeMove(dir){
        console.log("About to Move")
    }
}

