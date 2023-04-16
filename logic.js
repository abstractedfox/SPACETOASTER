//gameloop();

//enum for object types
const gameplayObjects = {
    toaster: "toaster",
    toast: "toast",
    enemy: "enemy",
    powerup: "powerup",
    destroy: "destroy"
}

const frameDistance = 16;
const viewportWidth = 1100;
const viewportHeight = 900;
const bulletTopBound = -5;
const enemyBottomBound = viewportHeight + 5;

class ToasterCollision{
    constructor(xPos, yPos, width, height, containerArray){
        this.alive = true;
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.lastPos = this.xPos;
        this.objectType = gameplayObjects.toaster;
        
        this.containerArray = containerArray;
        this.ID = "toasterCollision";
        this.htmlContents = `<div id="` + this.ID + `"></div>`;
        
        document.getElementById("toaster").innerHTML += this.htmlContents;
        
        document.getElementById(this.ID).style.width = this.width + "px";
        document.getElementById(this.ID).style.height = this.height + "px";
        
    }
    
    update(){
        let localX = document.getElementById("toaster").style.left;
        this.xPos = parseInt(localX.substring(0, localX.length - 2)); //remove 'px'
    }
    
    collide(gameplayObject){
        switch(gameplayObject){
            case gameplayObjects.enemy:
                console.log("Toaster hit!");
            
        }
    }
    
    destroy(){
        
    }
}

class Enemy{
    constructor(xPos, yPos, width, height, speed, containerArray){
        this.alive = true;
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.lastPos = this.xPos;
        this.objectType = gameplayObjects.enemy;
        
        this.containerArray = containerArray;
        this.ID = Math.random().toString();
        this.htmlContents = `<div class="enemy" id="` + this.ID + `">>:O</div>`;
        
        document.getElementById("enemyBounds").innerHTML += this.htmlContents;
        
        document.getElementById(this.ID).style.left = this.xPos + "px";
        document.getElementById(this.ID).style.top = this.yPos + "px";
        document.getElementById(this.ID).style.width = this.width + "px";
        document.getElementById(this.ID).style.height = this.height + "px";
    }
    
    update(){
        this.yPos += this.speed;
        document.getElementById(this.ID).style.top = this.yPos + "px";
        
        if (this.yPos > enemyBottomBound){
            this.destroy();
        }
    }
    
    collide(gameplayObject){
        switch(gameplayObject){
            case gameplayObjects.toast:
                this.destroy();
            
            case gameplayObjects.toaster:
                this.destroy();
        }
    }
    
    destroy(){
        if (!this.alive) return;
        document.getElementById(this.ID).remove();
        this.containerArray.splice(this.containerArray.indexOf(this), 1);
        this.alive = false;
    }
}

class Bullet{
    constructor(xPos, yPos, width, height, speed, containerArray){
        this.alive = true;
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.lastPos = this.xPos;
        this.objectType = gameplayObjects.toast;
        
        this.containerArray = containerArray;
        this.ID = Math.random().toString();
        this.htmlContents = `<div class="toast" id="` + this.ID + `">>:3</div>`;

        document.getElementById("bulletBounds").innerHTML += this.htmlContents;
        
        document.getElementById(this.ID).style.top = this.yPos + "px";
        document.getElementById(this.ID).style.left = this.xPos + "px";
        document.getElementById(this.ID).style.width = this.width + "px";
        document.getElementById(this.ID).style.height = this.height + "px";
        
    }

    update(){
        this.lastPos = this.yPos;
        this.yPos -= this.speed;
        
        if (this.yPos < bulletTopBound){
            this.destroy();
            return;
        }
         
        document.getElementById(this.ID).style.top = this.yPos + "px";
    }
    
    collide(gameplayObject){
        switch(gameplayObject){
            case gameplayObjects.enemy:
                this.destroy();
            
            case gameplayObjects.destroy:
                this.destroy();
        }
    }
    
    destroy(){
        if (!this.alive) return;
        document.getElementById(this.ID).remove();
        this.containerArray.splice(this.containerArray.indexOf(this), 1);
        this.alive = false;
    }
}

//One dimensional collission detection, returns true if the values overlap
function collides(object1start, object1end, object2start, object2end){
    return (object1start >= object2start && object1start <= object2end)
    || (object1end >= object2start && object1end <= object2end );
}

//note: can probably optimize this better; also, it will technically register each collision twice, which is
//fine for now, but will be a problem if we want collisions to do something other than destroy an object
function collisionloop(objectCollection){
    objectCollection.forEach(outerLoopObject => {
        objectCollection.forEach(innerLoopObject => {
            
            if (outerLoopObject.ID != innerLoopObject.ID){
                if (collides(outerLoopObject.yPos, outerLoopObject.yPos + outerLoopObject.height, innerLoopObject.yPos, innerLoopObject.yPos + innerLoopObject.height)
                    && collides(outerLoopObject.xPos, outerLoopObject.xPos + outerLoopObject.width, innerLoopObject.xPos, innerLoopObject.xPos + innerLoopObject.width)){
                    
                    outerLoopObject.collide(innerLoopObject.objectType);
                    innerLoopObject.collide(outerLoopObject.objectType);
                }
            }
        });
    });
}

function gameloop(){
    var entirePage = document.getElementsByTagName("body");
    var boundingBox = document.getElementById("boundingBox");
    var toaster = document.getElementById("toaster");
    console.log("Script active");

    var frameTimer = setInterval(step, frameDistance);
    var toasterSpeed = 9;

    var toasterX = 70;
    var toasterY = 70;
    var toasterLeftPosition = 0;
    var toasterTopBoundPosition = ((viewportHeight / 5) * 4);

    var gameObjects = [];

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
    document.documentElement.style.setProperty("--viewport-height", (viewportHeight + "px"));
    document.documentElement.style.setProperty("--toaster-position", toasterTopBoundPosition + "px");
    
    toasterLeftPosition = ((viewportWidth / 2) - (toasterX / 2));

    function spacebarPress(){
        fire();
    }
    
    function fire(){
        let bulletYPosition = window.getComputedStyle(toasterBounds).top;
        bulletYPosition = bulletYPosition.substring(0, bulletYPosition.length - 2); //remove 'px' from end
        let toasty = new Bullet(toasterLeftPosition + (toasterX / 2), bulletYPosition, 16, 16, 12, gameObjects);
        gameObjects.push(toasty);
    }
    
    var toasterCollisionObject = new ToasterCollision(toasterLeftPosition, toasterTopBoundPosition, toasterX, toasterY, gameObjects);
    gameObjects.push(toasterCollisionObject);
    
    let level = new basicLevel(gameObjects, 1);
    
    function step(){
        if (keyLeft == true){
            toasterLeftPosition -= toasterSpeed;
        }
        else if (keyRight == true){
            toasterLeftPosition += toasterSpeed;
        }
        toaster.style.left = toasterLeftPosition + "px";
        
        level.step();
        
        gameObjects.forEach(item => {
            item.update();
        });
        
        collisionloop(gameObjects);
    }

}

class basicLevel{
    constructor (gameObjectsCollection, intensity){
        this.gameObjects = gameObjectsCollection;
        this.intensity = intensity;
        
        this.frameCounter = 0; //Increment once per step
        this.lastKeyframe = 0; //The last 'frame' where this level did something
    }
    
    step(){
        this.frameCounter++;
        let difficultyScale = (60*(4 - (0.01 * this.intensity)));
                               
        if (this.frameCounter - this.lastKeyframe > difficultyScale){
            this.lastKeyframe = this.frameCounter;
            
            let enemy = new Enemy(Math.floor(Math.random() * viewportWidth), 0, 50, 40, 6, this.gameObjects);
            this.gameObjects.push(enemy);
        }
                               
        if (this.frameCounter % (60*15) == 0){
            this.intensity++;
            console.log("level up!");
        }
    }
}
