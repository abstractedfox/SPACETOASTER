//gameloop();

class Bullet{
    constructor(xPos, yPos, speed){
        this.xPos = xPos;
        this.yPos = yPos;
        this.speed = speed;
        
        this.lastPos = this.xPos;
        this.elementReference;
        this.ID = Math.random().toString();
        this.htmlContents = `<div class="toast" id="` + this.ID + `">>:3</div>`;

        document.getElementById("bulletBounds").innerHTML += this.htmlContents;

        document.getElementById(this.ID).style.left = this.xPos + "px";
    }

    update(){
        this.lastPos = this.yPos;
        this.yPos -= this.speed;
        
        document.getElementById(this.ID).style.top = this.yPos + "px";
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

    var bullets = [];

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
    document.documentElement.style.setProperty("--viewport-width", (viewportWidth + "px"));
    
    toasterLeftPosition = ((viewportWidth / 2) - (toasterX / 2));

    function spacebarPress(){
        console.log("bang!!!");
        fire();
    }
    
    function fire(){
        let toasty = new Bullet(toasterLeftPosition + (toasterX / 2), 10, 8);
        bullets.push(toasty);
    }

    function step(){
        if (keyLeft == true){
            toasterLeftPosition -= toasterSpeed;
        }
        else if (keyRight == true){
            toasterLeftPosition += toasterSpeed;
        }
        toaster.style.left = toasterLeftPosition + "px";
        
        bullets.forEach(item => {
            item.update();
        });
    }

}
