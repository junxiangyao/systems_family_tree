class FamilyMember{
  constructor(data, character, start_location_x, start_location_y){
    this.data = data;
    this.posthumous_name = data.posthumousName[0]+ " (" + data.posthumousName[1] + ")"
    this.posthumous_name_chn = data.posthumousName[1]
    this.posthumous_name_eng = data.posthumousName[0]
    this.name_chn = data.name[1];
    this.name_eng = data.name[0];
    this.name = this.name_eng + " (" + this.name_chn + ")";
    this.reign = data.reign[0] + " - " + data.reign[1];
    this.reign_start = data.reign[0];
    this.reign_end = data.reign[1];
    this.lifespan = data.born + " - " + data.died;
    this.born = data.born;
    this.died = data.died;
    this.lifespan_yrs = data.died - data.born;
    this.throne_yrs = this.reign_end - this.reign_start;
    // this.throne = data.reign[0];
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
    this.is_hover = false;
    this.show_line = false;
    this.is_click = false;
    this.contentHTML = createA(this.data.wiki,"Wikipedia");
    this.contentHTML.attribute("target","_blank");
    this.contentHTML.style("font_size","12px");
    this.normal_size = 14;
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

  display(mode){
    // Draw a triangle rotated in the direction of velocity
    let acc = 0.2;
    fill(127);
    stroke(0);
    strokeWeight(1);
    push();
    translate(this.location.x, this.location.y);
    textAlign(LEFT, CENTER);
    textSize(14);
    fill(33);
    noStroke();
    if(mode === 0){
      text(this.posthumous_name,32,0);
    }else if(mode === 1 && this.is_hover){
      text(this.posthumous_name_eng + " -- " + this.name_eng,32,0);
    }else{
      text(this.posthumous_name_eng,32,0);
    }
    imageMode(CENTER);
    if(mode === 2 && (this.is_hover || this.is_click)){
      if(this.normal_size > 14){this.normal_size-=acc;}else{this.normal_size = 14;}
      image(this.character, 0, 0, this.character.width/this.normal_size, this.character.height/this.normal_size);
    }else{
      if(this.normal_size < 16){this.normal_size+=acc;}else{this.normal_size = 16;}
      image(this.character, 0, 0, this.character.width/this.normal_size, this.character.height/this.normal_size);
    }
    pop();
  }

  showP(){
    if(this.is_hover || this.is_click){
      push();
      translate(this.location.x, this.location.y);
      textAlign(LEFT, CENTER);
      textSize(14);
      fill(33);
      noStroke();
      text(this.name_eng,32,20);
      text("Lifespan: " + this.lifespan + " (" + this.lifespan_yrs + " yrs)",32,40);
      text("Reign: " + this.reign + " (" + this.throne_yrs + " yrs)",32,60);
      pop();
      this.contentHTML.show();
      this.contentHTML.position(this.location.x + 32, this.location.y + 70);
    }else{
      this.contentHTML.hide();
    }


  }
  drawSpan(){
    // stroke(0,0,0,50);
    stroke(193,193,193);
    strokeWeight(10);
    push();
    translate(this.location.x, this.location.y);
    // line(this.location.x, this.location.y, this.born_in_window, this.died_in_window);
    line(0, 17,(this.died_in_window.x - this.born_in_window.x), 17);
    // stroke(235,33,6,250);
    stroke(235,118,107,255);
    strokeWeight(10);

    if(this.reign_end_in_window.x - this.reign_start_in_window.x === 0){
      point((this.reign_start_in_window.x - this.born_in_window.x), 17);
    }else{
      line((this.reign_start_in_window.x - this.born_in_window.x), 17, (this.reign_end_in_window.x - this.born_in_window.x), 17);
    }
    pop();
  }

  showNumbers(){
    if(this.is_hover){
      push();
      translate(this.location.x + 4, this.location.y - 10);
      textAlign(LEFT, CENTER);
      textSize(14);
      fill(150);
      noStroke();
      text(this.born,0,660 - this.location.y + 22);
      text(this.died,this.died_in_window.x - this.born_in_window.x,660 - this.location.y + 22);
      fill(235,118,107);
      if((this.reign_end - this.reign_start) < 4){
        // text(this.reign_start,this.reign_start_in_window.x - this.born_in_window.x,660 - this.location.y - 14);
        text(this.reign_start,this.reign_start_in_window.x - this.born_in_window.x - 32,660 - this.location.y);
      }else{
        text(this.reign_start,this.reign_start_in_window.x - this.born_in_window.x,660 - this.location.y);
      }
      text(this.reign_end,this.reign_end_in_window.x - this.born_in_window.x, 660 - this.location.y);
      pop();
    }
  }

  drawLines(){
    if(this.show_line){
      stroke(193);
      strokeWeight(10);
      push();
      translate(this.location.x, this.location.y);
      // life dots
      strokeWeight(2);
      line(0, 17, 0, 660 - this.location.y);
      line((this.died_in_window.x - this.born_in_window.x), 17, (this.died_in_window.x - this.born_in_window.x), 660 - this.location.y);
      strokeWeight(5);
      point(0, 660 - this.location.y);
      point(this.died_in_window.x - this.born_in_window.x, 660 - this.location.y);
      // red reign dots
      stroke(235,118,107);
      strokeWeight(10);
      if(this.reign_end_in_window.x - this.reign_start_in_window.x === 0){
          strokeWeight(2);
          line((this.reign_start_in_window.x - this.born_in_window.x), 17, (this.reign_start_in_window.x - this.born_in_window.x), 660 - this.location.y);
      }else{
          strokeWeight(2);
          line((this.reign_start_in_window.x - this.born_in_window.x), 17, (this.reign_start_in_window.x - this.born_in_window.x), 660 - this.location.y);
          line((this.reign_end_in_window.x - this.born_in_window.x), 17, (this.reign_end_in_window.x - this.born_in_window.x), 660 - this.location.y);
      }
      fill(240);
      ellipse((this.reign_start_in_window.x - this.born_in_window.x), 660 - this.location.y, 10, 10);
      stroke(193);
      strokeWeight(5);
      point(this.died_in_window.x - this.born_in_window.x, 660 - this.location.y);
      pop();
    }
  }
}
