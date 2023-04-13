//gameloop();

class Bullet{
    constructor(xPos, yPos, speed){
        this.xPos = xPos;
        this.yPos = yPos;
        this.speed = speed;
        
        this.lastPos = this.xPos;
    }

    update(){
        this.lastPos = this.xPos;
        this.xPos += this.speed;        
    }


}

function gameloop(){
    var entirePage = document.getElementsByTagName("body");
    var boundingBox = document.getElementById("boundingBox");
    var toaster = document.getElementById("toaster");
    console.log("Script active");

    var frameTimer = setInterval(step, 16);
    var toasterSpeed = 5;

    var toasterX = 70;
    var toasterY = 70;
    var toasterLeftPosition = 0;

    var viewportWidth = 1100;

    //Set up keyboard events
    var keyLeft = false;
    var keyRight = false;
    var keyUp = false;
    var keyDown = false;

    document.onkeydown = keyStatePress;
    document.onkeyup = keyStateRelease;
    
    function keyStatePress(event){
        if (event.keyCode == '38'){
            keyUp = true;
        }
        if (event.keyCode == '40'){
            keyDown = true;
        }
        if (event.keyCode == '37'){
            keyLeft = true;
        }
        if (event.keyCode == '39'){
            keyRight = true;
        }
        if (event.keyCode == '32'){
            spacebarPress();
        }
    }
    function keyStateRelease(event){
        if (event.keyCode == '38'){
            keyUp = false;
        }
        if (event.keyCode == '40'){
            keyDown = false;
        }
        if (event.keyCode == '37'){
            keyLeft = false;
        }
        if (event.keyCode == '39'){
            keyRight = false;
        }
    }

    //Initialize sizes and positions
    toaster.style.width = toasterX + "px";
    toaster.style.height = toasterY + "px";
    boundingBox.style.width = viewportWidth + "px";
    
    toasterLeftPosition = ((viewportWidth / 2) - (toasterX / 2));

    function spacebarPress(){
        console.log("bang!!!");
    }
    
    function fire(){
        
    }

    function step(){
        if (keyLeft == true){
            toasterLeftPosition -= toasterSpeed;
        }
        else if (keyRight == true){
            toasterLeftPosition += toasterSpeed;
        }
        toaster.style.left = toasterLeftPosition + "px";
    }

}
