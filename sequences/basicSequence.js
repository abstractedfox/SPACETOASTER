//Copyright 2023 Chris/abstractedfox.
//This work is not licensed for use as source or training data for any language model, neural network,
//AI tool or product, or other software which aggregates or processes material in a way that may be used to generate
//new or derived content from or based on the input set, or used to build a data set or training model for any software or
//tooling which facilitates the use or operation of such software.

//A simple example sequence
class basicSequence extends sequence{
    constructor(gameObjectsCollection, speedMultiplier, effectObjectsCollection){
        super(gameObjectsCollection, speedMultiplier);
        this.effectObjectsCollection = effectObjectsCollection;
        
        this.exitCondition = () => {
            var result = true;
            this.gameObjects.forEach(object => {
                if (object.hasOwnProperty("objectType") && object.objectType == "enemy" && object.alive) result = false;
            });

            return result;
        }

        this.enemyWidth = 50;
        this.enemyHeight = 50;
        this.baseSpeed = 5;

        this.events = [
            60,
            () => {
                let enemy = new ExplodingEnemy(viewportSevenths["2"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects, this.effectObjectsCollection);
                this.gameObjects.push(enemy);
            },
            60,
            () => {
                let enemy = new ExplodingEnemy(viewportSevenths["3"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects, this.effectObjectsCollection);
                this.gameObjects.push(enemy);
            },
            60,
            () => {
                let enemy = new ExplodingEnemy(viewportSevenths["4"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects, this.effectObjectsCollection);
                this.gameObjects.push(enemy);
            },
            90,
            () => {
                let enemy = new ExplodingEnemy(viewportSevenths["6"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects, this.effectObjectsCollection);
                this.gameObjects.push(enemy);
            },
            60,
            () => {
                let enemy = new ExplodingEnemy(viewportSevenths["5"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects, this.effectObjectsCollection);
                this.gameObjects.push(enemy);
            },
            60,
            () => {
                let enemy = new ExplodingEnemy(viewportSevenths["4"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects, this.effectObjectsCollection);
                this.gameObjects.push(enemy);
            },
            90,

            () => {
                let enemy = new ExplodingEnemy(viewportNinths["8"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects, this.effectObjectsCollection);
                let enemy2 = new ExplodingEnemy(viewportNinths["2"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects, this.effectObjectsCollection);
                
                this.gameObjects.push(enemy);
                this.gameObjects.push(enemy2);
            },
            60,
            () => {
                let enemy = new ExplodingEnemy(viewportNinths["7"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects, this.effectObjectsCollection);
                let enemy2 = new ExplodingEnemy(viewportNinths["3"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects, this.effectObjectsCollection);
                
                this.gameObjects.push(enemy);
                this.gameObjects.push(enemy2);
            },
            60,
            () => {
                let enemy = new ExplodingEnemy(viewportNinths["6"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects, this.effectObjectsCollection);
                let enemy2 = new ExplodingEnemy(viewportNinths["4"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects, this.effectObjectsCollection);
                
                this.gameObjects.push(enemy);
                this.gameObjects.push(enemy2);
            },
            60,
            () => {
                let enemy = new ExplodingEnemy(viewportNinths["5"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects, this.effectObjectsCollection);
                
                this.gameObjects.push(enemy);
            },
            "checkpoint",
            90,
            () => {
                let enemy = new ExplodingDynamicEnemy(viewportSevenths["6"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed + 25, this.gameObjects, 400, 130, secondsAsFrames(1.8), null, null, this.effectObjectsCollection);
                let enemy2 = new ExplodingDynamicEnemy(viewportSevenths["2"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed + 25, this.gameObjects, 400, 130, secondsAsFrames(1.8), null, null, this.effectObjectsCollection);
                
                this.gameObjects.push(enemy);
                this.gameObjects.push(enemy2);
            },
            50,
            () => {
                let enemy = new ExplodingEnemy(viewportNinths["5"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects, this.effectObjectsCollection);
                
                this.gameObjects.push(enemy);
            },
            60,
            () => {
                let enemy = new ExplodingEnemy(viewportNinths["7"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects, this.effectObjectsCollection);
                
                this.gameObjects.push(enemy);
            },
            60,
            () => {
                let enemy = new ExplodingDynamicEnemy(viewportSevenths["5"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed + 25, this.gameObjects, 600, 130, secondsAsFrames(1.8), null, null, this.effectObjectsCollection);
                let enemy2 = new ExplodingDynamicEnemy(viewportSevenths["3"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed + 25, this.gameObjects, 600, 130, secondsAsFrames(1.8), null, null, this.effectObjectsCollection);
                
                this.gameObjects.push(enemy);
                this.gameObjects.push(enemy2);
            },
            50,
            () => {
                let enemy = new ExplodingEnemy(viewportNinths["4"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects, this.effectObjectsCollection);
                
                this.gameObjects.push(enemy);
            },
            60,
            () => {
                let enemy = new ExplodingEnemy(viewportNinths["6"] - viewportNinths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects, this.effectObjectsCollection);
                
                this.gameObjects.push(enemy);
            }
        ]
    }
}

class ExplodingEnemy extends Enemy{
    constructor(xPos, yPos, width, height, speed, containerArray, effectObjectsCollection){
        super(xPos, yPos, width, height, speed, containerArray);
        this.effectObjectsCollection = effectObjectsCollection;
        
        this.onDestroy = genericExplosion;
    }
    
    update(){
        super.update();
    }
    
    collide(gameplayObject){
        super.collide(gameplayObject);
    }
    
    destroy(){
        super.destroy();
    }
}

class ExplodingDynamicEnemy extends DynamicEnemy{
    constructor(xPos, yPos, width, height, speed, containerArray, initialYPosStop, advanceAmount, advanceInterval, xPosTransformFunction, yPosTransformFunction, effectObjectsCollection){
        super(xPos, yPos, width, height, speed, containerArray, initialYPosStop, advanceAmount, advanceInterval, xPosTransformFunction, yPosTransformFunction);
        
        this.effectObjectsCollection = effectObjectsCollection;
        this.onDestroy = genericExplosion;
    }
    update(){
        super.update();
    }
    
    collide(gameplayObject){
        super.collide(gameplayObject);
    }
    
    destroy(){
        super.destroy();
    }
}

function genericExplosion(){
    if (this.lastCollisionType == gameplayObjects.toast ||
        this.lastCollisionType == gameplayObjects.toaster){
        let baseDuration = 2;
        
        let explode1 = new ParticleExplosion(this.xPos, this.yPos, 10, 10, this.effectObjectsCollection, 1, baseDuration, "red");
        
        let explode2 = new ParticleExplosion(this.xPos - 16 + (Math.random() * 16), this.yPos - 3 + (Math.random() * 8), 10, 10, this.effectObjectsCollection, 0.7, baseDuration, "orange");
        
        let explode3 = new ParticleExplosion(this.xPos - 2 + (Math.random() * 8), this.yPos - 7 + (Math.random() * 8), 10, 10, this.effectObjectsCollection, 0.6, baseDuration - 2, "white");
        
        this.effectObjectsCollection.push(explode1);
        this.effectObjectsCollection.push(explode2);
        this.effectObjectsCollection.push(explode3);
    }
}
