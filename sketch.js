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
let mode_change = false;

function windowResized(){
  if(windowWidth > 800){
    resizeCanvas(windowWidth,windowHeight);
  }
}

//---------------------------------
// Mode Change
//---------------------------------
let mode = 1;
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
  for(let i = 0; i < NUM; ++i){
    list_layout[i] = createVector(windowWidth / 8 + 160, 108 + 52 * i + 70);
  }
  // for starters, assign list locations as targets
  for(let i = 0; i < NUM; ++i){
    targets[i] = list_layout[i].copy();
  }
  // setup
  for (let i = 0; i < NUM; i++ ) {
    emperors.push(new FamilyMember(emperors_data.emperors[i], images[i], list_layout[i].x, list_layout[i].y,targets[i]));
  }
  for(let i = 0; i < NUM; ++i){
    emperors[i].born_in_window = createVector(map(emperors[i].born, 276, 421, horizontalMargin, windowWidth - horizontalMargin), 108 + 52 * i + 70);
    emperors[i].died_in_window = createVector(map(emperors[i].died, 276, 421, horizontalMargin, windowWidth - horizontalMargin), 108 + 52 * i + 70);
    emperors[i].reign_start_in_window = createVector(map(emperors[i].reign_start, 276, 421, horizontalMargin, windowWidth - horizontalMargin), 108 + 52 * i + 70);
    emperors[i].reign_end_in_window = createVector(map(emperors[i].reign_end, 276, 421, horizontalMargin, windowWidth - horizontalMargin), 108 + 52 * i + 70);
    timeline_layout[i] =   emperors[i].born_in_window.copy();
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
    if(!mode_change){
      for(let i = 0; i < NUM; ++i){
        fill(33);
        textSize(14);
        text(emperors[i].name, emperors[i].location.x + 280, emperors[i].location.y);
        text(emperors[i].lifespan, emperors[i].location.x + 480, emperors[i].location.y);
        text(emperors[i].reign, emperors[i].location.x + 600, emperors[i].location.y);
        text(emperors[i].order+1, emperors[i].location.x + 700, emperors[i].location.y);
      }
    }
  }else if(mode === 1){
    strokeWeight(2);
    stroke(200);
    line(horizontalMargin, 465 , windowWidth - horizontalMargin, 465);
  }

  is_moving = false;  // *****1 set is_moving to false no matter what
  // Call the appropriate steering behaviors for our agents
  for (let i = 0; i < NUM; i++ ) {
    emperors[i].arrive(targets[i]);
    emperors[i].update(targets[i]);
    emperors[i].display();
    if(emperors[i].is_moving){ // *****2 check if there is any moving members, if there is one, change is_moving to true
      is_moving = true;
    }
  }
  if(!is_moving){mode_change = false;}// *****3 if is_moving is false, that means all the members are done with moving, so mode_change is over, change it to false.
}

function keyPressed(){
  if (keyCode === 48) {
    if(mode === 1 || mode === 2){
      mode_change = true;
    }
    mode = 0;
    is_moving = true;
    emperors.sort((a, b)=> a.order-b.order);
    console.log(emperors);
    for(let i = 0; i < NUM; ++i){
      emperors[i].is_moving = true;
      targets[i] = list_layout[i].copy();
    }
  } else if(keyCode === 49){ // 1
    mode = 1;
    is_moving = true;
    mode_change = true;
    for(let i = 0; i < NUM; ++i){
      emperors[i].is_moving = true;
      targets[i] = timeline_layout[i].copy();
    }
  } else if(keyCode === 50){ // 2
    mode_change = true;
    mode = 2;
  } else if(keyCode === 51){ // 3 generation
    if(mode === 1 || mode === 2){
      mode_change = true;
    }
    mode = 0;
    is_moving = true;
    emperors.sort((a, b)=> a.generation-b.generation);
    console.log(emperors);
    for(let i = 0; i < NUM; ++i){
      emperors[i].is_moving = true;
      targets[i] = list_layout[i].copy();
    }
  } else if(keyCode === 52){ // 4 age
    if(mode === 1 || mode === 2){
      mode_change = true;
    }
    mode = 0;
    is_moving = true;
    emperors.sort((a, b)=> a.born-b.born);
    console.log(emperors);
    for(let i = 0; i < NUM; ++i){
      emperors[i].is_moving = true;
      targets[i] = list_layout[i].copy();
    }
  } else if(keyCode === 53){ // 5 name alphabetical
    if(mode === 1 || mode === 2){
      mode_change = true;
    }
    mode = 0;
    is_moving = true;
    emperors.sort(function(a, b){
      if(a.name_eng < b.name_eng) { return -1; }
      if(a.name_eng > b.name_eng) { return 1; }
      return 0;
    });
    console.log(emperors);
    for(let i = 0; i < NUM; ++i){
      emperors[i].is_moving = true;
      targets[i] = list_layout[i].copy();
    }
  } else if(keyCode === 54){ // 6 posthumous_name alphabetical
    if(mode === 1 || mode === 2){
      mode_change = true;
    }
    mode = 0;
    is_moving = true;
    emperors.sort(function(a, b){
      if(a.posthumous_name < b.posthumous_name) { return -1; }
      if(a.posthumous_name > b.posthumous_name) { return 1; }
      return 0;
    });
    console.log(emperors);
    for(let i = 0; i < NUM; ++i){
      emperors[i].is_moving = true;
      targets[i] = list_layout[i].copy();
    }
  } else if(keyCode === 57){ // 9
    if(mode === 1 || mode === 2){
      mode_change = true;
    }
    mode = 0;
    is_moving = true;
    console.log(emperors);
    for(let i = 0; i < NUM; ++i){
      emperors[i].is_moving = true;
      targets[i] = list_layout[NUM - i - 1].copy();
    }
  }
}
