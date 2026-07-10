const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameOver = false;


const player1 = {
    x:150,
    y:450,
    shield:10,
    charging:false,
    chargeStart:0,
    flash:0
};


const player2 = {
    x:1050,
    y:450,
    shield:10,
    charging:false,
    chargeStart:0,
    flash:0
};


let balls=[];



class Ball {

    constructor(x,y,power,direction){

        this.x=x;
        this.y=y;

        // distance power
        this.vx=power * direction;

        // launch angle
        this.vy=-power * 1.25;

        this.radius=8;

        this.bounced=false;

    }


    update(){

        this.x+=this.vx;

        this.y+=this.vy;


        // gravity

        this.vy+=0.32;



        // ground

        if(this.y>=490){

            this.y=490;

            this.vy*=-0.45;

            this.bounced=true;

        }

    }



    draw(){

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI*2
        );

        ctx.fillStyle="white";

        ctx.fill();

    }

}






function calculatePower(player){

    let holdTime =
    Date.now()-player.chargeStart;


    let charge =
    holdTime/1000;


    let distance;


    // weak shots

    if(charge < 1.2){

        distance =
        5 + charge*5;

    }


    // SWEET SPOT
    // wider and easier

    else if(charge < 2.2){

        distance =
        11 + (charge-1.2)*2;

    }


    // overpowered shots

    else{

        distance =
        13 +
        (charge-2.2)*4;

    }


    return Math.min(distance,22);

}






function swing(player,direction){


    if(!player.charging)
    return;


    let power =
    calculatePower(player);



    balls.push(

        new Ball(

            player.x,
            player.y-50,
            power,
            direction

        )

    );


    player.charging=false;

}







document.addEventListener(
"keydown",
e=>{


    if(gameOver)
    return;



    // PLAYER 1

    if(e.key==="a" && !player1.charging){

        player1.charging=true;

        player1.chargeStart=Date.now();

    }



    // PLAYER 2

    if(e.key==="ArrowLeft" && !player2.charging){

        player2.charging=true;

        player2.chargeStart=Date.now();

    }



});





document.addEventListener(
"keyup",
e=>{


    if(e.key==="a"){

        swing(player1,1);

    }



    if(e.key==="ArrowLeft"){

        swing(player2,-1);

    }



});









function hitPlayer(target){


    target.flash=10;



    if(target.shield>0){

        target.shield--;

    }

    else{


        gameOver=true;


        setTimeout(()=>{

            alert(

            target===player1
            ?
            "Player 2 Wins!"
            :
            "Player 1 Wins!"

            );


        },100);

    }


}








function checkHits(){


    balls.forEach(ball=>{


        // bounced balls cannot damage

        if(ball.bounced)
        return;



        if(

        Math.abs(ball.x-player1.x)<40 &&

        Math.abs(ball.y-player1.y)<90 &&

        ball.vx<0

        ){

            hitPlayer(player1);

            ball.x=-2000;

        }



        if(

        Math.abs(ball.x-player2.x)<40 &&

        Math.abs(ball.y-player2.y)<90 &&

        ball.vx>0

        ){

            hitPlayer(player2);

            ball.x=2000;

        }


    });

}








function drawStickman(p){


    ctx.lineWidth=5;

    ctx.strokeStyle="black";


    // head

    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y-90,
        20,
        0,
        Math.PI*2
    );

    ctx.stroke();



    // body

    ctx.beginPath();

    ctx.moveTo(
        p.x,
        p.y-70
    );

    ctx.lineTo(
        p.x,
        p.y
    );

    ctx.stroke();



    // legs

    ctx.beginPath();

    ctx.moveTo(
        p.x,
        p.y
    );

    ctx.lineTo(
        p.x-20,
        p.y+40
    );


    ctx.moveTo(
        p.x,
        p.y
    );

    ctx.lineTo(
        p.x+20,
        p.y+40
    );


    ctx.stroke();



    // shield

    ctx.strokeStyle =
    p.flash>0
    ?
    "white"
    :
    "cyan";


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y-40,
        55,
        0,
        Math.PI*2
    );

    ctx.stroke();



    if(p.flash>0)
    p.flash--;

}








function update(){



    balls.forEach(
        ball=>ball.update()
    );



    checkHits();



    balls =
    balls.filter(
        ball=>
        ball.x>-200 &&
        ball.x<1400 &&
        ball.y<700
    );



    document.getElementById("shield1").textContent =
    player1.shield;


    document.getElementById("shield2").textContent =
    player2.shield;



    // power meter

    let power=0;


    if(player1.charging){

        power =
        (Date.now()-player1.chargeStart)/1200;

    }


    document.getElementById("power").style.width =
    Math.min(power*100,100)+"%";

}








function draw(){


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    ctx.fillStyle="green";

    ctx.fillRect(
        0,
        500,
        1200,
        100
    );



    drawStickman(player1);

    drawStickman(player2);



    balls.forEach(
        ball=>ball.draw()
    );

}








function loop(){

    update();

    draw();

    requestAnimationFrame(loop);

}



function restartGame(){

    location.reload();

}



loop();
