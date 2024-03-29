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
let tree_element_height = [0, 0, -1, 0, 0, -2, -1, 2, 2, 1, 2]; //should be revised later so that it is not har coded

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
let button_labels = ["List","Timeline","Tree"];

let images = [];
let emperors = [];

const NUM = 11;

let black_labels = [];
let red_labels = [];
let test;

let shadow;

 // fade in
const ALPHA_ACCUMULATOR = 17;
let alpha = 255;
let show_line = false;
let mode_0_sort = [false,false,false,true];
let inverted = false;

function setup() {
  createCanvas(windowWidth,windowHeight);
  // load images
  for (let i = 0; i < NUM; i++ ) {
    images[i] = loadImage( 'data/' + i + '.png' );
  }
  for (let i = 0; i < 3; i++ ) {
    red_labels[i] = loadImage( 'data/' + i + 'r.png' );
  }
  for (let i = 0; i < 3; i++ ) {
    black_labels[i] = loadImage( 'data/' + i + 'g.png' );
  }
  let shadow = loadImage( 'data/shadow.png' );
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

  // initialize timeline layout
  for(let i = 0; i < NUM; ++i){
    emperors[i].born_in_window = createVector(map(emperors[i].born, 276, 421, horizontalMargin, windowWidth - horizontalMargin), 110 + 48 * i);
    emperors[i].died_in_window = createVector(map(emperors[i].died, 276, 421, horizontalMargin, windowWidth - horizontalMargin), 110 + 48 * i);
    emperors[i].reign_start_in_window = createVector(map(emperors[i].reign_start, 276, 421, horizontalMargin, windowWidth - horizontalMargin), 110 + 48 * i);
    emperors[i].reign_end_in_window = createVector(map(emperors[i].reign_end, 276, 421, horizontalMargin, windowWidth - horizontalMargin), 110 + 48 * i);
    timeline_layout[i] =   emperors[i].born_in_window.copy();
  }

  // initialize tree layout
  for(let i = 0; i < NUM; ++i){
    tree_layout[i] = createVector(horizontalMargin + emperors[i].generation * 300, windowHeight/2 + 120 * tree_element_height[i]);
  }
  // -----------------------------------------------------
  console.log(emperors[0].name_chn);
  console.log(windowHeight);
  console.log(emperors[0].born_in_window);
  console.log(emperors[0].died_in_window);

  for(let i = 0; i < 3; ++i){
    buttons.push(new Button(red_labels[i],black_labels[i],button_labels[i],55, 90 * i + 50, 13 , i, shadow));
  }
  // buttons[0] = createButton("List");
  // buttons[1] = createButton("Time");
  // buttons[2] = createButton("Tree");
  // buttons[0] = createButton('List');
  // buttons[1] = createButton('Timeline');
  // buttons[2] = createButton('Tree');

  // buttons.forEach(function(element,i) {
  //   element.position(20, 80 * i + 20);
  //   element.addClass('button');
    // element.addClass('button:hover');
    // element.addClass('button:focus');
  // });
  // buttons[0].mousePressed(toList);
  // buttons[1].mousePressed(toTimeline);
  // buttons[2].mousePressed(toTree);
  // buttons[0].attribute('autofocus', 'true');
  // test = createP("Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")
  // test .position(20, 20);
  // button.mouseOver(onList).mouseOut(outList);
}

function draw() {
  background(240);

  //------------------------ settings for different modes ----------------------
  if(mode === 0){ // list layout
    textAlign(LEFT, CENTER);
    textSize(16);
    fill(33);
    if((mouseX > (emperors[0].location.x - 24) && mouseX < (emperors[0].location.x + 280)
      && mouseY > 130 && mouseY < 150) || mode_0_sort[0]){
        fill(235,118,107);
    }
    noStroke();
    text("POSTHUMOUS NAME", emperors[0].location.x + 32, 140);
    fill(33);
    if(mouseX > (emperors[0].location.x + 280) && mouseX < (emperors[0].location.x + 480)
      && mouseY > 130 && mouseY < 150 || mode_0_sort[1]){
        fill(235,118,107);
    }
    text("NAME", emperors[0].location.x + 280, 140);
    fill(33);
    if(mouseX > (emperors[0].location.x + 480) && mouseX < (emperors[0].location.x + 600)
      && mouseY > 130 && mouseY < 150 || mode_0_sort[2]){
        fill(235,118,107);
    }
    text("LIFESPAN", emperors[0].location.x + 480, 140);
    fill(33);
    if(mouseX > (emperors[0].location.x + 600) && mouseX < (emperors[0].location.x + 810)
      && mouseY > 130 && mouseY < 150 || mode_0_sort[3]){
        fill(235,118,107);
        if(mouseX > (emperors[0].location.x + 700) && mouseX < (emperors[0].location.x + 810)){
          push();
          translate(emperors[0].location.x + 766, 140);
          if(inverted){
            triangle(0, -5, -5, 5, 5, 5);
          }else{
            triangle(0, 5, -5, -5, 5, -5);
          }
          pop();
        }
    }
    text("REIGN", emperors[0].location.x + 600, 140);
    text("ORDER", emperors[0].location.x + 700, 140);
    fill(33);
    for(let i = 0; i < NUM; ++i){
      fill(230);
      if(i%2 === 0){
        rect(emperors[0].location.x - 32, 108 + 52 * i + 45, 810, 52);
        // rect(emperors[i].location.x - 32, emperors[i].location.y - 25, 810, 52);
      }
    }
    if(!mode_change){
      if(alpha < 255){
        alpha += ALPHA_ACCUMULATOR;
      }else{
        alpha = 255;
      }
      for(let i = 0; i < NUM; ++i){
        fill(33,33,33,alpha);
        textSize(14);
        text(emperors[i].name, emperors[i].location.x + 280, emperors[i].location.y);
        text(emperors[i].lifespan, emperors[i].location.x + 480, emperors[i].location.y);
        text(emperors[i].reign, emperors[i].location.x + 600, emperors[i].location.y);
        text(emperors[i].order + 1, emperors[i].location.x + 700, emperors[i].location.y);
      }

    }
  }else if(mode === 1){ // timeline layout
    strokeWeight(2);
    stroke(0,0,0,50);
    line(0, 660 , windowWidth, 660);
    stroke(193);
    strokeWeight(1);
    line(map(300, 276, 421, horizontalMargin, windowWidth - horizontalMargin),0,
        map(300, 276, 421, horizontalMargin, windowWidth - horizontalMargin),windowHeight);
    line(map(350, 276, 421, horizontalMargin, windowWidth - horizontalMargin),0,
        map(350, 276, 421, horizontalMargin, windowWidth - horizontalMargin),windowHeight);
    line(map(400, 276, 421, horizontalMargin, windowWidth - horizontalMargin),0,
        map(400, 276, 421, horizontalMargin, windowWidth - horizontalMargin),windowHeight);
    fill(193);
    noStroke();
    textAlign(LEFT, CENTER);
    text("300 AD", 5 + map(300, 276, 421, horizontalMargin, windowWidth - horizontalMargin),windowHeight - 40);
    text("350 AD", 5 + map(350, 276, 421, horizontalMargin, windowWidth - horizontalMargin),windowHeight - 40);
    text("400 AD", 5 + map(400, 276, 421, horizontalMargin, windowWidth - horizontalMargin),windowHeight - 40);
    // line(horizontalMargin - 20, 660 , windowWidth - horizontalMargin + 22, 660);
    if(!mode_change){
      if(alpha < 255){
        alpha += ALPHA_ACCUMULATOR;
      }else{
        alpha = 255;
      }
    }
    strokeWeight(12);
    stroke(235,118,107,alpha);
    point(map(emperors_data.length[0], 276, 421, horizontalMargin, windowWidth - horizontalMargin),660);
    point(map(emperors_data.length[1], 276, 421, horizontalMargin, windowWidth - horizontalMargin),660);
    strokeWeight(2);
    line(map(emperors_data.length[0], 276, 421, horizontalMargin, windowWidth - horizontalMargin),660,
    map(emperors_data.length[1], 276, 421, horizontalMargin, windowWidth - horizontalMargin),660);
    // textAlign(LEFT, CENTER);
    textSize(20);
    // fill(33);
    noStroke();
    textAlign(CENTER, CENTER);
    fill(150);
    text("Timeline", 60 ,644);
    fill(235,118,107,alpha);
    text(emperors_data.length[0]+" AD",map(emperors_data.length[0], 276, 421, horizontalMargin, windowWidth - horizontalMargin),690);
    text(emperors_data.length[1]+" AD",map(emperors_data.length[1], 276, 421, horizontalMargin, windowWidth - horizontalMargin),690);

    emperors.forEach(function(element){
      if(mouseX > (element.location.x - 24) && mouseX < (element.died_in_window.x + 6)
        && mouseY > (element.location.y - 24)&& mouseY < (element.location.y + 24)){
          element.is_hover = true;
          element.show_line = true;
      }
    });


  }else if(mode === 2){ // tree layout
    for(let i = 0; i < NUM; ++i){
      textAlign(RIGHT,CENTER);
      textSize(20);
      fill(150);
      noStroke();
      text(i + 1 + ".", targets[i].x - 28, targets[i].y);
      stroke(193);
      if(i != 0){
        strokeWeight(2);
        line(targets[i].x - 88, targets[i].y , targets[i].x - 60, targets[i].y);
        strokeWeight(5);
        point(targets[i].x - 60, targets[i].y);
      }
      if(emperors[i].generation != 3){
        strokeWeight(2);
        line(targets[i].x + 184, targets[i].y , targets[i].x + 210, targets[i].y);
        strokeWeight(5);
        point(targets[i].x + 184, targets[i].y);
      }
      strokeWeight(2);
      line(targets[5].x - 88, targets[5].y , targets[6].x - 88, targets[6].y); // hard coded vertical lines
      line(targets[9].x - 88, targets[9].y , targets[10].x - 88, targets[10].y); // hard coded vertical lines
      line(targets[1].x - 88, targets[1].y , targets[7].x - 88, targets[7].y);
      line(targets[2].x - 88, targets[2].y , targets[3].x - 88, targets[3].y);
    }

    emperors.forEach(function(element){
      if(mouseX > (element.location.x - 24) && mouseX < (element.location.x + 50)
        && mouseY > (element.location.y - 24)&& mouseY < (element.location.y + 24)){
          element.is_hover = true;
      }
    });
  }

  is_moving = false;  // *****1 set is_moving to false no matter what
  // Call the appropriate steering behaviors for our agents
  for (let i = 0; i < NUM; i++ ) {
    emperors[i].arrive(targets[i]);
    emperors[i].update(targets[i]);
    if(mode===1){
      emperors[i].drawSpan();
    }
  }
  // the loop is devided into two parts for a better overlaying appearence in the canvas
  for (let i = 0; i < NUM; i++ ) {
    if(mode===1){
      if(emperors[i].show_line || this.is_hover){
        emperors[i].drawLines();
      }
      // if(this.is_hover){
        emperors[i].showNumbers();
      // }
    }else if(mode===2){
      emperors[i].showP();
    }
    emperors[i].display(mode);
    if(emperors[i].is_moving){ // *****2 check if there is any moving members, if there is one, change is_moving to true
      is_moving = true;
    }
  }
  if(!is_moving){mode_change = false;} // *****3 if is_moving is false, that means all the members are done with moving, so mode_change is over, change it to false.
  for(let i = 0; i < 3; ++i){
    // imageMode(CENTER);
    // if(mode === i){
    //   image(red_labels[i], 120, 80 * i + 50, red_labels[i].width/13, red_labels[i].height/13);
    // }else{
    //   image(black_labels[i], 120, 80 * i + 50, black_labels[i].width/13, black_labels[i].height/13);
    // }
    buttons.forEach(function(element, i){
      let distance = dist(mouseX, mouseY, element.location.x, element.location.y);
      if(distance < 30 || mode === i){
        element.on = true;
        // element.is_hover = true;
      }else{
        element.on = false;
        // element.is_hover = false;
      }

      if(distance < 30){element.is_hover = true;}else{element.is_hover = false;}
    });
    buttons[i].display();
  }

  emperors.forEach(function(element){
    element.is_hover = false;
    if(!show_line){
      element.show_line = false;
    }
  });

  //------------------------ title ----------------------------------
  textAlign(CENTER, CENTER);
  textSize(30);
  fill(33);
  noStroke();
  text("Family tree of Eastern Jin Emperors", windowWidth/2 ,46);
  textSize(22);
  text("317 - 420 AD, China", windowWidth/2 ,82);
}

function keyPressed(){
  if (keyCode === 48) {
    toList();
  } else if(keyCode === 49){ // 1
    toTimeline();
  } else if(keyCode === 50){ // 2
    toTree();
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
    toListAge();
  } else if(keyCode === 53){ // 5 name alphabetical
    toListName();
  } else if(keyCode === 54){ // 6 posthumous_name alphabetical
    toListPosthumous();
  } else if(keyCode === 57){ // 9
    toListInvert();
  }else if(keyCode === 76){ // l
    if(mode === 1){
      emperors.forEach((element)=>element.show_line = !element.show_line);
    }
    show_line = !show_line;
  }

}
function mousePressed(){
  // 3 buttons for mode changing

  buttons.forEach(function(element, i){
    let distance = dist(mouseX, mouseY, element.location.x, element.location.y);
    if(distance < 30){
          if(i === 0){toList();}else if(i === 1){toTimeline();}else if(i === 2){toTree();}
    }

  });

  if(mode === 0){// 4 buttons in list layout mode for sorting;
    // let buffer = emperors[0].location.x;
    if(mouseX > (emperors[0].location.x - 24) && mouseX < (emperors[0].location.x + 280)
      && mouseY > 130 && mouseY < 150){
        for(let i = 0; i < mode_0_sort.length; ++i){
          mode_0_sort[i] = false;
        }
        mode_0_sort[0] = true;
        toListPosthumous();
    }
    if(mouseX > (emperors[0].location.x + 280) && mouseX < (emperors[0].location.x + 480)
      && mouseY > 130 && mouseY < 150){
        for(let i = 0; i < mode_0_sort.length; ++i){
          mode_0_sort[i] = false;
        }
        mode_0_sort[1] = true;
        toListName();
    }
    if(mouseX > (emperors[0].location.x + 480) && mouseX < (emperors[0].location.x + 600)
      && mouseY > 130 && mouseY < 150){
        for(let i = 0; i < mode_0_sort.length; ++i){
          mode_0_sort[i] = false;
        }
        mode_0_sort[2] = true;
        toListAge();
    }
    if(mouseX > (emperors[0].location.x + 600) && mouseX < (emperors[0].location.x + 700)
      && mouseY > 130 && mouseY < 150){
        for(let i = 0; i < mode_0_sort.length; ++i){
          mode_0_sort[i] = false;
        }
        mode_0_sort[3] = true;
        inverted = false;
        toList();
    }
    if(mouseX > (emperors[0].location.x + 700) && mouseX < (emperors[0].location.x + 810)
      && mouseY > 130 && mouseY < 150){
        inverted = !inverted;
        for(let i = 0; i < mode_0_sort.length; ++i){
          mode_0_sort[i] = false;
        }
        mode_0_sort[3] = true;
        if(inverted){
          toListInvert();
        }else{
          toList();
        }
        console.log(inverted);
    }

  }else if(mode === 2){// click for detail in tree mode
    emperors.forEach(function(element){
      if(mouseX > (element.location.x - 24) && mouseX < (element.location.x + 50)
        && mouseY > (element.location.y - 24)&& mouseY < (element.location.y + 24)){
          emperors.forEach(function(e){e.is_click = false;});
          element.is_click = true;
      }
    });
  }
}
function toList(){
  if(mode === 1 || mode === 2){
    mode_change = true;
    alpha = 0;
  }
  for(let i = 0; i < mode_0_sort.length; ++i){
    mode_0_sort[i] = false;
  }
  mode_0_sort[3] = true;
  mode = 0;
  is_moving = true;
  // inverted = false;
  emperors.sort((a, b)=> a.order-b.order);
  console.log(emperors);
  for(let i = 0; i < NUM; ++i){
    emperors[i].is_moving = true;
    targets[i] = list_layout[i].copy();
  }
  emperors.forEach(function(element){
    element.is_click = false;
    element.contentHTML.hide();
  });
}
function toTimeline(){
  alpha = 0;
  mode = 1;
  is_moving = true;
  mode_change = true;
  inverted = false;
  emperors.sort((a, b)=> a.order-b.order);
  console.log(emperors);
  for(let i = 0; i < NUM; ++i){
    emperors[i].is_moving = true;
    targets[i] = timeline_layout[i].copy();
  }
  emperors.forEach(function(element){
    element.is_click = false;
    element.contentHTML.hide();
  });
}
function toTree(){
  mode_change = true;
  is_moving = true;
  inverted = false;
  mode = 2;
  emperors.sort((a, b)=> a.order-b.order);
  console.log(emperors);
  for(let i = 0; i < NUM; ++i){
    emperors[i].is_moving = true;
    targets[i] = tree_layout[i].copy();
  }
  emperors.forEach(function(element){
    element.is_click = false;
    element.contentHTML.hide();
  });
}
function toListAge(){
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
  emperors.forEach(function(element){
    element.is_click = false;
    element.contentHTML.hide();
  });
}
function toListName(){
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
  emperors.forEach(function(element){
    element.is_click = false;
    element.contentHTML.hide();
  });
}
function toListPosthumous(){
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
  emperors.forEach(function(element){
    element.is_click = false;
    element.contentHTML.hide();
  });
}
function toListInvert(){
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
  emperors.forEach(function(element){
    element.is_click = false;
    element.contentHTML.hide();
  });
}


// function onList(){button.style('background-color', 'black');}
// function outList(){button.style('background-color', 'rgb(242,242,242)');}
