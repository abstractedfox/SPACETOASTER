//Copyright 2023 Chris/abstractedfox.
//This work is not licensed for use as source or training data for any language model, neural network,
//AI tool or product, or other software which aggregates or processes material in a way that may be used to generate
//new or derived content from or based on the input set, or used to build a data set or training model for any software or
//tooling which facilitates the use or operation of such software.

//enum for object types
const gameplayObjects = {
    toaster: "toaster",
    toast: "toast",
    enemy: "enemy",
    powerup: "powerup",
    destroy: "destroy"
}

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
const viewportWidth = 1100;
const viewportHeight = 900;
const bulletTopBound = -5;
const enemyBottomBound = viewportHeight + 5;


const viewportFifths = {
    "1": (viewportWidth / 5),
    "2": (viewportWidth / 5) * 2,
    "3": (viewportWidth / 5) * 3,
    "4": (viewportWidth / 5) * 4,
    "5": viewportWidth,
    "halfunit": ((viewportWidth / 5) / 2)
}

const viewportSevenths = {
    "1": (viewportWidth / 7),
    "2": (viewportWidth / 7) * 2,
    "3": (viewportWidth / 7) * 3,
    "4": (viewportWidth / 7) * 4,
    "5": (viewportWidth / 7) * 5,
    "6": (viewportWidth / 7) * 6,
    "7": viewportWidth,
        "halfunit": ((viewportWidth / 7) / 2)
}

const viewportNinths = {
    "1": (viewportWidth / 9),
    "2": (viewportWidth / 9) * 2,
    "3": (viewportWidth / 9) * 3,
    "4": (viewportWidth / 9) * 4,
    "5": (viewportWidth / 9) * 5,
    "6": (viewportWidth / 9) * 6,
    "7": (viewportWidth / 9) * 7,
    "8": (viewportWidth / 9) * 8,
    "9": viewportWidth,
    "halfunit": ((viewportWidth / 9) / 2)
}


///////////////////Logic


function secondsAsFrames(numOfSeconds){
    return Math.floor(numOfSeconds * (1000/frameDistance));
}

//One dimensional collission detection, returns true if the values overlap
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
    var entirePage = document.getElementsByTagName("body");
    var boundingBox = document.getElementById("boundingBox");
    var toaster = document.getElementById("toaster");
    console.log("Script active");

    var frameTimer = setInterval(step, frameDistance);
    var toasterSpeed = 17;
    var toastSpeed = 12;

    var viewportBoundaryTolerance = 10; //Amount the toaster is allowed to move out of the viewport
    var toasterX = 150;
    var toasterY = 150;
    var toasterLeftPosition = 0;
    var toasterTopBoundPosition = ((viewportHeight / 7) * 6);

    var gameObjects = [];
    var points = 0;

    //Set up keyboard events
    var keyLeft = false;
    var keyRight = false;
    var keyUp = false;
    var keyDown = false;

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
    toaster.style.width = toasterX + "px";
    toaster.style.height = toasterY + "px";
    document.documentElement.style.setProperty("--viewport-width", (viewportWidth + "px"));
    document.documentElement.style.setProperty("--viewport-height", (viewportHeight + "px"));
    document.documentElement.style.setProperty("--toaster-position", toasterTopBoundPosition + "px");
    
    toasterLeftPosition = ((viewportWidth / 2) - (toasterX / 2));

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
    
    var toasterCollisionObject = new ToasterCollision(toasterLeftPosition, toasterTopBoundPosition, toasterX, toasterY, gameObjects);
    gameObjects.push(toasterCollisionObject);
    
    let level = new betterLevel(gameObjects, 0);
    let bg = new starryBackground();
    
    
    function step(){
        if (keyLeft == true && toasterLeftPosition > (0 - viewportBoundaryTolerance)){
            toasterLeftPosition -= toasterSpeed;
        }
        else if (keyRight == true && toasterLeftPosition + toasterX < (viewportWidth + viewportBoundaryTolerance)){
            toasterLeftPosition += toasterSpeed;
        }
        toaster.style.left = toasterLeftPosition + "px";
        
        level.step();
        
        gameObjects.forEach(item => {
            item.update();
        });
        
        let pointChange = collisionloop(gameObjects);
        
        points += pointChange;
        document.getElementById("pointsOutput").innerHTML = points;
        
        bg.step();
        
        if (level.isCompleted){
            console.log("nice job!!");
            let intensity = level.intensity + 2;
            level = new betterLevel(gameObjects, intensity);
            toasterSpeed += 1;
            toastSpeed += 2;
        }
        
    }

}


