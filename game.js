const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameOver = false;

let particles = [];
let balls = [];

let keys = {};



const player1 = {

    x:150,
    y:450,

    shield:10,

    charging:false,
    chargeStart:0,

    velocityY:0,

    flash:0,

    explosions:3,

    angle:0

};



const player2 = {

    x:1050,
    y:450,

    shield:10,

    charging:false,
    chargeStart:0,

    velocityY:0,

    flash:0,

    explosions:3,

    angle:0

};






document.addEventListener("keydown", e=>{


    keys[e.key]=true;


    if(gameOver) return;



    // Player 1 charge

    if(e.key==="a" && !player1.charging){

        player1.charging=true;

        player1.chargeStart=Date.now();

    }



    // Player 2 charge

    if(e.key==="ArrowLeft" && !player2.charging){

        player2.charging=true;

        player2.chargeStart=Date.now();

    }



    // split rocket

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






class Ball {


constructor(x,y,power,direction,angle){


    this.x=x;

    this.y=y;



    this.vx =
    Math.cos(angle)
    *
    power
    *
    direction;



    this.vy =
    -Math.sin(angle)
    *
    power;



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


    ctx.save();


    ctx.translate(
        this.x,
        this.y
    );


    let rot =
    Math.atan2(
        this.vy,
        this.vx
    );


    ctx.rotate(rot);



    // rocket body

    ctx.fillStyle="silver";

    ctx.fillRect(
        -10,
        -4,
        25,
        8
    );



    // nose

    ctx.fillStyle="red";

    ctx.beginPath();

    ctx.moveTo(
        15,
        0
    );

    ctx.lineTo(
        25,
        -7
    );

    ctx.lineTo(
        25,
        7
    );

    ctx.closePath();

    ctx.fill();



    // flame

    ctx.fillStyle="orange";

    ctx.beginPath();

    ctx.moveTo(
        -10,
        0
    );

    ctx.lineTo(
        -25,
        -5
    );

    ctx.lineTo(
        -25,
        5
    );

    ctx.closePath();

    ctx.fill();



    ctx.restore();



    particles.push({

        x:this.x-this.vx*0.7,

        y:this.y-this.vy*0.7,

        life:15,

        smoke:true

    });


}



}

function calculatePower(player){


    let hold =
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








function updateAim(){


    if(player1.charging){


        let hold =
        (Date.now()-player1.chargeStart)/1000;



        player1.angle =
        Math.min(
            hold*0.45,
            1.0
        );


    }

    else{

        player1.angle=0;

    }





    if(player2.charging){


        let hold =
        (Date.now()-player2.chargeStart)/1000;



        player2.angle =
        Math.min(
            hold*0.45,
            1.0
        );


    }

    else{

        player2.angle=0;

    }


}









function swing(player,direction){


    if(!player.charging)
    return;



    let power =
    calculatePower(player);



    createExplosion(
        player.x+(70*direction),
        player.y-55
    );



    balls.push(

        new Ball(

            player.x,

            player.y-55,

            power,

            direction,

            player.angle

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

        direction===1 && ball.vx>0

        ||

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



    let angles=[

        -10,
        -4,
         4,
        10

    ];



    angles.forEach(a=>{


        let rocket =
        new Ball(

            ball.x,

            ball.y,

            Math.abs(ball.vx),

            ball.vx>0 ? 1 : -1,

            0

        );



        rocket.vy =
        ball.vy+a;



        balls.push(rocket);



    });




    createExplosion(
        ball.x,
        ball.y
    );



    ball.dead=true;


}









function createExplosion(x,y){


    for(let i=0;i<20;i++){


        particles.push({

            x:x,

            y:y,

            vx:(Math.random()-0.5)*6,

            vy:(Math.random()-0.5)*6,

            life:30,

            smoke:false

        });


    }


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


    createExplosion(
        target.x,
        target.y-50
    );



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









function drawSoldier(p){



    let facing =
    p===player1 ? 1 : -1;



    ctx.lineWidth=5;

    ctx.strokeStyle="black";



    // helmet/head

    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y-100,
        22,
        0,
        Math.PI*2
    );

    ctx.stroke();




    // helmet visor

    ctx.beginPath();

    ctx.moveTo(
        p.x-20,
        p.y-110
    );

    ctx.lineTo(
        p.x+20,
        p.y-110
    );

    ctx.stroke();




    // body armour

    ctx.beginPath();

    ctx.moveTo(
        p.x,
        p.y-78
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





    // bazooka angle

    ctx.save();


    ctx.translate(
        p.x,
        p.y-55
    );



    ctx.rotate(
        -p.angle*facing
    );



    ctx.lineWidth=8;

    ctx.beginPath();


    ctx.moveTo(
        10*facing,
        0
    );


    ctx.lineTo(
        80*facing,
        0
    );


    ctx.stroke();



    // bazooka end

    ctx.lineWidth=3;

    ctx.beginPath();

    ctx.arc(
        85*facing,
        0,
        10,
        0,
        Math.PI*2
    );

    ctx.stroke();



    ctx.restore();






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
        p.y-45,
        60,
        0,
        Math.PI*2
    );


    ctx.stroke();



    if(p.flash>0)
    p.flash--;


}









function drawParticles(){


    particles.forEach(p=>{


        ctx.beginPath();


        ctx.arc(

            p.x,

            p.y,

            p.smoke ? 3 : 6,

            0,

            Math.PI*2

        );



        ctx.fillStyle =
        p.smoke
        ?
        "gray"
        :
        "orange";



        ctx.fill();



        p.x+=p.vx || 0;

        p.y+=p.vy || 0;


        p.life--;


    });



    particles =
    particles.filter(
        p=>p.life>0
    );


}









function update(){


    updatePlayers();


    updateAim();



    balls.forEach(
        ball=>ball.update()
    );



    checkHits();



    balls =
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



    drawSoldier(player1);

    drawSoldier(player2);



    balls.forEach(
        ball=>ball.draw()
    );



    drawParticles();


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
