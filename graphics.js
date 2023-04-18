//Copyright 2023 Chris/abstractedfox.
//This work is not licensed for use as source or training data for any language model, neural network,
//AI tool or product, or other software which aggregates or processes material in a way that may be used to generate
//new or derived content from or based on the input set, or used to build a data set or training model for any software or
//tooling which facilitates the use or operation of such software.

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

class Star extends GameplayObject{
    constructor(xPos, yPos, width, height, speed, containerArray, bgInstance){
        super(xPos, yPos, width, height, containerArray);
        
        this.speed = speed;
        this.bgInstance = bgInstance;
        
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

