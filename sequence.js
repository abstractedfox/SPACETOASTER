//Copyright 2023 Chris/abstractedfox.
//This work is not licensed for use as source or training data for any language model, neural network,
//AI tool or product, or other software which aggregates or processes material in a way that may be used to generate
//new or derived content from or based on the input set, or used to build a data set or training model for any software or
//tooling which facilitates the use or operation of such software.

///////////////////Level scripts
//Base class for sequences
class sequence{
    constructor (gameObjectsCollection, speedMultiplier){
        this.gameObjects = gameObjectsCollection;
        this.speedMultiplier = speedMultiplier;
        
        this.isCompleted = false;
        
        this.lastKeyframe = 0;
        this.lastCheckpoint = 0;

        this.events = [];
        this.unmodifiedEvents = null;

        this.eventptr = 0; //The array element to be executed next
        this.subsequence = null; //if a subsequence is started within the event list, this should contain its instance
        this.exitCondition = null; //an optional lambda to use as an additional exit condition
        this.name = ""; //An optional name for identifying unique sequences

        this.hasBeenInitialized = false;

        //If true, advancement of this sequence should not be blocked by other sequences
        this.canRunConcurrently = false;
    }

    runtimeInit(){
        this.unmodifiedEvents = this.events.slice();
    }
    
    step(){
        if (!this.hasBeenInitialized) this.runtimeInit();
        (() => {
            //Check that there is not a running subsequence
            if (this.subsequence == null || 
                this.subsequence.hasOwnProperty("isCompleted") && this.subsequence.isCompleted === true){

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
                    this.lastKeyframe = 0;
                    this.events[this.eventptr - 1] = null;
                }

                //Setting the checkpoint advances the eventptr but does not return
                if (this.events[this.eventptr] == "checkpoint"){
                    this.lastCheckpoint = this.eventptr;
                    this.eventptr++;
                }
                
                //The current element is a subsequence
                if (this.events[this.eventptr].hasOwnProperty("isCompleted")){
                    this.subsequence = this.events[this.eventptr];
                    this.eventptr++;
                    return;
                }

                //The current element is a frame wait
                if (!isNaN(this.events[this.eventptr])){
                    if (this.events[this.eventptr] > this.lastKeyframe){
                        return;
                    }
                    else {
                        this.lastKeyframe = 0;
                        this.eventptr++;
                        return;
                    }
                }

                //The current element is not a frame wait or a subsequence, so execute it
                this.events[this.eventptr]();
                this.lastKeyframe = 0;
                this.eventptr++;
            }

            //There is a running subsequence, so advance it and do nothing else
            else if(this.subsequence.hasOwnProperty("isCompleted") && this.subsequence.isCompleted === false){
                this.subsequence.step();
                return;
            }
        })();
        
        this.lastKeyframe++;
    }

    gotoLastCheckpoint(){
        this.events = this.unmodifiedEvents.slice();
        this.eventptr = this.lastCheckpoint;
        this.lastKeyframe = 0;
    }

    restart(){
        this.events = this.unmodifiedEvents.slice();
        this.eventptr = 0;
        this.lastKeyframe = 0;
        this.lastCheckpoint = 0;
    }
}


class sequenceTest extends sequence{
    constructor(gameObjectsCollection, speedMultiplier){
        super(gameObjectsCollection, speedMultiplier);

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
    constructor(gameObjectsCollection, speedMultiplier){
        super(gameObjectsCollection, speedMultiplier);
        
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
