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


const viewportFifths = {
    "1": (viewportWidth / 5),
    "2": (viewportWidth / 5) * 2,
    "3": (viewportWidth / 5) * 3,
    "4": (viewportWidth / 5) * 4,
    "5": viewportWidth,
    "halfunit": ((viewportWidth / 5) / 2)
}

const viewportSevenths = {
    "1": (viewportWidth / 7),
    "2": (viewportWidth / 7) * 2,
    "3": (viewportWidth / 7) * 3,
    "4": (viewportWidth / 7) * 4,
    "5": (viewportWidth / 7) * 5,
    "6": (viewportWidth / 7) * 6,
    "7": viewportWidth,
        "halfunit": ((viewportWidth / 7) / 2)
}

const viewportNinths = {
    "1": (viewportWidth / 9),
    "2": (viewportWidth / 9) * 2,
    "3": (viewportWidth / 9) * 3,
    "4": (viewportWidth / 9) * 4,
    "5": (viewportWidth / 9) * 5,
    "6": (viewportWidth / 9) * 6,
    "7": (viewportWidth / 9) * 7,
    "8": (viewportWidth / 9) * 8,
    "9": viewportWidth,
    "halfunit": ((viewportWidth / 9) / 2)
}

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
        this.pointChange = 0; //A field to be read by the main loop for changes in the player's points
        this.pointValue = -200;
        
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
                this.pointChange += this.pointValue;
            
        }
    }
    
    destroy(){
        
    }
}

class Enemy{
    constructor(xPos, yPos, width, height, speed, containerArray){
        this.alive = true;
        this.xPos = xPos - (width / 2);
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.lastPos = this.xPos;
        this.objectType = gameplayObjects.enemy;
        this.pointChange = 0; //A field to be read by the main loop for changes in the player's points
        this.pointValue = 50;
        
        this.containerArray = containerArray;
        this.ID = Math.random().toString();
        this.htmlContents = `<div class="enemy" id="` + this.ID + `"></div>`;
        
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
                this.pointChange += this.pointValue;
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

//Starts at the vertical position passed in 'yPosStart', then every 'advanceInterval' steps, advances 'advanceAmount' in increments of 'speed'.
class DynamicEnemy extends Enemy{
    constructor(xPos, yPos, width, height, speed, containerArray, initialYPosStop, advanceAmount, advanceInterval, xPosTransformFunction, yPosTransformFunction){
        super(xPos, yPos, width, height, speed, containerArray);
        
        this.advanceAmount = advanceAmount;
        this.advanceInterval = advanceInterval;
        this.initialYPosStop = initialYPosStop;
        
        this.frameCounter = 0; //Total frames
        this.lastKeyframe = 0; //Frames since the last time we last initiated an action
        
        this.xPosTransformFunction = xPosTransformFunction; //Placeholder for now; could pass a lambda here to perform a transformation on the x axis with each step. Pass null for now
        this.yPosTransformFunction = yPosTransformFunction;
    }
    
    update(){
        if (!this.alive) return;
        this.frameCounter++;
        if (this.yPos > enemyBottomBound){
            this.destroy();
            this.frameCounter++;
            return;
        }
        
        if (this.yPos < this.initialYPosStop){
            this.yPos += this.speed;
            document.getElementById(this.ID).style.top = this.yPos + "px";
            this.frameCounter++;
            return;
        }
        
        
        this.lastKeyframe++;
        
        //physics moment: we will advance by (advanceAmount) units within (advanceAmount / speed) frames
        if (this.lastKeyframe > this.advanceInterval){ //we are in the window of possible animation
            if ((this.lastKeyframe - this.advanceInterval) < (this.advanceAmount)) //the amount advanced is less than the total amount that should be advanced per animation interval
                {
                    this.yPos += this.speed;
                    let amountAdvanced = (this.lastKeyframe - this.advanceInterval) * this.speed;
                    if (amountAdvanced > this.advanceInterval){
                        this.yPos -= (amountAdvanced - this.advanceInterval);
                        this.lastKeyframe = 0;
                    }
                    document.getElementById(this.ID).style.top = this.yPos + "px";
                    return;
                }
                else{
                    this.lastKeyframe = 0;
                }
        }
        
    }
    
    collide(gameplayObject){
        super.collide(gameplayObject);
    }
    
    destroy(){
        super.destroy();
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


function secondsAsFrames(numOfSeconds){
    return Math.floor(numOfSeconds * (1000/frameDistance));
}

//One dimensional collission detection, returns true if the values overlap
function collides(object1start, object1end, object2start, object2end){
    return (object1start >= object2start && object1start <= object2end)
    || (object1end >= object2start && object1end <= object2end );
}

//note: can probably optimize this better; also, it will technically register each collision twice, which is
//fine for now, but will be a problem if we want collisions to do something other than destroy an object
function collisionloop(objectCollection){
    let scoreChange = 0;
    objectCollection.forEach(outerLoopObject => {
        objectCollection.forEach(innerLoopObject => {
            
            if (outerLoopObject.ID != innerLoopObject.ID){
                if (collides(outerLoopObject.yPos, outerLoopObject.yPos + outerLoopObject.height, innerLoopObject.yPos, innerLoopObject.yPos + innerLoopObject.height)
                    && collides(outerLoopObject.xPos, outerLoopObject.xPos + outerLoopObject.width, innerLoopObject.xPos, innerLoopObject.xPos + innerLoopObject.width)){
                    
                    outerLoopObject.collide(innerLoopObject.objectType);
                    innerLoopObject.collide(outerLoopObject.objectType);
                    
                    if (outerLoopObject.hasOwnProperty("pointChange") && outerLoopObject.pointChange != 0){
                        scoreChange += outerLoopObject.pointChange;
                        outerLoopObject.pointChange = 0;
                    }
                    
                    if (innerLoopObject.hasOwnProperty("pointChange") && innerLoopObject.pointChange != 0){
                        scoreChange += innerLoopObject.pointChange;
                        innerLoopObject.pointChange = 0;
                    }
                }
            }
        });
    });
    
    return scoreChange;
}

function gameloop(){
    var entirePage = document.getElementsByTagName("body");
    var boundingBox = document.getElementById("boundingBox");
    var toaster = document.getElementById("toaster");
    console.log("Script active");

    var frameTimer = setInterval(step, frameDistance);
    var toasterSpeed = 17;
    var toastSpeed = 12;

    var viewportBoundaryTolerance = 10; //Amount the toaster is allowed to move out of the viewport
    var toasterX = 150;
    var toasterY = 150;
    var toasterLeftPosition = 0;
    var toasterTopBoundPosition = ((viewportHeight / 7) * 6);

    var gameObjects = [];
    var points = 0;

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
        let toastSize = 70;
        
        let bulletYPosition = window.getComputedStyle(toasterBounds).top;
        bulletYPosition = bulletYPosition.substring(0, bulletYPosition.length - 2); //remove 'px' from end
        let toasty = new Bullet(toasterLeftPosition + (toasterX / 2) - (toastSize / 2), bulletYPosition, toastSize, toastSize, toastSpeed, gameObjects);
        gameObjects.push(toasty);
    }
    
    var toasterCollisionObject = new ToasterCollision(toasterLeftPosition, toasterTopBoundPosition, toasterX, toasterY, gameObjects);
    gameObjects.push(toasterCollisionObject);
    
    let level = new betterLevel(gameObjects, 0);
    let bg = new starryBackground();
    
    
    function step(){
        if (keyLeft == true && toasterLeftPosition > (0 - viewportBoundaryTolerance)){
            toasterLeftPosition -= toasterSpeed;
        }
        else if (keyRight == true && toasterLeftPosition + toasterX < (viewportWidth + viewportBoundaryTolerance)){
            toasterLeftPosition += toasterSpeed;
        }
        toaster.style.left = toasterLeftPosition + "px";
        
        level.step();
        
        gameObjects.forEach(item => {
            item.update();
            if (item.hasOwnProperty("pointChange") && item.pointChange != 0){
                
            }
        });
        
        let pointChange = collisionloop(gameObjects);
        
        points += pointChange;
        document.getElementById("pointsOutput").innerHTML = points;
        
        bg.step();
        
        if (level.isCompleted){
            console.log("nice job!!");
            let intensity = level.intensity + 2;
            level = new betterLevel(gameObjects, intensity);
            toasterSpeed += 1;
            toastSpeed += 2;
        }
        
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
        let difficultyScale = (60*(2 - (0.02 * this.intensity)));
                               
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

class betterLevel{
    constructor (gameObjectsCollection, intensity){
        this.gameObjects = gameObjectsCollection;
        this.intensity = intensity;
        
        this.frameCounter = 0; //Increment once per step
        this.lastKeyframe = 0; //The last 'frame' where this level did something
        
        this.enemyWidth = 50;
        this.enemyHeight = 50;
        
        this.multiplierValue = 0.1;
        this.baseSpeed = 5 + (1 * (this.multiplierValue * intensity));
        
        this.isCompleted = false;
        
    }
        
    //for adjusting timing between sections
    padTime(amountInSeconds){
        this.frameCounter -= secondsAsFrames(amountInSeconds);
    }
        
    step(){
        let firstWave = secondsAsFrames(4);
        let difficultyScale = this.multiplierValue * this.intensity;
        
        if (this.frameCounter == firstWave){
            let enemy = new Enemy(viewportSevenths["2"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            this.gameObjects.push(enemy);
        }
        if (this.frameCounter == firstWave + secondsAsFrames(0.8 - difficultyScale)){
            let enemy = new Enemy(viewportSevenths["3"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            this.gameObjects.push(enemy);
        }
        if (this.frameCounter == firstWave + secondsAsFrames(1.6 - difficultyScale)){
            let enemy = new Enemy(viewportSevenths["4"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            this.gameObjects.push(enemy);
        }
        
        if (this.frameCounter == firstWave + secondsAsFrames(2.6 - difficultyScale)){
            let enemy = new Enemy(viewportSevenths["7"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            this.gameObjects.push(enemy);
        }
        if (this.frameCounter == firstWave + secondsAsFrames(3.4 - difficultyScale)){
            let enemy = new Enemy(viewportSevenths["6"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            this.gameObjects.push(enemy);
        }
        if (this.frameCounter == firstWave + secondsAsFrames(4.2 - difficultyScale)){
            let enemy = new Enemy(viewportSevenths["5"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            this.gameObjects.push(enemy);
        }
        
        
        //A-shaped formation
        if (this.frameCounter == firstWave + secondsAsFrames(6 - difficultyScale)){
            let enemy = new Enemy(viewportNinths["2"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            let enemy2 = new Enemy(viewportNinths["8"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            
            this.gameObjects.push(enemy);
            this.gameObjects.push(enemy2);
        }
        if (this.frameCounter == firstWave + secondsAsFrames(6.7 - difficultyScale)){
            let enemy = new Enemy(viewportNinths["3"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            let enemy2 = new Enemy(viewportNinths["7"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            
            this.gameObjects.push(enemy);
            this.gameObjects.push(enemy2);
        }
        if (this.frameCounter == firstWave + secondsAsFrames(7.4 - difficultyScale)){
            let enemy = new Enemy(viewportNinths["4"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            let enemy2 = new Enemy(viewportNinths["6"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            
            this.gameObjects.push(enemy);
            this.gameObjects.push(enemy2);
        }
        if (this.frameCounter == firstWave + secondsAsFrames(8.1 - difficultyScale)){
            let enemy = new Enemy(viewportNinths["5"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            this.gameObjects.push(enemy);
        }
        
        
        //Pairs
        if (this.frameCounter == firstWave + secondsAsFrames(9.5 - difficultyScale)){
            let enemy = new Enemy(viewportNinths["1"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            this.gameObjects.push(enemy);
            let enemy2 = new Enemy(viewportNinths["2"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            this.gameObjects.push(enemy2);
        }
        if (this.frameCounter == firstWave + secondsAsFrames(10.7 - difficultyScale)){
            let enemy = new Enemy(viewportNinths["8"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            this.gameObjects.push(enemy);
            let enemy2 = new Enemy(viewportNinths["9"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            this.gameObjects.push(enemy2);
        }
        if (this.frameCounter == firstWave + secondsAsFrames(11.9 - difficultyScale)){
            let enemy = new Enemy(viewportNinths["3"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            this.gameObjects.push(enemy);
            let enemy2 = new Enemy(viewportNinths["4"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            this.gameObjects.push(enemy2);
        }
        if (this.frameCounter == firstWave + secondsAsFrames(13.1 - difficultyScale)){
            let enemy = new Enemy(viewportNinths["5"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            this.gameObjects.push(enemy);
            let enemy2 = new Enemy(viewportNinths["6"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            this.gameObjects.push(enemy2);
        }
        if (this.frameCounter == firstWave + secondsAsFrames(14.3 - difficultyScale)){
            let enemy = new Enemy(viewportNinths["8"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            this.gameObjects.push(enemy);
            let enemy2 = new Enemy(viewportNinths["9"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
            this.gameObjects.push(enemy2);
        }
        
        //introduce dynamic enemies
        if (this.frameCounter == firstWave + secondsAsFrames(16 - difficultyScale)){
            let enemy = new DynamicEnemy(viewportSevenths["6"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed + 25, this.gameObjects, 180, 130, secondsAsFrames(1.8), null, null);
            let enemy2 = new DynamicEnemy(viewportSevenths["2"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed + 25, this.gameObjects, 180, 130, secondsAsFrames(1.8), null, null);
            
            this.gameObjects.push(enemy);
            this.gameObjects.push(enemy2);
        }
        
        if (this.frameCounter == firstWave + secondsAsFrames(18 - difficultyScale)){
            let enemy = new DynamicEnemy(viewportNinths["5"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed + 35, this.gameObjects, 500, 50, secondsAsFrames(1.6), null, null);
            this.gameObjects.push(enemy);
        }
        if (this.frameCounter == firstWave + secondsAsFrames(19 - difficultyScale)){
            let enemy = new DynamicEnemy(viewportNinths["4"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed + 35, this.gameObjects, 400, 50, secondsAsFrames(1.6), null, null);
            let enemy2 = new DynamicEnemy(viewportNinths["6"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed + 35, this.gameObjects, 400, 50, secondsAsFrames(1.6), null, null);
            
            this.gameObjects.push(enemy);
            this.gameObjects.push(enemy2);
        }
        if (this.frameCounter == firstWave + secondsAsFrames(20 - difficultyScale)){
            let enemy = new DynamicEnemy(viewportNinths["3"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed + 35, this.gameObjects, 300, 50, secondsAsFrames(1.6), null, null);
            let enemy2 = new DynamicEnemy(viewportNinths["7"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed + 35, this.gameObjects, 300, 50, secondsAsFrames(1.6), null, null);
            
            this.gameObjects.push(enemy);
            this.gameObjects.push(enemy2);
        }
        
        if (this.frameCounter == firstWave + secondsAsFrames(25)){
            this.isCompleted = true;
        }
        this.frameCounter++;
        this.lastKeyframe++;
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
        
        let star = '.';
        let cssclass = "star";
        
        this.htmlContents = `<div class="` + cssclass + `" id="` + this.ID + `">` + star + `</div>`;
        
        document.getElementById("effectBounds").innerHTML += this.htmlContents;
        
        document.getElementById(this.ID).style.left = this.xPos + "px";
        document.getElementById(this.ID).style.top = this.yPos + "px";
    }
    
    update(){
        let starOnPage = document.getElementById(this.ID);
        this.yPos += (this.speed * this.bgInstance.speedMultiplier);
        starOnPage.style.top = this.yPos + "px";
        
        
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
