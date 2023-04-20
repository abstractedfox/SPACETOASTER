//Copyright 2023 Chris/abstractedfox.
//This work is not licensed for use as source or training data for any language model, neural network,
//AI tool or product, or other software which aggregates or processes material in a way that may be used to generate
//new or derived content from or based on the input set, or used to build a data set or training model for any software or
//tooling which facilitates the use or operation of such software.

///////////////////Level scripts
class sequence{
    constructor (gameObjectsCollection, speedMultiplier, initOffset){
        this.gameObjects = gameObjectsCollection;
        this.speedMultiplier = speedMultiplier;
        this.initOffset = initOffset;
        
        this.isCompleted = false;
        
        this.frameCounter = 0;
        this.lastKeyframe = 0;

        this.events = [];
        this.eventptr = 0; //The array element to be executed next
        this.subsequence = null; //if a subsequence is started within the event list, this should contain its instance
        this.exitCondition = null; //an optional lambda to use as an additional exit condition
    }
    
    step(){
        (() => {
            //Check that there is not a running subsequence
            if (this.subsequence == null || 
                this.subsequence.hasOwnProperty("isCompleted") && this.subsequence.isCompleted === true){

                //console.log("Not a subsequence!" + this.frameCounter);
                if (this.eventptr > this.events.length - 1){
                    if (this.exitCondition != null && !this.exitCondition()){
                        return;
                    }

                    //console.log("Done!" + this.frameCounter);
                    this.isCompleted = true;
                    return;
                }

                //If the previous event was a subsequence, set the lastKeyframe
                if (this.eventptr > 0 && this.events[this.eventptr - 1] != null && this.events[this.eventptr - 1].hasOwnProperty("isCompleted")){
                    //console.log("Setting this.lastKeyframe after a subsequence!" + this.frameCounter);
                    this.lastKeyframe = this.frameCounter - 1;
                    this.events[this.eventptr - 1] = null;
                }
                
                //The current element is a subsequence
                if (this.events[this.eventptr].hasOwnProperty("isCompleted")){
                    //console.log("Starting a subsequence!" + this.frameCounter);
                    this.subsequence = this.events[this.eventptr];
                    //this.subsequence.step();
                    this.eventptr++;
                    return;
                }

                //The current element is a frame wait
                if (!isNaN(this.events[this.eventptr])){
                    //console.log("Frame wait!" + this.frameCounter + " lastKeyframe: " + this.lastKeyframe);
                    if (this.events[this.eventptr] > (this.frameCounter - this.lastKeyframe)){
                        return;
                    }
                    else {
                        //console.log("Advancing past frame wait. " + this.events[this.eventptr] + " < " + (this.frameCounter - this.lastKeyframe));
                        this.lastKeyframe = this.eventptr;
                        this.eventptr++;
                        return;
                    }
                }

                //The current element is not a frame wait or a subsequence, so execute it
                //console.log("Executing line!" + this.frameCounter);
                this.events[this.eventptr]();
                this.lastKeyframe = this.frameCounter;
                this.eventptr++;
            }

            //There is a running subsequence, so advance it and do nothing else
            else if(this.subsequence.hasOwnProperty("isCompleted") && this.subsequence.isCompleted === false){
                this.subsequence.step();
                return;
            }
        })();
        
        this.frameCounter++;
    }
}


class sequenceTest extends sequence{
    constructor(gameObjectsCollection, speedMultiplier, initOffset){
        super(gameObjectsCollection, speedMultiplier, initOffset);

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
            () => {
                let enemy = new Enemy(viewportSevenths["2"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
                this.gameObjects.push(enemy);
            },
            () => {
                let enemy = new Enemy(viewportSevenths["7"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
                this.gameObjects.push(enemy);
            },
            60,
            () => {
                let enemy = new Enemy(viewportSevenths["3"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
                this.gameObjects.push(enemy);
            },
            60,
            new subsequenceTest(this.gameObjects, 1, 0),
            60,
            () => {
                let enemy = new Enemy(viewportSevenths["4"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
                this.gameObjects.push(enemy);
            }
        ];
    }

    step(){
        super.step();
    }
 
    
}

class subsequenceTest extends sequence{
    constructor(gameObjectsCollection, speedMultiplier, initOffset){
        super(gameObjectsCollection, speedMultiplier, initOffset);
        
        this.enemyWidth = 50;
        this.enemyHeight = 50;
        this.baseSpeed = 5;

        this.events = [
            () => {
                let enemy = new Enemy(viewportSevenths["1"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
                this.gameObjects.push(enemy);

                let enemy2 = new Enemy(viewportSevenths["3"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
                this.gameObjects.push(enemy2);

                let enemy3 = new Enemy(viewportSevenths["5"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
                this.gameObjects.push(enemy3);

                let enemy4 = new Enemy(viewportSevenths["7"] - viewportSevenths["halfunit"], 0, this.enemyWidth, this.enemyHeight, this.baseSpeed, this.gameObjects);
                this.gameObjects.push(enemy4);
            }
        ];
    }

    step(){
        super.step();
    }
}


class spawnRandomEnemies{
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
