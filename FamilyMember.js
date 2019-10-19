class FamilyMember{
  constructor(start_location_x,start_location_y){
    this.name = "// IDEA: ";
    this.location = createVector(start_location_x,start_location_y);
    this.velocity = createVector(0,0);
    this.acceleration = createVector(0,0);
    this.maxforce = 6;    // Maximum steering force
    this.maxspeed = 12;    // Maximum speed
  }

  // Method to update location
  update(target) {
    let desired = p5.Vector.sub(target, this.location);  // A vector pointing from the location to the target
    let distance = desired.mag();
    if (distance < 1.5) {
      this.location = target;
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
      ellipse(0, 0, 50, 50);
    pop();
  }
}
