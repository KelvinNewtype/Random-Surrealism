// script.js

// Grab our canvas and button elements
const canvas = document.getElementById("artCanvas");
const ctx = canvas.getContext("2d");
const generateButton = document.getElementById("generate-btn");
const downloadButton = document.getElementById("download-btn"); // Get the download button

// Array of weird phrases
const weirdPhrases = [
  "Cosmic coffee break!",
  "The dancing platypus sings...",
  "Neon dreams in a midnight circus",
  "Reality is melting",
  "Time for a quantum banana",
  "Whispering shadows of forgotten code"
];

// Function to generate a random integer between min and max
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to get a random color in hex format
function randomColor() {
  const r = randInt(0, 255).toString(16).padStart(2, '0');
  const g = randInt(0, 255).toString(16).padStart(2, '0');
  const b = randInt(0, 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

// Function to draw random shapes and text
function generateWeirdArt() {
  // Clear the canvas with a random dark background
  ctx.fillStyle = `hsl(${randInt(0, 360)}, ${randInt(30, 60)}%, ${randInt(5, 15)}%)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw a random number of shapes
  const shapeCount = randInt(5, 15);
  for (let i = 0; i < shapeCount; i++) {
    ctx.fillStyle = randomColor();
    ctx.strokeStyle = randomColor();
    ctx.lineWidth = randInt(1, 5);

    // Randomly decide which shape to draw: circle, rectangle, or triangle
    const shapeType = randInt(1, 3);
    switch (shapeType) {
      case 1:
        // Circle
        let x = randInt(0, canvas.width);
        let y = randInt(0, canvas.height);
        let radius = randInt(20, 80);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
      case 2:
        // Rectangle
        let rectX = randInt(0, canvas.width);
        let rectY = randInt(0, canvas.height);
        let rectWidth = randInt(30, 150);
        let rectHeight = randInt(30, 150);
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
        ctx.strokeRect(rectX, rectY, rectWidth, rectWidth); //Corrected Height for stroke
        break;
      case 3:
        // Triangle
        let x1 = randInt(0, canvas.width);
        let y1 = randInt(0, canvas.height);
        let x2 = randInt(0, canvas.width);
        let y2 = randInt(0, canvas.height);
        let x3 = randInt(0, canvas.width);
        let y3 = randInt(0, canvas.height);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
    }
  }

  // Add a weird phrase in a random location
  ctx.font = `${randInt(16, 32)}px Courier New`;
  ctx.fillStyle = randomColor();
  const phrase = weirdPhrases[randInt(0, weirdPhrases.length - 1)];
  const textX = randInt(20, canvas.width - 200);
  const textY = randInt(20, canvas.height - 50);
  ctx.fillText(phrase, textX, textY);
}

// Event listener for the generate button click
generateButton.addEventListener("click", generateWeirdArt);

// Event listener for the download button click
downloadButton.addEventListener("click", () => {
  const link = document.createElement('a');
  link.download = 'surrealist-art.png';
  link.href = canvas.toDataURL();
  link.click();
});
