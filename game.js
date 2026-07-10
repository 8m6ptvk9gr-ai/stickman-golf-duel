const canvas=document.getElementById("gameCanvas");
const ctx=canvas.getContext("2d");

let gameOver=false;


const player1={
    x:150,
    y:450,
    shield:10,
    charging:false,
    chargeStart:0,
    flash:0
};


const player2={
    x:1050,
    y:450,
    shield:10,
    charging:false,
    chargeStart:0,
    flash:0
};


let balls=[];



class Ball{

constructor(x,y,power,direction){

this.x=x;
this.y=y;

this.vx=power*direction*1.4;

// more power = higher arc
this.vy=-power*0.75;

this.radius=8;

this.bounced=false;

}


update(){

this.x+=this.vx;

this.y+=this.vy;


// gravity

this.vy+=0.35;



// ground bounce

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





function shoot(player,direction){


let charge=
Date.now()-player.chargeStart;



let power=
Math.min(
charge/100,
15
);


// minimum weak hit

if(power<4)
power=4;



balls.push(

new Ball(
player.x,
player.y-40,
power,
direction
)

);


player.charging=false;

}







document.addEventListener(
"keydown",
e=>{


if(gameOver)return;



if(e.key==="a"){

player1.charging=true;
player1.chargeStart=Date.now();

}



if(e.key==="d" && player1.charging){

shoot(player1,1);

}




if(e.key==="ArrowLeft"){

player2.charging=true;
player2.chargeStart=Date.now();

}



if(e.key==="ArrowRight" && player2.charging){

shoot(player2,-1);

}



});









function hit(target){

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


// only direct airborne hits count

if(ball.bounced)
return;



if(

Math.abs(ball.x-player1.x)<35 &&
Math.abs(ball.y-player1.y)<70 &&
ball.vx<0

){

hit(player1);

ball.x=-2000;

}




if(

Math.abs(ball.x-player2.x)<35 &&
Math.abs(ball.y-player2.y)<70 &&
ball.vx>0

){

hit(player2);

ball.x=2000;

}



});


}








function drawStickman(p){



ctx.strokeStyle="black";

ctx.lineWidth=5;



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



balls.forEach(
b=>b.update()
);



checkHits();



balls=
balls.filter(
b=>
b.x>-100 &&
b.x<1300 &&
b.y<700
);



document.getElementById("shield1").textContent=
player1.shield;


document.getElementById("shield2").textContent=
player2.shield;




let power=
player1.charging
?
(Date.now()-player1.chargeStart)/1200
:
0;


document.getElementById("power").style.width=
Math.min(power*100,100)+"%";

}








function draw(){


ctx.clearRect(
0,
0,
1200,
600
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
b=>b.draw()
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
