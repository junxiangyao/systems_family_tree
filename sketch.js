/********************************************************
 * Systems CCA hw7 Interactive Family Tree              *
 *                                                      *
 * Junxiang Yao                                         *
 *                                                      *
 *                                                      *
 ********************************************************/
//layout
let horizontalMargin = 150;
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

function setup() {
  createCanvas(windowWidth,windowHeight);
  // load images
  for (let i = 0; i < NUM; i++ ) {
    // images[i] = loadImage( 'data/gaki.jpg' );
    images[i] = loadImage( 'data/' + i + '.png' );
  }

  // initialize locations
  for(let i = 0; i < 6; ++i){
    list_layout[i] = createVector(windowWidth / 8, windowHeight / 4 + 80 * i);
  }
  for(let i = 6; i < NUM; ++i){
    list_layout[i] = createVector(windowWidth * 4 / 8, windowHeight/4 + 80 * (i - 6));
  }
  // for starters, assign list locations as targets
  for(let i = 0; i < NUM; ++i){
    targets[i] = list_layout[i];
  }

  // setup
  for (let i = 0; i < NUM; i++ ) {
    emperors.push(new FamilyMember(emperors_data.emperors[i],images[i], list_layout[i].x, list_layout[i].y));
  }
  console.log(emperors[0].name_chn);
}

function draw() {
  background(240);
  let mouse = createVector(mouseX, mouseY);
  // Draw an ellipse at the mouse location
  fill(200);
  stroke(0);
  strokeWeight(2);
  ellipse(mouse.x, mouse.y, 48, 48);



  // Call the appropriate steering behaviors for our agents
  for (let i = 0; i < NUM; i++ ) {
    // emperors[i].arrive(mouse);
    // emperors[i].update(mouse);
    emperors[i].display();
  }
}


function keyPressed(){
  if (mode === 0) {
    mode = 0;
  } else if(value == 1){
    mode = 1;
  } else if(value ==2){
    mode = 2;
  }
}
