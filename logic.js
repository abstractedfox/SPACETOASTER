//gameloop();

//enum for object types
const gameplayObjects = {
    toaster: "toaster",
    toast: "toast",
    enemy: "enemy",
    powerup: "powerup",
    destroy: "destroy"
}

const toastGraphic = `<div id="toastInnerContainer">
<div id="toastBody"></div>
<div id="toastTop"></div>
<div id="toastToastiness"></div>
</div>
<div id="toastBorderContainer">
<div id="toastBody"></div>
<div id="toastTop"></div>
</div>`;

const frameDistance = 16;
const viewportWidth = 1100;
const viewportHeight = 900;
const bulletTopBound = -5;
const enemyBottomBound = viewportHeight + 5;


///////////////////Gameplay objects
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
        //this.htmlContents = `<div class="toast" id="` + this.ID + `">>:3</div>`;
        this.htmlContents = `<div class="toast" id="` + this.ID + `">` + toastGraphic + `</div>`;

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





///////////////////Logic

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
    var toasterSpeed = 10;

    var toasterX = 150;
    var toasterY = 150;
    var toasterLeftPosition = 0;
    var toasterTopBoundPosition = ((viewportHeight / 7) * 6);

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
        let toastSize = 60;
        let toastSpeed = 12;
        
        let bulletYPosition = window.getComputedStyle(toasterBounds).top;
        bulletYPosition = bulletYPosition.substring(0, bulletYPosition.length - 2); //remove 'px' from end
        let toasty = new Bullet(toasterLeftPosition + (toasterX / 2) - (toastSize / 2), bulletYPosition, toastSize, toastSize, toastSpeed, gameObjects);
        gameObjects.push(toasty);
    }
    
    var toasterCollisionObject = new ToasterCollision(toasterLeftPosition, toasterTopBoundPosition, toasterX, toasterY, gameObjects);
    gameObjects.push(toasterCollisionObject);
    
    let level = new basicLevel(gameObjects, 4);
    let bg = new starryBackground();
    
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
        
        bg.step();
    }

}


///////////////////Level scripts
class basicLevel{
    constructor (gameObjectsCollection, intensity){
        this.gameObjects = gameObjectsCollection;
        this.intensity = intensity;
        this.secondsToDifficultyIncrease = 4;
        
        this.frameCounter = 0; //Increment once per step
        this.lastKeyframe = 0; //The last 'frame' where this level did something
        
        this.enemyWidth = 40;
        this.enemyHeight = 50;
    }
    
    step(){
        this.frameCounter++;
        let difficultyScale = (60*(2 - (0.03 * this.intensity)));
                               
        if (this.frameCounter - this.lastKeyframe > difficultyScale){
            this.lastKeyframe = this.frameCounter;
            
            let enemy = new Enemy(Math.floor(Math.random() * (viewportWidth - this.enemyWidth)), 0, this.enemyHeight, this.enemyWidth, 6, this.gameObjects);
            this.gameObjects.push(enemy);
        }
        
        if (this.frameCounter % (60*(this.secondsToDifficultyIncrease)) == 0){
            this.intensity++;
            console.log("level up!");
        }
    }
}




///////////////////Graphics
class starryBackground{
    constructor(){
        this.speedMultiplier = 1;
        this.starArray = [];
        this.vSlowStar = 1;
        this.slowStar = 2;
        this.fastStar = 5;
        this.vFastStar = 9;
        
        //Fast stars
        for (let i = 0; i < 20; i++){
            let star = new Star((Math.random() * viewportWidth), (Math.random() * viewportHeight), 10, 10, this.fastStar, this.starArray, this);
            this.starArray.push(star);
        }
        
        //Slow stars
        for (let i = 0; i < 30; i++){
            let star = new Star((Math.random() * viewportWidth), (Math.random() * viewportHeight), 10, 10, this.slowStar, this.starArray, this);
            this.starArray.push(star);
        }
        
        //Very slow stars
        for (let i = 0; i < 8; i++){
            let star = new Star((Math.random() * viewportWidth), (Math.random() * viewportHeight), 10, 10, this.vSlowStar, this.starArray, this);
            this.starArray.push(star);
        }
    }
    
    step(){
        this.starArray.forEach(star => {
           star.update();
        });
        let randomVal = Math.random();
        if (randomVal < 0.05){
            //Very slow star
            let star = new Star((Math.random() * viewportWidth), 0, 10, 10, this.vSlowStar, this.starArray, this);
            this.starArray.push(star);
            return;
        }
        if (randomVal < 0.15){
            //Slow star
            let star = new Star((Math.random() * viewportWidth), 0, 10, 10, this.slowStar, this.starArray, this);
            this.starArray.push(star);
            return;
        }
        
        if (randomVal < 0.5){
            //Fast star
            let star = new Star((Math.random() * viewportWidth), 0, 10, 10, this.fastStar, this.starArray, this);
            this.starArray.push(star);
            return;
        }
        
        if (randomVal > 0.88){
            //Very fast star
            let star = new Star((Math.random() * viewportWidth), 0, 10, 10, this.vFastStar, this.starArray, this);
            this.starArray.push(star);
            return;
        }
    }
}

class Star{
    constructor(xPos, yPos, width, height, speed, containerArray, bgInstance){
        this.alive = true;
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.bgInstance = bgInstance;
        
        this.containerArray = containerArray;
        this.ID = Math.random().toString();
        this.htmlContents = `<div class="star" id="` + this.ID + `">.</div>`;
        
        document.getElementById("effectBounds").innerHTML += this.htmlContents;
        
        document.getElementById(this.ID).style.left = this.xPos + "px";
        document.getElementById(this.ID).style.top = this.yPos + "px";
    }
    
    update(){
        this.yPos += (this.speed * this.bgInstance.speedMultiplier);
        document.getElementById(this.ID).style.top = this.yPos + "px";
        
        if (this.yPos > enemyBottomBound){
            this.destroy();
        }
    }
    
    collide(gameplayObject){
    }
    
    destroy(){
        if (!this.alive) return;
        document.getElementById(this.ID).remove();
        this.containerArray.splice(this.containerArray.indexOf(this), 1);
        this.alive = false;
    }
}
