//Copyright 2023 Chris/abstractedfox.
//This work is not licensed for use as source or training data for any language model, neural network,
//AI tool or product, or other software which aggregates or processes material in a way that may be used to generate
//new or derived content from or based on the input set, or used to build a data set or training model for any software or
//tooling which facilitates the use or operation of such software.

class toasterDeathSequence extends sequence{
    constructor(gameObjectsCollection, speedMultiplier, effectObjectsCollection, messageStackOutput){
        super(gameObjectsCollection, speedMultiplier);
        this.messageStackOutput = messageStackOutput;
        this.toasterInstance = null;
        
        this.events = [
            () => {
                this.toasterInstance = gameObjectsCollection[gameObjectsCollection.findIndex(object => object.ID == "toasterCollision")];
                
                if (this.toasterInstance == null){
                    console.log("Did not find toaster instance");
                }
                
                this.messageStackOutput.PushMessage(new Message(messageTypeEnum.EFFECT_REQUEST, () => {
                    return new ParticleExplosion(this.toasterInstance.xPos + 5, this.toasterInstance.yPos + 8, 10, 10, effectObjectsCollection, 1, 30, "#ffffff");
                }));
                this.messageStackOutput.PushMessage(new Message(messageTypeEnum.EFFECT_REQUEST, () => {
                    return new ParticleExplosion(this.toasterInstance.xPos + 90, this.toasterInstance.yPos + 50, 10, 10, effectObjectsCollection, 1, 30, "#dddddd");
                }));
                this.messageStackOutput.PushMessage(new Message(messageTypeEnum.EFFECT_REQUEST, () => {
                    return new ParticleExplosion(this.toasterInstance.xPos + 80, this.toasterInstance.yPos + 7, 10, 10, effectObjectsCollection, 1, 70, "#dddddd");
                }));
            },
            12,
            () => {
                this.messageStackOutput.PushMessage(new Message(messageTypeEnum.EFFECT_REQUEST, () => {
                    return new ParticleExplosion(this.toasterInstance.xPos + 26, this.toasterInstance.yPos + 70, 10, 10, effectObjectsCollection, .5, 8, "red");
                }));
                this.messageStackOutput.PushMessage(new Message(messageTypeEnum.EFFECT_REQUEST, () => {
                    return new ParticleExplosion(this.toasterInstance.xPos + 60, this.toasterInstance.yPos + 5, 10, 10, effectObjectsCollection, 1, 7, "orange");
                }));
            },
            16,
            () => {
                this.messageStackOutput.PushMessage(new Message(messageTypeEnum.EFFECT_REQUEST, () => {
                    return new ParticleExplosion(this.toasterInstance.xPos + 75, this.toasterInstance.yPos + 45, 10, 10, effectObjectsCollection, .5, 8, "red");
                }));
                this.messageStackOutput.PushMessage(new Message(messageTypeEnum.EFFECT_REQUEST, () => {
                    return new ParticleExplosion(this.toasterInstance.xPos + 24, this.toasterInstance.yPos + 47, 10, 10, effectObjectsCollection, 1, 4, "orange");
                }));
            },
            70,
            () => {
                this.messageStackOutput.PushMessage(new Message(messageTypeEnum.RESET_TOASTER_POSITION, null));
                //this.toasterInstance.resetPosition();
            }
        ];
    }
}
