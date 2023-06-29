//Copyright 2023 Chris/abstractedfox.
//This work is not licensed for use as source or training data for any language model, neural network,
//AI tool or product, or other software which aggregates or processes material in a way that may be used to generate
//new or derived content from or based on the input set, or used to build a data set or training model for any software or
//tooling which facilitates the use or operation of such software.

//enum for object types
const gameplayObjects = {
    default: "default",
    toaster: "toaster",
    toast: "toast",
    enemy: "enemy",
    powerup: "powerup",
    destroy: "destroy"
}

const gameStateEnum = {
    default: "default",
    running: "running",
    paused: "paused",
    unpausing: "unpausing",
    titleScreen: "titleScreen",
    toasterDeath: "toasterDeath"
}

const dimensionConsts = {
    toasterX: 150,
    toasterY: 80,
    viewportWidth: 1100,
    viewportHeight: 900
};

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
const viewportWidth = dimensionConsts.viewportWidth;
const viewportHeight = dimensionConsts.viewportHeight;
const bulletTopBound = -5;
const enemyBottomBound = dimensionConsts.viewportHeight + 5;
const AudioContext = window.AudioContext;


//Handy shortcuts for object positioning without having to hardcode pixel values all over the place
const viewportFifths = {
    "1": (dimensionConsts.viewportWidth / 5),
    "2": (dimensionConsts.viewportWidth / 5) * 2,
    "3": (dimensionConsts.viewportWidth / 5) * 3,
    "4": (dimensionConsts.viewportWidth / 5) * 4,
    "5": dimensionConsts.viewportWidth,
    "halfunit": ((dimensionConsts.viewportWidth / 5) / 2)
}

const viewportSevenths = {
    "1": (dimensionConsts.viewportWidth / 7),
    "2": (dimensionConsts.viewportWidth / 7) * 2,
    "3": (dimensionConsts.viewportWidth / 7) * 3,
    "4": (dimensionConsts.viewportWidth / 7) * 4,
    "5": (dimensionConsts.viewportWidth / 7) * 5,
    "6": (dimensionConsts.viewportWidth / 7) * 6,
    "7": dimensionConsts.viewportWidth,
        "halfunit": ((dimensionConsts.viewportWidth / 7) / 2)
}

const viewportNinths = {
    "1": (dimensionConsts.viewportWidth / 9),
    "2": (dimensionConsts.viewportWidth / 9) * 2,
    "3": (dimensionConsts.viewportWidth / 9) * 3,
    "4": (dimensionConsts.viewportWidth / 9) * 4,
    "5": (dimensionConsts.viewportWidth / 9) * 5,
    "6": (dimensionConsts.viewportWidth / 9) * 6,
    "7": (dimensionConsts.viewportWidth / 9) * 7,
    "8": (dimensionConsts.viewportWidth / 9) * 8,
    "9": dimensionConsts.viewportWidth,
    "halfunit": ((dimensionConsts.viewportWidth / 9) / 2)
}


///////////////////Logic
function secondsAsFrames(numOfSeconds){
    return Math.floor(numOfSeconds * (1000/frameDistance));
}

//One dimensional collision detection, returns true if the values overlap
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
    let entirePage = document.getElementsByTagName("body");
    let boundingBox = document.getElementById("boundingBox");
    let toaster = document.getElementById("toaster");
    console.log("Script active");

    let frameTimer = setInterval(step, frameDistance);
    let toasterSpeed = 18;
    let toastSpeed = 15;

    let viewportBoundaryTolerance = 25; //Amount the toaster is allowed to move out of the viewport
    let toasterX = 150;
    let toasterY = 80;
    let toasterLeftPosition = 0;
    let toasterTopBoundPosition = ((dimensionConsts.viewportHeight / 7) * 6);

    let gameObjects = [];
    let effectObjects = [];
    let messageStack = new MessageStack();
    let points = {value: 0};

    //Set up keyboard events
    let keyLeft = false;
    let keyRight = false;
    let keyUp = false;
    let keyDown = false;

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
    toaster.style.width = dimensionConsts.toasterX + "px";
    toaster.style.height = dimensionConsts.toasterY + "px";
    document.documentElement.style.setProperty("--viewport-width", (dimensionConsts.viewportWidth + "px"));
    document.documentElement.style.setProperty("--viewport-height", (dimensionConsts.viewportHeight + "px"));
    document.documentElement.style.setProperty("--toaster-position", toasterTopBoundPosition + "px");
    
    toasterLeftPosition = ((dimensionConsts.viewportWidth / 2) - (dimensionConsts.toasterX / 2));

    //Initialize sound
    let audioContext = new AudioContext();
    let bgmElement = document.querySelector("audio");
    let track = audioContext.createMediaElementSource(bgmElement);
    
    track.connect(audioContext.destination);
    let playButton = document.getElementById("audiobutton");
    playButton.addEventListener("click", () => {
        if (audioContext.state === "suspended"){
            audioContext.resume();
        }
        
        if (playButton.dataset.playing === "false"){
            bgmElement.play();
            playButton.dataset.playing = "true";
        }
        else if (playButton.dataset.playing === "true"){
            bgmElement.pause();
            playButton.dataset.playing = "false";
        }
    });
        

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
    
    let toasterCollisionObject = new ToasterCollision(toasterLeftPosition, toasterTopBoundPosition, toasterX, toasterY, gameObjects);
    toasterCollisionObject.messageStackOutput = messageStack;
    gameObjects.push(toasterCollisionObject);
    
    
    let level = new basicSequence(gameObjects, 1, effectObjects);
    let bg = new starryBackground();
    let sequenceDispatcher = new sequenceDispatch(gameObjects, effectObjects, messageStack);
    sequenceDispatcher.mainSequence = level;
    sequenceDispatcher.state = gameStateEnum.running;
    sequenceDispatcher.refPoints = points;
    sequenceDispatcher.deathSequenceInit = () => {
        return new toasterDeathSequence(gameObjects, 1, effectObjects, messageStack);
    };
    
    function step(){
        let lastStepMessages = messageStack.GetMessagesAndClear();

        //Toaster logic
        if (toasterCollisionObject.alive){
            if (keyLeft == true && toasterLeftPosition > (0 - viewportBoundaryTolerance)){
                toasterLeftPosition -= toasterSpeed;
            }
            else if (keyRight == true && toasterLeftPosition + toasterX < (viewportWidth + viewportBoundaryTolerance)){
                toasterLeftPosition += toasterSpeed;
            }
        }
        if (toasterLeftPosition < (0-viewportBoundaryTolerance)) toasterLeftPosition = 0 - viewportBoundaryTolerance;
        if (toasterLeftPosition > (viewportWidth - toasterX + viewportBoundaryTolerance)) toasterLeftPosition = viewportWidth - toasterX + viewportBoundaryTolerance;
        toaster.style.left = toasterLeftPosition + "px";
        
        //Advance frame-level processes

        sequenceDispatcher.lastStepMessages = lastStepMessages;
        sequenceDispatcher.step();
        
        gameObjects.forEach(item => {
            item.update();
        });
        
        effectObjects.forEach(item => {
            item.update();
        });
        
        let pointChange = collisionloop(gameObjects);
        messageStack.PushMessage(new Message(messageTypeEnum.POINT_CHANGE, pointChange));
        
        //points += pointChange;
        document.getElementById("pointsOutput").innerHTML = points["value"];
        
        bg.step();
        
        //This block gets removed once sequenceDispatcher is finished
        if (level.isCompleted){
            console.log("nice job!!");
            sequenceDispatcher.mainSequence = new basicSequence(gameObjects, 1, effectObjects);
            level = sequenceDispatcher.mainSequence;
        }
        
    }

}
