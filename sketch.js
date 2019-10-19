/********************************************************
 * MAT259 PROJ.1   2D Matrix                            *
 *                                                      *
 * Junxiang Yao                                         *
 *                                                      *
 * Press G to show / hide the grid system.              *
 ********************************************************/
//layout
let horizontalMargin = 150;
let verticalMargin = 140;
let is_moving = false;

function preload() {
  // table = loadTable('./data/AllSports.csv','csv','header');
  // colorBar = loadImage('./data/colorBar.jpg');
}

function windowResized(){
  if(windowWidth > 800){
    resizeCanvas(windowWidth,windowHeight);
  }
}
let i;
function setup() {
  createCanvas(windowWidth,windowHeight);
  i = new FamilyMember(windowWidth/2, windowHeight/2);
  console.log(i.name);
}

function draw() {
  background(255);

  background(255);

  let mouse = createVector(mouseX, mouseY);

  // Draw an ellipse at the mouse location
  fill(200);
  stroke(0);
  strokeWeight(2);
  ellipse(mouse.x, mouse.y, 48, 48);

  // Call the appropriate steering behaviors for our agents
  i.arrive(mouse);
  i.update(mouse);
  i.display();
}
