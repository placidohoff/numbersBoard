let game;
window.onload = function(){
    let gameConfig = {
        width: 480,
        height: 640,
        backgroundColor: 0xff0000,
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

class playGame extends Phaser.Scene{
    constructor(){
        super("PlayGame");
    }
    create(){
        console.log("this is the awesome game");
    }
}

class bootGame extends Phaser.Scene{
    constructor(){
        super("BootGame");
    }
    create(){
        console.log("game is booting...");
        this.scene.start("PlayGame")
    }
}