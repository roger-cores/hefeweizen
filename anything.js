color bgColor = color(#ecf0f1);
int xOffset, yOffset;
float xScale = 50, yScale = 1;
float increment = 0.8;
float baseIncrement = 0.8;
boolean resetMode = false;
boolean dragMode = false;
int mX = -1, mY = -1;


void setup(){
	size(800, 500);
	xOffset = width/6;
	yOffset = height/2 + height/3;
	smooth();
	rectMode(CENTER);
	frameRate(24);
	buttonColor = color(#266040, 80);
	highlight = color(#266040);
	left			= new RectButton(20, 60, 30, 30, buttonColor, highlight);
	left.setPoints(20, 60, 30, 50, 30, 70);
	center		= new RectButton(60, 60, 30, 30, buttonColor, highlight);
	//center.setPoints(20, 60, 30, 10, 30, 30);
	up				= new RectButton(60, 20, 30, 30, buttonColor, highlight);
	up.setPoints(60, 20, 50, 30, 70, 30);
	down			= new RectButton(60, 100, 30, 30, buttonColor, highlight);
	down.setPoints(60, 100, 50, 90, 70, 90);
	right			= new RectButton(100, 60, 30, 30, buttonColor, highlight);
	right.setPoints(100, 60, 90, 50, 90, 70);

	scaleLeft				= new RectButton(width - 20, 60, 30, 30, buttonColor, highlight);
	scaleLeft.setTitle("x+");
	scaleReset			= new RectButton(width - 60, 60, 30, 30, buttonColor, highlight);
	scaleUp					= new RectButton(width - 60, 20, 30, 30, buttonColor, highlight);
	scaleUp.setTitle("y+");
	scaleDown				= new RectButton(width - 60, 100, 30, 30, buttonColor, highlight);
	scaleDown.setTitle("y-");
	scaleRight			= new RectButton(width - 100, 60, 30, 30, buttonColor, highlight);
	scaleRight.setTitle("x-");

}

void draw(){
	background(bgColor);
	stroke(255);
	update(mouseX, mouseY);
	drawAxis();
	drawSignal();
	left.display();
	center.display();
	up.display();
	down.display();
	right.display();

	scaleUp.display();
	scaleDown.display();
	scaleRight.display();
	scaleLeft.display();
	scaleReset.display();

}

void drawSignal(){ //draws a sin wave
	strokeWeight(2);
	stroke(#16a085);
	int x,xx;
	for(x=0; x<dt.length-1; x+=1){
		line(xOffset+ (x)*xScale, getY(x), xOffset+ (x+1)*xScale, getY(x+1));
		fill(#000000);
		if(xScale>35)
			text(""+dt[x].data.toFixed(1), xOffset+ x*xScale, getY(x) - 5);
		else if(x%10 == 0) text(""+dt[x].data.toFixed(1), xOffset+ x*xScale, getY(x) - 5);
		if(xScale<30 && x%10 ==0)
			text(""+dt[x].date.getFullYear()+"-"+(dt[x].date.getMonth()+1) + "-" + (dt[x].date.getDate()), xOffset+ x*xScale, yOffset + 15);
		else if(xScale<60 && x%5 == 0)
			text(""+dt[x].date.getFullYear()+"-"+(dt[x].date.getMonth()+1) + "-" + (dt[x].date.getDate()), xOffset+ x*xScale, yOffset + 15);
		else if(xScale>60) text(""+dt[x].date.getFullYear()+"-"+(dt[x].date.getMonth()+1) + "-" + (dt[x].date.getDate()), xOffset+ x*xScale, yOffset + 15);
	}
}

int getSinY(int x){
	return yOffset + (yScale * 20) /*amplitude*/ * Math.sin((x-xOffset)/(20 /*necessary for good visuals*/ * xScale));
}

int getY(int x){
	return yOffset - dt[x].data * yScale;
}

void drawAxis(){
	strokeWeight(1);
	stroke(#8e44ad);
	int x; //for x axis
	for(x=0; x<width; x+=10){
		line(x, yOffset, x+5, yOffset);
	}

	int y;
	for(y=0; y<height; y+=10){
		line(xOffset, y, xOffset, y+5);
	}
}

void mouseOut(){
	mouseReleased();
}

void update(int x, int y){


	left.update();
	center.update();
	up.update();
	down.update();
	right.update();

	scaleUp.update();
	scaleDown.update();
	scaleRight.update();
	scaleLeft.update();
	scaleReset.update();

	if(mousePressed){
		if(up.pressed() && yOffset>20){
			resetMode = false;
			yOffset -= increment;
			increment += 0.1;
		} else if(center.pressed()){
			if(xOffset != width/6 || yOffset != height/2 + height/3)
				resetMode = true;
		} else if(down.pressed() && yOffset<height-20){
			resetMode = false;
			yOffset += increment;
			increment += 0.1;
		} else if(left.pressed() && xOffset>20){
			resetMode = false;
			xOffset -= increment;
			increment += 0.1;
		} else if(right.pressed() && xOffset<width-20){
			resetMode = false;
			xOffset += increment;
			increment += 0.1;
		} else if(scaleUp.pressed()){
			yScale += 0.1;
		} else if(scaleDown.pressed()){
			yScale -= 0.1;
			if(yScale < 0) yScale = 0.01;
		} else if(scaleLeft.pressed()){
			xScale += 0.1;
			println(xScale);
		} else if(scaleRight.pressed()){
			xScale -= 0.1;
			if(xScale < 1) xScale = 1;
			println(xScale);
		} else if(scaleReset.pressed()){
			xScale = 50;
			yScale = 1;
		} else {
			dragMode = true;
		}
	}

	if(resetMode){ //if resetMode active

		int xDest = width/6;
		int yDest = height/2 + height/3;

		int xDistance = Math.abs(xOffset - xDest);
		int yDistance = Math.abs(yOffset - yDest);
		float xIncrement, yIncrement;
		float percLongerDistance;
		if(xDistance > yDistance){
			percLongerDistance = increment/xDistance * 100;
			yIncrement = percLongerDistance/100 * yDistance;
			xIncrement = increment;
		} else {
			percLongerDistance = increment/yDistance * 100;
			xIncrement = percLongerDistance/100 * xDistance;
			yIncrement = increment
		}

		if(xDistance < xIncrement) { //if increment is greater than actual distance to be travelled
			xOffset = xDest; //just go to destination
		} else { //else +/- increment
			xOffset += Math.sign(xDest - xOffset) * xIncrement;
		}
		if(yDistance < yIncrement) {
			yOffset = yDest;
		} else {
			yOffset += Math.sign(yDest - yOffset) * yIncrement;
		}

		if(xOffset == xDest && yOffset == yDest) {
			resetMode = false;
			increment = baseIncrement;
		}
		increment += 0.1;
	}
}

void mouseDragged(){


	if(dragMode){
		int dX = 0, dY = 0;
		if(mX != -1){
			dX = mouseX - mX;
			dY = mouseY - mY;
		}

		mX = mouseX;
		mY = mouseY;

		xOffset += dX;
		yOffset += dY;
	}



}

void mouseReleased(){
	increment = baseIncrement;
	dragMode = false;
	mX = -1;
	mY = -1;
}

class Button {

	int x, y; //position
	int xsize, ysize, actualxSize, actualySize;
	color baseColor, highlightColor, currentColor;
	boolean hover = false;
	boolean pressed = false;


	boolean over(){
		return true;
	}
}

class RectButton extends Button {

	int p1x, p1y, p2x, p2y, p3x, p3y;
	var title;

	RectButton(int nx, int ny, int nxsize, int nysize, color bcolor, color hcolor){
		x = nx;
		y = ny;
		xsize = nxsize;
		actualxSize = nxsize;
		ysize = nysize;
		actualySize = nysize;
		baseColor = bcolor;
		highlightColor = hcolor;
		currentColor = baseColor;
	}

	void setTitle(title){
		this.title = title;
	}

	void setPoints(int pp1x, int pp1y, int pp2x, int pp2y, int pp3x, int pp3y){
		p1x = pp1x;
		p1y = pp1y;
		p2x = pp2x;
		p2y = pp2y;
		p3x = pp3x;
		p3y = pp3y;
	}

	void display() {
		strokeWeight(3);
		if(hover) stroke(color(#f1c40f));
		else stroke(color(#3498db));
		fill(currentColor);
		line(p1x, p1y, p2x, p2y);
		line(p1x, p1y, p3x, p3y);



		if(hover){
			actualxSize = actualxSize + 0.5 * sin(frameCount/4);
			actualySize = actualySize + 0.5 * sin(frameCount/4);
		} else {
			actualxSize = xsize;
			actualySize = ysize;
		}


		rect(x, y, actualxSize, actualySize);
		if(title){
			fill(color(#000000))
			text(title, x-5, y+5);
		}
  }

	boolean overRect(int x, int y, int width, int height){
		if(mouseX+10 >= x && mouseX+10 <= x+width && mouseY+10 >= y && mouseY+10 <= y+height){
			return true;
		} else {
			return false;
		}
	}

	boolean over(){
		if(overRect(x, y, xsize, ysize)){
			hover = true;
			return true;
		} else {
			hover = false;
			return false;
		}
	}

	boolean pressed(){
		if(hover){
			return true;
		} else {
			return false;
		}
	}

	void update(){
		if(over()){
			currentColor = highlightColor;
		} else {
			currentColor = baseColor;
		}
	}
}
