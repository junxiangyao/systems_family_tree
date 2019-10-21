class FamilyMember{
  constructor(data, character, start_location_x, start_location_y){
    this.data = data;
    this.posthumous_name = data.posthumousName[0]+ " (" + data.posthumousName[1] + ")"
    this.name_chn = data.name[1];
    this.name_eng = data.name[0];
    this.name = this.name_eng + " (" + this.name_chn + ")";
    this.reign = data.reign[0] + " - " + data.reign[1];
    this.reign_start = data.reign[0];
    this.reign_end = data.reign[1];
    this.lifespan = data.born + " - " + data.died;
    this.born = data.born;
    this.throne = data.reign[0];
    this.generation = data.generation;
    this.order = data.order;
    this.character = character; // image
    this.location = createVector(start_location_x,start_location_y);
    this.velocity = createVector(0,0);
    this.acceleration = createVector(0,0);
    this.maxforce = 6;    // Maximum steering force
    this.maxspeed = 12;    // Maximum speed
    this.is_moving = false;
    this.born_in_window;
    this.died_in_window;
    this.reign_start_in_window;
    this.reign_end_in_window;
    // this.target = target;
  }

  // Method to update location
  update(target) {
    let desired = p5.Vector.sub(target, this.location);  // A vector pointing from the location to the target
    let distance = desired.mag();
    if (distance < 1.5) {
      this.location = target;
      this.is_moving = false;
    } else {
      // Update velocity
      this.velocity.add(this.acceleration);
      // Limit speed
      this.velocity.limit(this.maxspeed);
      this.location.add(this.velocity);
      // Reset accelerationelertion to 0 each cycle
      this.acceleration.mult(0);
    }
  }


  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }


  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  arrive(target) {
    let desired = p5.Vector.sub(target, this.location);  // A vector pointing from the location to the target
    let distance = desired.mag();
    // Scale with arbitrary damping within 100 pixels
    if (distance < 100) {
      let m = map(distance, 0, 100, 0, this.maxspeed);
      desired.setMag(m);
    } else {
      desired.setMag(this.maxspeed);
    }

    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);  // Limit to maximum steering force
    this.applyForce(steer);
  }

  display(){
    // Draw a triangle rotated in the direction of velocity
    fill(127);
    stroke(0);
    strokeWeight(1);
    push();
    translate(this.location.x, this.location.y);
    textAlign(LEFT, CENTER);
    textSize(14);
    fill(33);
    noStroke();
    text(this.posthumous_name,32,0);
    imageMode(CENTER);
    image(this.character, 0, 0, this.character.width/16, this.character.height/16);
    pop();
  }

  showSpan(){

  }
}
