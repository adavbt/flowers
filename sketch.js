let flowers = [
  { name: "Rose", img: null, buttonImg: null },
  { name: "Sunflower", img: null, buttonImg: null },
  { name: "Lily", img: null, buttonImg: null },
  { name: "Yellow Lily", img: null, buttonImg: null },
  { name: "Blue", img: null, buttonImg: null },
  { name: "Purple", img: null, buttonImg: null },
  { name: "Bird", img: null, buttonImg: null },
];

let selectedFlower = null;
let bouquet = [];
let removedBouquet = []; // To keep track of removed flowers
let message = "";
let customFont; // Variable to hold the loaded font

function preload() {
  flowers[0].img = loadImage("rose.png");
  flowers[1].img = loadImage("sunflower.png");
  flowers[2].img = loadImage("lily.png");
  flowers[3].img = loadImage("yellow lily.png");
  flowers[4].img = loadImage("blue.png");
  flowers[5].img = loadImage("purple.png");
  flowers[6].img = loadImage("bird.png");

  flowers[0].buttonImg = loadImage("rose_button.png");
  flowers[1].buttonImg = loadImage("sunflower_button.png");
  flowers[2].buttonImg = loadImage("lily_button.png");
  flowers[3].buttonImg = loadImage("yellow lily_button.png");
  flowers[4].buttonImg = loadImage("blue_button.png");
  flowers[5].buttonImg = loadImage("purple_button.png");
  flowers[6].buttonImg = loadImage("bird_button.png");
  
  customFont = loadFont('BillieJames-YzDn8.otf'); 
  
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#1D467B");
  createUI();
}

function draw() {
  background("#1D467B");

  // Center position
  const centerX = width / 2;

  // Shape dimensions
  const shapeWidth = 570;
  const shapeHeight = 700;
  const shapeX = centerX - shapeWidth / 2;
  const shapeY = 40;

  // Draw the main shape (centered horizontally)
  fill("#e4ccba");
  noStroke();
  beginShape();
  vertex(shapeX, shapeY);
  vertex(shapeX, shapeY + shapeHeight);
  vertex(shapeX + 40, shapeY + shapeHeight);
  vertex(shapeX + 40, shapeY + 35);
  vertex(shapeX + shapeWidth, shapeY + 35);
  vertex(shapeX + shapeWidth, shapeY + shapeHeight);
  vertex(shapeX + shapeWidth + 40, shapeY + shapeHeight);
  vertex(shapeX + shapeWidth + 40, shapeY);
  endShape(CLOSE);

  // Draw the flower selection images
  drawFlowerSelection();

  // Draw rectangle for flower arrangement (centered horizontally)
  noFill();
  noStroke();
  rect(shapeX, shapeY, shapeWidth + 40, shapeHeight);

  // Draw bouquet
  bouquet.forEach((flower) => {
    const drawX = shapeX + flower.relativeX;
    const drawY = shapeY + flower.relativeY;
    image(flower.img, drawX - 82.5, drawY, 165, 525);
  });

  // Draw lower rectangle (centered horizontally and attached to the bottom of the main shape)
  fill("#e4ccba");
  noStroke();
  const lowerRectHeight = 200;
  beginShape();
  vertex(shapeX, shapeY + shapeHeight - lowerRectHeight);
  vertex(shapeX, shapeY + shapeHeight);
  vertex(shapeX + shapeWidth + 40, shapeY + shapeHeight);
  vertex(shapeX + shapeWidth + 40, shapeY + shapeHeight - lowerRectHeight);
  endShape(CLOSE);

  // Calculate center of the lower rectangle for the message
  const lowerRectCenterY = shapeY + shapeHeight - lowerRectHeight / 2;

  // Draw message in the middle of the lower rectangle
  fill("#000000");
  textFont(customFont);
  textSize(40);
  textAlign(CENTER, CENTER);
  text(message, centerX, lowerRectCenterY);

  // Draw new rectangle sticky to the bottom of the page
  fill("#1D467B");
  noStroke();
  const newRectHeight = 110; // Adjust this value as needed
  rect(0, height - newRectHeight, width, newRectHeight);
}

function drawFlowerSelection() {
  const buttonSize = 80; // Increased size for the flower buttons
  const buttonSpacing = 20;
  const startX = buttonSpacing;
  const startY = buttonSpacing;

  flowers.forEach((flower, index) => {
    const x = startX + buttonSize / 2;
    const y = startY + index * (buttonSize + buttonSpacing) + buttonSize / 2;

    const aspectRatio = flower.buttonImg.width / flower.buttonImg.height;
    const buttonHeight = buttonSize;
    const buttonWidth = buttonHeight * aspectRatio;

    image(
      flower.buttonImg,
      x - buttonWidth / 2,
      y - buttonHeight / 2,
      buttonWidth,
      buttonHeight
    ); // Maintain aspect ratio

    if (selectedFlower && selectedFlower.name === flower.name) {
      stroke(255);
      strokeWeight(2);
      noFill();
      ellipse(x, y, buttonSize + 1, buttonSize + 1); // Highlight selected flower
    }
  });
}

function createUI() {
  // Message input
  let input = createInput("");
  input.position(10, height + 60);
  input.size(200);
  input.input(() => {
    message = input.value();
  });

  // Save button
  let saveButton = createButton("Save Bouquet");
  saveButton.position(220, height + 60);
  saveButton.mousePressed(saveBouquet);

  // Undo button
  let undoButton = createButton("Undo");
  undoButton.position(330, height + 60);
  undoButton.mousePressed(undo);

  // Clear All button
  let clearAllButton = createButton("Clear All");
  clearAllButton.position(390, height + 60);
  clearAllButton.mousePressed(clearAll);
}

function selectFlower(flower) {
  selectedFlower = flower;
}

function mousePressed() {
  const buttonSize = 80;
  const buttonSpacing = 30;
  const startX = buttonSpacing;
  const startY = buttonSpacing;

  // Check if a flower selection image is clicked
  flowers.forEach((flower, index) => {
    const x = startX + buttonSize / 2;
    const y = startY + index * (buttonSize + buttonSpacing) + buttonSize / 2;

    let d = dist(mouseX, mouseY, x, y);
    if (d < buttonSize / 2) {
      selectFlower(flower);
    }
  });

 // Add flower to the bouquet if within the specified area
  const centerX = width / 2;
  const shapeWidth = 570;
  const shapeHeight = 700;
  const shapeX = centerX - shapeWidth / 2;
  const shapeY = 40;
  
  if (
    selectedFlower &&
    mouseX > shapeX &&
    mouseX < shapeX + shapeWidth + 40 &&
    mouseY > shapeY &&
    mouseY < shapeY + shapeHeight
  ) {
    // Calculate the position relative to the centered shape
    const relativeX = mouseX - shapeX;
    const relativeY = mouseY - shapeY;
    
    bouquet.push({
      relativeX: relativeX,
      relativeY: relativeY,
      img: selectedFlower.img,
    });
    removedBouquet = []; // Clear redo stack on new addition
  }

}
function undo() {
  if (bouquet.length > 0) {
    let removed = bouquet.pop();
    removedBouquet.push(removed);
    redrawCanvas(); // Redraw canvas after undo
  }
}

function clearAll() {
  bouquet = []; // Clear all flowers from the bouquet
  removedBouquet = []; // Clear the redo stack
  redrawCanvas(); // Redraw canvas after clearing all
}

function redrawCanvas() {
  background("#1D467B");

  const centerX = width / 2;
  const shapeWidth = 570;
  const shapeHeight = 700;
  const shapeX = centerX - shapeWidth / 2;
  const shapeY = 40;

  // Draw the main shape
  fill("#e4ccba");
  noStroke();
  beginShape();
  vertex(shapeX, shapeY);
  vertex(shapeX, shapeY + shapeHeight);
  vertex(shapeX + 40, shapeY + shapeHeight);
  vertex(shapeX + 40, shapeY + 35);
  vertex(shapeX + shapeWidth, shapeY + 35);
  vertex(shapeX + shapeWidth, shapeY + shapeHeight);
  vertex(shapeX + shapeWidth + 40, shapeY + shapeHeight);
  vertex(shapeX + shapeWidth + 40, shapeY);
  endShape(CLOSE);

  // Draw bouquet
  bouquet.forEach((flower) => {
    const drawX = shapeX + flower.relativeX;
    const drawY = shapeY + flower.relativeY;
    image(flower.img, drawX - 82.5, drawY, 165, 525);
  });

  // Draw lower rectangle
  fill("#e4ccba");
  noStroke();
  const lowerRectHeight = 200;
  beginShape();
  vertex(shapeX, shapeY + shapeHeight - lowerRectHeight);
  vertex(shapeX, shapeY + shapeHeight);
  vertex(shapeX + shapeWidth + 40, shapeY + shapeHeight);
  vertex(shapeX + shapeWidth + 40, shapeY + shapeHeight - lowerRectHeight);
  endShape(CLOSE);

  // Draw message
  const lowerRectCenterY = shapeY + shapeHeight - lowerRectHeight / 2;
  fill("#000000");
  textFont(customFont);
  textSize(40);
  textAlign(CENTER, CENTER);
  text(message, centerX, lowerRectCenterY);

  // Draw new rectangle sticky to the bottom of the page
  fill("#1D467B");
  noStroke();
  const newRectHeight = 100; // Adjust this value as needed
  rect(0, height - newRectHeight, width, newRectHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redrawCanvas();
}

function saveBouquet() {
  // Save the canvas as an image
  saveCanvas('bouquet', 'png');
}
