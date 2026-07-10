const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameOver=false;


const player1={
    x:150,
    y:450,
    shield:10,
    charging:false,
    chargeStart:0,
    flash:0,
    velocityY:0,
    explosions:3
};


const player2={
    x:1050,
    y:450,
    shield:10,
    charging:false,
    chargeStart:0,
    flash:0,
    velocityY:0,
    explosions:3
};


let balls=[];

let keys={};





document.addEventListener("keydown",e=>{

    keys[e.key]=true;


    if(gameOver) return;


    // charge

    if(e.key==="a" && !player1.charging){

        player1.charging=true;
        player1.chargeStart=Date.now();

    }


    if(e.key==="ArrowLeft" && !player2.charging){

        player2.charging=true;
        player2.chargeStart=Date.now();

    }



    // mid flight explosion

    if(e.key==="e"){

        tryExplode(player1,1);

    }


    if(e.key==="Enter"){

        tryExplode(player2,-1);

    }


});






document.addEventListener("keyup",e=>{


    keys[e.key]=false;


    if(e.key==="a"){

        swing(player1,1);

    }


    if(e.key==="ArrowLeft"){

        swing(player2,-1);

    }


});









class Ball{


constructor(x,y,power,direction){


    this.x=x;
    this.y=y;


    this.vx=power*direction;

    this.vy=-power*1.15;


    this.radius=8;


    this.bounced=false;

    this.dead=false;


}





update(){


    this.x+=this.vx;

    this.y+=this.vy;


    this.vy+=0.32;



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


let hold=
(Date.now()-player.chargeStart)/1000;



let power;



if(hold<1){

    power=5+hold*4;

}


else if(hold<2.5){

    power=10+(hold-1)*1.5;

}


else{

    power=14+(hold-2.5)*5;

}



return Math.min(power,22);


}









function swing(player,direction){


if(!player.charging)
return;



let power=calculatePower(player);



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









function tryExplode(player,direction){


if(player.explosions<=0)
return;



for(let ball of balls){



    if(
        !ball.dead &&
        !ball.bounced &&
        (
        direction===1 && ball.vx>0 ||
        direction===-1 && ball.vx<0
        )

    ){


        splitBall(ball,player);


        return;


    }


}


}









function splitBall(ball,player){


player.explosions--;


let newBalls=[];



let angles=[

-8,
-3,
3,
8

];



angles.forEach(angle=>{


let split=new Ball(

ball.x,
ball.y,
Math.abs(ball.vx),
ball.vx>0 ? 1 : -1

);



split.vy =
ball.vy + angle;



split.bounced=false;



newBalls.push(split);


});



ball.dead=true;


balls.push(...newBalls);


}









function updatePlayers(){



player1.velocityY+=0.25;

player2.velocityY+=0.25;



if(keys["w"]){

player1.velocityY-=0.45;

}



if(keys["ArrowUp"]){

player2.velocityY-=0.45;

}



player1.y+=player1.velocityY;

player2.y+=player2.velocityY;



if(player1.y<150){

player1.y=150;
player1.velocityY=0;

}



if(player2.y<150){

player2.y=150;
player2.velocityY=0;

}



if(player1.y>450){

player1.y=450;
player1.velocityY=0;

}



if(player2.y>450){

player2.y=450;
player2.velocityY=0;

}


}









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


if(ball.dead || ball.bounced)
return;




if(

Math.abs(ball.x-player1.x)<40 &&
Math.abs(ball.y-player1.y)<90 &&
ball.vx<0

){


hitPlayer(player1);

ball.dead=true;


}




if(

Math.abs(ball.x-player2.x)<40 &&
Math.abs(ball.y-player2.y)<90 &&
ball.vx>0

){


hitPlayer(player2);

ball.dead=true;


}



});


}









function drawStickman(p){


ctx.lineWidth=5;

ctx.strokeStyle="black";



ctx.beginPath();

ctx.arc(
p.x,
p.y-90,
20,
0,
Math.PI*2
);

ctx.stroke();



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

ctx.strokeStyle=
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


updatePlayers();



balls.forEach(
ball=>ball.update()
);



checkHits();



balls=
balls.filter(
ball=>
!ball.dead &&
ball.x>-200 &&
ball.x<1400 &&
ball.y<700
);



document.getElementById("shield1").textContent=
player1.shield;


document.getElementById("shield2").textContent=
player2.shield;



document.getElementById("explode1").textContent=
player1.explosions;


document.getElementById("explode2").textContent=
player2.explosions;



let power1=0;

let power2=0;



if(player1.charging){

power1=
(Date.now()-player1.chargeStart)/2500;

}



if(player2.charging){

power2=
(Date.now()-player2.chargeStart)/2500;

}



document.getElementById("power1").style.width=
Math.min(power1*100,100)+"%";


document.getElementById("power2").style.width=
Math.min(power2*100,100)+"%";


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
