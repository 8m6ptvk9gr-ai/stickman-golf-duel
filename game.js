const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");

ctx.fillStyle = "green";

ctx.fillRect(0,500,1200,100);

ctx.fillStyle = "black";

ctx.font = "40px Arial";

ctx.fillText("GAME JS IS RUNNING",400,300);

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player1 = {
    x:150,
    y:450,
    shield:10,
    backswingTime:null
};

const player2 = {
    x:1050,
    y:450,
    shield:10,
    backswingTime:null
};

let balls = [];
let gameOver = false;

class Ball{
    constructor(x,y,vx){
        this.x=x;
        this.y=y;
        this.vx=vx;
        this.radius=8;
    }

    update(){
        this.x += this.vx;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fillStyle="white";
        ctx.fill();
    }
}

function launchBall(player,direction){

    const elapsed = Date.now()-player.backswingTime;

    let power;

    if(elapsed > 900 && elapsed < 1200){
        power = 10;
    }
    else if(elapsed > 600 && elapsed < 1500){
        power = 7;
    }
    else{
        power = 3;
    }

    balls.push(
        new Ball(
            player.x,
            player.y,
            power * direction
        )
    );
}

document.addEventListener("keydown",(e)=>{

    if(gameOver) return;

    switch(e.key){

        case "a":
            player1.backswingTime = Date.now();
            break;

        case "d":
            if(player1.backswingTime)
                launchBall(player1,1);
            break;

        case "ArrowLeft":
            player2.backswingTime = Date.now();
            break;

        case "ArrowRight":
            if(player2.backswingTime)
                launchBall(player2,-1);
            break;
    }
});

function hitPlayer(target){

    if(target.shield > 0){
        target.shield--;
    }
    else{
        gameOver = true;

        setTimeout(()=>{
            alert(
              target===player1
              ? "Player 2 Wins!"
              : "Player 1 Wins!"
            );
        },100);
    }
}

function drawStickman(x,y){

    ctx.strokeStyle="black";
    ctx.lineWidth=4;

    ctx.beginPath();
    ctx.arc(x,y-80,20,0,Math.PI*2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x,y-60);
    ctx.lineTo(x,y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x-20,y-40);
    ctx.lineTo(x+20,y-20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x-15,y+40);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x+15,y+40);
    ctx.stroke();

    ctx.strokeStyle="cyan";
    ctx.beginPath();
    ctx.arc(x,y-30,45,0,Math.PI*2);
    ctx.stroke();
}

function update(){

    balls.forEach(ball=>ball.update());

    balls.forEach(ball=>{

        if(
            Math.abs(ball.x-player2.x)<30 &&
            ball.vx>0
        ){
            hitPlayer(player2);
        }

        if(
            Math.abs(ball.x-player1.x)<30 &&
            ball.vx<0
        ){
            hitPlayer(player1);
        }
    });

    balls = balls.filter(
        b => b.x>-100 && b.x<1300
    );

    document.getElementById("shield1").textContent =
        player1.shield;

    document.getElementById("shield2").textContent =
        player2.shield;
}

function draw(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle="green";
    ctx.fillRect(0,500,1200,100);

    drawStickman(player1.x,player1.y);
    drawStickman(player2.x,player2.y);

    balls.forEach(ball=>ball.draw());
}

function loop(){

    update();
    draw();

    requestAnimationFrame(loop);
}

loop();
