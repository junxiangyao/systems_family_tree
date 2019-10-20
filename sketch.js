/********************************************************
 * Systems CCA hw7 Interactive Family Tree              *
 *                                                      *
 * Junxiang Yao                                         *
 *                                                      *
 *                                                      *
 ********************************************************/
//layout
let horizontalMargin = 170;
let verticalMargin = 140;

let emperors_data = {}; //? why ={} is a necessary?
function preload() {
  // emperors_data = loadJSON('./data/easternJin.json');
  emperors_data = loadJSON('./data/easternJin.json');
}

let is_moving = false;

function windowResized(){
  if(windowWidth > 800){
    resizeCanvas(windowWidth,windowHeight);
  }
}

//---------------------------------
// Mode Change
//---------------------------------
let mode = 0;
/******************
  0 : List
  1 : Timeline
  2 : Tree
  3 : Reign
*******************/
let list_layout = [];
let timeline_layout = [];
let tree_layout = [];
let targets = [];

let buttons = [];
let button_labels = ["List","Chronological","Family Tree"];

let images = [];
let emperors = [];

const NUM = 11;

let sss;

function setup() {
  createCanvas(windowWidth,windowHeight);
  // load images
  for (let i = 0; i < NUM; i++ ) {
    // images[i] = loadImage( 'data/gaki.jpg' );
    images[i] = loadImage( 'data/' + i + '.png' );
  }

  // initialize locations
  for(let i = 0; i < NUM; ++i){
    list_layout[i] = createVector(windowWidth / 8 + 160, 108 + 52 * i + 70);
  }
  // for(let i = 8; i < NUM; ++i){
  //   list_layout[i] = createVector(windowWidth * 4 / 8, windowHeight/6 + 60 * (i - 8));
  // }
  // for starters, assign list locations as targets
  for(let i = 0; i < NUM; ++i){
    targets[i] = list_layout[i].copy();
  }

  // sss = createP("asdfasdgasjfasdfasdfsdf");
  // sss.position(windowWidth/2, windowHeight/2);

  // setup
  for (let i = 0; i < NUM; i++ ) {
    // emperors.push(new FamilyMember(emperors_data.emperors[i], images[i], windowWidth/2, windowHeight/2));
    emperors.push(new FamilyMember(emperors_data.emperors[i], images[i], list_layout[i].x, list_layout[i].y,targets[i]));
  }
  console.log(emperors[0].name_chn);
  console.log(windowHeight);

}

function draw() {
  background(240);
  textAlign(CENTER, CENTER);
  textSize(30);
  fill(33);
  noStroke();
  text("Family tree of Eastern Jin Emperors", windowWidth/2 ,46);
  textSize(22);
  text("317 - 420 AD, China", windowWidth/2 ,82);
  // stroke(1);
  // line(windowWidth/2-90,110,windowWidth/2+90,110)

  if(mode === 0){
    textAlign(LEFT, CENTER);
    textSize(16);
    fill(33);
    noStroke();
    text("POSTHUMOUS NAME", emperors[0].location.x + 32, 140);
    text("NAME", emperors[0].location.x + 280, 140);
    text("LIFESPAN", emperors[0].location.x + 480, 140);
    text("REIGN", emperors[0].location.x + 600, 140);
    text("ORDER", emperors[0].location.x + 700, 140);
    for(let i = 0; i < NUM; ++i){
      fill(230);
      if(i%2===0){
        rect(emperors[0].location.x - 32, 108 + 52 * i + 45, 810, 52);
        // rect(emperors[i].location.x - 32, emperors[i].location.y - 25, 810, 52);
      }
    }
    if(!is_moving){
      for(let i = 0; i < NUM; ++i){
        fill(33);
        textSize(14);
        text(emperors[i].name, emperors[i].location.x + 280, emperors[i].location.y);
        text(emperors[i].lifespan, emperors[i].location.x + 480, emperors[i].location.y);
        text(emperors[i].reign, emperors[i].location.x + 600, emperors[i].location.y);
        text(emperors[i].order+1, emperors[i].location.x + 700, emperors[i].location.y);
      }
    }
  }
  // console.log(mode);;


  // textAlign(LEFT, CENTER);
  // textSize(14);
  // fill(33);
  // noStroke();
  // text("Emperor Yuan of Jin (晋元帝)", horizontalMargin + 48 ,130);

  // Call the appropriate steering behaviors for our agents
  for (let i = 0; i < NUM; i++ ) {
    emperors[i].arrive();
    emperors[i].update();
    emperors[i].display();
  }
  console.log("0:"+emperors[0].born);
}


function keyPressed(){
  if (keyCode === 48) {
    mode = 0;
    emperors.sort((a, b)=> a.order-b.order);
    console.log(emperors);
    for(let i = 0; i < NUM; ++i){
      emperors[i].target = list_layout[i].copy();
    }
  } else if(keyCode == 49){
    mode = 1;
  } else if(keyCode == 50){
    mode = 2;
  } else if(keyCode == 51){ // 3
    mode = 0;
    emperors.sort((a, b)=> a.generation-b.generation);
    console.log(emperors);
    for(let i = 0; i < NUM; ++i){
      emperors[i].target = list_layout[i].copy();
    }
  } else if(keyCode == 52){ // 4
    mode = 0;
    emperors.sort((a, b)=> a.born-b.born);
    console.log(emperors);
    for(let i = 0; i < NUM; ++i){
      emperors[i].target = list_layout[i].copy();
    }
  } else if(keyCode == 57){ // 9
    mode = 0;
    // emperors.sort((a, b)=> a.order-b.order);
    // console.log(emperors);
    for(let i = 0; i < NUM; ++i){
      emperors[i].target = list_layout[NUM - i - 1].copy();
    }
  }
}
