//Copyright 2023 Chris/abstractedfox.
//This work is not licensed for use as source or training data for any language model, neural network,
//AI tool or product, or other software which aggregates or processes material in a way that may be used to generate
//new or derived content from or based on the input set, or used to build a data set or training model for any software or
//tooling which facilitates the use or operation of such software.

//Class for dispatching sequence advancement depending on game state.
class sequenceDispatch{
    constructor(gameObjects, effectObjects, messageStackOutput){
        this.mainSequence;
        this.subsequences = [];
        this.state = gameStateEnum["default"];
        this.refPoints = {}; //Reference to the points object
        this.gameObjects = gameObjects;
        this.effectObjects = effectObjects;
        this.messageStackOutput = messageStackOutput;
        
        //Should contain a function returning an instance to a sequence to be advanced on toaster death
        this.deathSequenceInit = () => {};
        this.deathSequence = null;

        this.toasterRef = null;
        this.gameObjects.forEach(object => {
            if (object.ID = "toasterCollision"){
                this.toasterRef = object;
                return;
            }
        })

        //A collection to hold all Messages generated during the last step
        this.lastStepMessages = [];
        
        //Should be set to true on the first step of a state change, then back to false for each step after
        this.initializeChangedState = false;
    }

    step(){        
        //Leave messages in queue that should be handled per game state,
        //but process and remove ones that should be handled unconditionally
        for (let i = 0; i < this.lastStepMessages.length; i++){
            let message = this.lastStepMessages[i];
            switch(message.messageType){
                case messageTypeEnum.EFFECT_REQUEST:
                    this.effectObjects.push(message.messageContents());
                    this.lastStepMessages.splice(i, 1);
                    i--;
                    break;
                
                case messageTypeEnum.TOASTER_DEATH:
                    this.setState(gameStateEnum.toasterDeath);
                    this.lastStepMessages.splice(i, 1);
                    i--;
                    break;
            }
        }
        
        switch(this.state){
            case gameStateEnum.default:
                console.log("Game state not initialized");
                return;

            case gameStateEnum.running:
                if (!this.checkStateValidity()){
                    console.log("Game state is invalid");
                    return;
                }
                
                this.lastStepMessages.forEach(message => {
                    switch(message.messageType){
                        case messageTypeEnum.POINT_CHANGE:
                            this.refPoints["value"] += message.messageContents;
                            break;
                    }
                });

                this.stepSequences();
                break;

            case gameStateEnum.paused:
                break;

            case gameStateEnum.unpausing:
                this.setState(gameStateEnum.running);
                break;

            case gameStateEnum.titleScreen:
                break;

            case gameStateEnum.toasterDeath:
                if (this.initializeChangedState){
                    this.lastStepMessages.forEach(message => {
                        switch(message.messageType){
                            case messageTypeEnum.POINT_CHANGE:
                                this.refPoints["value"] += message.messageContents;
                                break;
                        }
                    });
                    this.deathSequence = this.deathSequenceInit();
                    
                }
                
                if (this.deathSequence == null){
                    console.log("Invalid toaster death sequence.");
                    return;
                }
                
                if (this.deathSequence.isCompleted){
                    this.initializeScene();
                    this.mainSequence.gotoLastCheckpoint();
                    this.setState(gameStateEnum.running);
                    this.toasterRef.alive = true;
                    break;
                }
                
                this.stepSequences();
                this.deathSequence.step();
                
                break;
        }
        
        this.initializeChangedState = false;
    }

    checkStateValidity(){
        return (this.mainSequence != null && this.gameObjects != null && this.toasterRef != null);
    }

    //Remove all GameObjects from the scene
    initializeScene(){
        let removalObjects = [];
        this.gameObjects.forEach(object => {
            removalObjects.push(object);
        });
        removalObjects.forEach(gameObject => {
            gameObject.destroy();
        });
    }
    
    setState(gameStateValue){
        if (!(gameStateValue in gameStateEnum)){
            console.log("Invalid state change");
            return;
        }
        this.state = gameStateValue;
        this.initializeChangedState = true;
    }
    
    
    stepSequences(){
        //Note: Test that concurrent sequences work correctly
        this.mainSequence.step();
        this.subsequences.forEach(sequence => {
            if (sequence.canRunConcurrently){
                sequence.step();
            }
        });
    }
}
