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

class ParticleExplosion extends GameplayObject{
    constructor(xPos, yPos, width, height, containerArray, density, duration, color){
        super(xPos, yPos, width, height, containerArray);
        this.density = density;
        this.ID = Math.random().toString();
        this.duration = duration;
        this.color = color;
        
        let cssclass="explosion";
        this.htmlContents = `<div class="` + cssclass + `" id="` + this.ID + `"></div>`;
        
        document.getElementById("effectBounds").innerHTML += this.htmlContents;
        
        document.getElementById(this.ID).style.left = this.xPos + "px";
        document.getElementById(this.ID).style.top = this.yPos + "px";
        
        this.frameCounter = 0;
    }
    
    update(){
        let randomVal = Math.random();
        
        if (this.density > Math.random()){
            let particle = new Particle(this.xPos, this.yPos, Math.random() * 360, 9 + (Math.random() * 15), 2 + (Math.random() * 5), this.containerArray, this.color);
            this.containerArray.push(particle);
            
            if (randomVal > 0.4){
                let particle = new Particle(this.xPos, this.yPos, Math.random() * 360, 9 + (Math.random() * 15), 2 + (Math.random() * 5), this.containerArray, this.color);
                this.containerArray.push(particle);
            }
            
            if (this.density > 0.9){
                let particle = new Particle(this.xPos, this.yPos, Math.random() * 360, 9 + (Math.random() * 15), 2 + (Math.random() * 5), this.containerArray, this.color);
                let particle2 = new Particle(this.xPos, this.yPos, Math.random() * 360, 9 + (Math.random() * 15), 2 + (Math.random() * 5), this.containerArray, this.color);
                
                this.containerArray.push(particle);
                this.containerArray.push(particle2);
            }
        }
        
        this.frameCounter++;
        if (this.frameCounter > this.duration){
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

class Particle extends GameplayObject{
    constructor(xPos, yPos, angle, duration, speed, containerArray, color){
        super(xPos, yPos, 10, 10, containerArray);
        this.angleCoordinates = angleToCartesian(angle);
        this.frameCounter = 0;
        this.duration = duration;
         
        this.speed = speed;
        this.ID = Math.random().toString();
        
        let particle = '.';
        let cssclass = "star";
        
        this.htmlContents = `<div class="` + cssclass + `" id="` + this.ID + `">` + particle + `</div>`;
        
        document.getElementById("effectBounds").innerHTML += this.htmlContents;
        
        document.getElementById(this.ID).style.left = this.xPos + "px";
        document.getElementById(this.ID).style.top = this.yPos + "px";
        document.getElementById(this.ID).style["color"] = color;
    }
    
    update(){
        this.xPos += (this.speed * this.angleCoordinates[0]);
        this.yPos += (this.speed * this.angleCoordinates[1]);
        
        document.getElementById(this.ID).style.left = this.xPos + "px";
        document.getElementById(this.ID).style.top = this.yPos + "px";
        
        this.frameCounter++;
        
        if (this.frameCounter > this.duration){
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


class angleToCartesianTest extends GameplayObject{
    constructor(xPos, yPos, width, height, containerArray){
        super(xPos, yPos, width, height, containerArray);
        
        this.ID = Math.random().toString();
        
        let star = ':3';
        let cssclass = "star";
        
        this.htmlContents = `<div class="` + cssclass + `" id="` + this.ID + `">` + star + `</div>`;
        
        document.getElementById("effectBounds").innerHTML += this.htmlContents;
        
        document.getElementById(this.ID).style.left = this.xPos + "px";
        document.getElementById(this.ID).style.top = this.yPos + "px";
        
        this.angle = 0.0;
    }
    
    update(){
        let multiplier = 120;
        let coordinates = angleToCartesian(this.angle);
        document.getElementById(this.ID).style.left = this.xPos + (coordinates[0] * multiplier) + "px";
        document.getElementById(this.ID).style.top = this.yPos + (coordinates[1] * multiplier) + "px";
        
        this.angle++;
        if (this.angle > 359){
            this.angle = 0;
        }
    }
}

//Returns an array formatted [x, y]
//Not accurate, but good enough for particle effects
function angleToCartesian(angle){
    let xVal = 0;
    let yVal = 0;
    
    if (angle < 90){
        xVal = scaleForCurve(angle, 90);
        yVal = scaleForCurve(90 - angle, 90);
    }
    
    if (angle >= 90 && angle <= 180){
        let offset = 90 - (angle - 90);
        xVal = scaleForCurve(offset, 90);
        yVal = scaleForCurve(90 - offset, 90) * -1;
    }
    
    if (angle > 180 && angle <= 270){
        let offset = (angle - 180);
        xVal = scaleForCurve(offset, 90) * -1;
        yVal = scaleForCurve(90 - offset, 90) * -1;
    }
    
    if (angle > 270){
        let offset = 90 - (angle - 270);
        xVal = scaleForCurve(offset, 90) * -1;
        yVal = scaleForCurve(90 - offset, 90);
    }
    
    return [xVal, yVal];
}


function scaleForCurve(value, limit){
    let scaledValue = 1 / (limit / value);
    
    let jawn = Math.pow(scaledValue, (0.314 + (0.314 * scaledValue)));
    
    return jawn;
}
