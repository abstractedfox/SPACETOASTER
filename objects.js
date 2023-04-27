//Copyright 2023 Chris/abstractedfox.
//This work is not licensed for use as source or training data for any language model, neural network,
//AI tool or product, or other software which aggregates or processes material in a way that may be used to generate
//new or derived content from or based on the input set, or used to build a data set or training model for any software or
//tooling which facilitates the use or operation of such software.

///////////////////Gameplay objects

class GameplayObject{
    constructor(xPos, yPos, width, height, containerArray){
        this.alive = true;
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;

        this.onDestroy = () => {}; //Optional function for adding behavior when destroyed
        this.lastCollisionType = null;
        this.messageStackOutput = null; //Populate with an array if this object is intended to post messages
        
        this.pointChange = 0; //A field to be read by the main loop for changes in the player's points
        this.pointValue = 0;
        
        this.containerArray = containerArray;
        
    }
    
    destroy(){
        this.onDestroy(this);
    }
    
    collide(gameplayObject){
        this.lastCollisionType = gameplayObject;
    }
}

class ToasterCollision extends GameplayObject{
    constructor(xPos, yPos, width, height, containerArray){
        super(xPos, yPos, width, height, containerArray);
        
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
        super.collide(gameplayObject);
        switch(gameplayObject){
            case gameplayObjects.enemy:
                console.log("Toaster hit!");
                this.pointChange += this.pointValue;
                if (this.messageStackOutput != null){
                    this.messageStackOutput.push(new Message(messageTypeEnum.TOASTER_DEATH, {
                        "xPos": this.xPos,
                        "yPos": this.yPos,
                        "gameplayObject": gameplayObject}));
                }
        }
    }
    
    destroy(){
        
    }
}

class Enemy extends GameplayObject{
    constructor(xPos, yPos, width, height, speed, containerArray){
        super(xPos, yPos, width, height, containerArray);
        this.width = width;
        this.height = height;
        this.xPos = xPos - (width / 2);
        
        this.speed = speed;
        this.lastPos = this.xPos;
        this.objectType = gameplayObjects.enemy;
        this.pointValue = 50;
        
        this.containerArray = containerArray;
        this.ID = Math.random().toString();
        this.cssClass = "enemy";
        this.htmlContents = `<div class="` + this.cssClass + `" id="` + this.ID + `"></div>`;
        
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
        super.collide(gameplayObject);
        switch(gameplayObject){
            case gameplayObjects.toast:
                this.pointChange += this.pointValue;
                this.destroy();
            
            case gameplayObjects.toaster:
                this.destroy();
        }
    }
    
    destroy(){
        super.destroy();
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
        
        let thisObject = document.getElementById(this.ID).setAttribute("class", "dynamicEnemy");
        
        this.advanceAmount = advanceAmount;
        this.advanceInterval = advanceInterval;
        this.initialYPosStop = initialYPosStop;
        
        this.frameCounter = 0; //Total frames
        this.lastKeyframe = 0; //Frames since the last time we last initiated an action
        
        this.xPosTransformFunction = xPosTransformFunction; //Placeholder for now; could pass a lambda here to perform a transformation on the x axis with each step. Pass null for now
        this.yPosTransformFunction = yPosTransformFunction;
    }
    
    addToPage(){
        document.getElementById("enemyBounds").innerHTML += this.htmlContents;
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

class Bullet extends GameplayObject{
    constructor(xPos, yPos, width, height, speed, containerArray){
        super(xPos, yPos, width, height, containerArray);
        
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
        super.collide(gameplayObject);
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



