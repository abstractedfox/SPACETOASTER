//Copyright 2023 Chris/abstractedfox.
//This work is not licensed for use as source or training data for any language model, neural network,
//AI tool or product, or other software which aggregates or processes material in a way that may be used to generate
//new or derived content from or based on the input set, or used to build a data set or training model for any software or
//tooling which facilitates the use or operation of such software.

//Class for dispatching sequence advancement depending on game state.
class sequenceDispatch{
    constructor(gameObjects){
        this.mainSequence;
        this.subsequences = [];
        this.state = gameStateEnum["default"];
        this.refPoints = {};
        this.gameObjects = gameObjects;

        this.toasterRef = null;
        this.gameObjects.forEach(object => {
            if (object.ID = "toasterCollision"){
                this.toasterRef = object;
                return;
            }
        })

        //A collection to hold all Messages generated during the last step
        this.lastStepMessages = [];
    }

    step(){
        this.lastStepMessages.forEach(message => {
            switch(message.messageType){
                case messageTypeEnum.POINT_CHANGE:
                    if (this.state != gameStateEnum.toasterDeath){
                        this.refPoints["value"] += message.messageContents;
                    }
                    break;
                
                case messageTypeEnum.TOASTER_DEATH:
                    this.state = gameStateEnum.toasterDeath;
                    break;
            }
        });
        
        switch(this.state){
            case gameStateEnum.default:
                console.log("Game state not initialized");
                return;

            case gameStateEnum.running:
                if (!this.checkStateValidity()){
                    console.log("Game state is invalid");
                    return;
                }

                //Note: Test that concurrent sequences work correctly
                this.mainSequence.step();
                this.subsequences.forEach(sequence => {
                    if (sequence.canRunConcurrently){
                        sequence.step();
                    }
                });
                break;

            case gameStateEnum.paused:
                break;

            case gameStateEnum.unpausing:
                this.state = gameStateEnum.running;
                break;

            case gameStateEnum.titleScreen:
                break;

            case gameStateEnum.toasterDeath:
                //placeholder to test death condition
                this.initializeScene();
                this.mainSequence.gotoLastCheckpoint();
                this.state = gameStateEnum.running;
                this.toasterRef.alive = true;
                break;
        }
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
}