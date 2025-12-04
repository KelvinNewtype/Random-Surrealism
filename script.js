const canvas = document.getElementById("artCanvas");
const ctx = canvas.getContext("2d");
const generateButton = document.getElementById("generate-btn");
const downloadButton = document.getElementById("download-btn");
const statusElement = document.getElementById("generation-status");

// Canvas dimensions (1080p for high quality)
const canvasWidth = 1920;
const canvasHeight = 1080;

// Poetic phrases for artwork
const etherealPhrases = [
    "Whispers of Eternity",
    "Dreams in Technicolor",
    "The Architecture of Silence",
    "Echoes from the Void",
    "Fragments of Tomorrow",
    "The Weight of Starlight",
    "Memories Yet to Come",
    "Dancing with Shadows",
    "The Geometry of Souls",
    "Temporal Resonance"
];

// Elegant color palettes
const colorPalettes = [
    {
        name: "Royal Twilight",
        colors: ["#6B46C1", "#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE"],
        bg: "#0F0A1E"
    },
    {
        name: "Golden Hour",
        colors: ["#D4AF37", "#F4D03F", "#E8B923", "#C9A227", "#A68A2E"],
        bg: "#1A1614"
    },
    {
        name: "Rose Quartz",
        colors: ["#B76E79", "#D4A5A5", "#E8C1C1", "#F5E1E1", "#FFE5E5"],
        bg: "#1E1419"
    },
    {
        name: "Ocean Depths",
        colors: ["#0A4D68", "#088395", "#05BFDB", "#00FFCA", "#7FFFD4"],
        bg: "#0A1A1F"
    },
    {
        name: "Sunset Ember",
        colors: ["#E63946", "#F77F00", "#FCBF49", "#EAE2B7", "#D4A574"],
        bg: "#1A0F0A"
    }
];

// Utility Functions
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Shape Drawing Functions
function drawCircle(x, y, radius, color, palette) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, hexToRgba(color, 0.9));
    gradient.addColorStop(1, hexToRgba(randomFromArray(palette.colors), 0.3));
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Add subtle stroke
    ctx.strokeStyle = hexToRgba(color, 0.5);
    ctx.lineWidth = randInt(2, 4);
    ctx.stroke();
}

function drawRectangle(x, y, width, height, color, rotation = 0) {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(rotation);
    
    const gradient = ctx.createLinearGradient(-width / 2, -height / 2, width / 2, height / 2);
    gradient.addColorStop(0, hexToRgba(color, 0.8));
    gradient.addColorStop(1, hexToRgba(color, 0.4));
    
    ctx.fillStyle = gradient;
    ctx.fillRect(-width / 2, -height / 2, width, height);
    
    ctx.strokeStyle = hexToRgba(color, 0.6);
    ctx.lineWidth = randInt(2, 5);
    ctx.strokeRect(-width / 2, -height / 2, width, height);
    
    ctx.restore();
}

function drawTriangle(x1, y1, x2, y2, x3, y3, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    
    ctx.fillStyle = hexToRgba(color, 0.7);
    ctx.fill();
    
    ctx.strokeStyle = hexToRgba(color, 0.9);
    ctx.lineWidth = randInt(2, 4);
    ctx.stroke();
}

function drawPolygon(x, y, radius, sides, color, rotation = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 * i) / sides;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    
    ctx.fillStyle = hexToRgba(color, 0.6);
    ctx.fill();
    
    ctx.strokeStyle = hexToRgba(color, 0.8);
    ctx.lineWidth = randInt(2, 5);
    ctx.stroke();
    
    ctx.restore();
}

function drawBezierCurve(palette) {
    ctx.beginPath();
    const startX = randInt(0, canvasWidth);
    const startY = randInt(0, canvasHeight);
    ctx.moveTo(startX, startY);
    
    for (let i = 0; i < randInt(2, 4); i++) {
        const cp1x = randInt(0, canvasWidth);
        const cp1y = randInt(0, canvasHeight);
        const cp2x = randInt(0, canvasWidth);
        const cp2y = randInt(0, canvasHeight);
        const endX = randInt(0, canvasWidth);
        const endY = randInt(0, canvasHeight);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
    }
    
    ctx.strokeStyle = hexToRgba(randomFromArray(palette.colors), 0.5);
    ctx.lineWidth = randInt(3, 8);
    ctx.lineCap = 'round';
    ctx.stroke();
}

// Main Art Generation Function
function generateArt() {
    // Disable button during generation
    generateButton.classList.add('loading');
    generateButton.disabled = true;
    downloadButton.disabled = false;
    
    // Set canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Select random palette
    const palette = randomFromArray(colorPalettes);
    
    // Draw background with gradient
    const bgGradient = ctx.createRadialGradient(
        canvasWidth / 2, canvasHeight / 2, 0,
        canvasWidth / 2, canvasHeight / 2, Math.max(canvasWidth, canvasHeight)
    );
    bgGradient.addColorStop(0, palette.bg);
    bgGradient.addColorStop(1, '#000000');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Add texture overlay
    for (let i = 0; i < 5000; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${randFloat(0.01, 0.05)})`;
        ctx.fillRect(randInt(0, canvasWidth), randInt(0, canvasHeight), 1, 1);
    }
    
    // Draw shapes
    const shapeCount = randInt(8, 20);
    
    for (let i = 0; i < shapeCount; i++) {
        const color = randomFromArray(palette.colors);
        const shapeType = randInt(1, 6);
        
        switch (shapeType) {
            case 1: // Circle
                drawCircle(
                    randInt(0, canvasWidth),
                    randInt(0, canvasHeight),
                    randInt(40, 200),
                    color,
                    palette
                );
                break;
                
            case 2: // Rectangle
                drawRectangle(
                    randInt(0, canvasWidth),
                    randInt(0, canvasHeight),
                    randInt(80, 300),
                    randInt(80, 300),
                    color,
                    randFloat(0, Math.PI * 2)
                );
                break;
                
            case 3: // Triangle
                drawTriangle(
                    randInt(0, canvasWidth), randInt(0, canvasHeight),
                    randInt(0, canvasWidth), randInt(0, canvasHeight),
                    randInt(0, canvasWidth), randInt(0, canvasHeight),
                    color
                );
                break;
                
            case 4: // Polygon
                drawPolygon(
                    randInt(100, canvasWidth - 100),
                    randInt(100, canvasHeight - 100),
                    randInt(60, 180),
                    randInt(5, 8),
                    color,
                    randFloat(0, Math.PI * 2)
                );
                break;
                
            case 5: // Bezier curves
                drawBezierCurve(palette);
                break;
                
            case 6: // Overlapping circles
                const cx = randInt(100, canvasWidth - 100);
                const cy = randInt(100, canvasHeight - 100);
                for (let j = 0; j < 3; j++) {
                    drawCircle(
                        cx + randInt(-50, 50),
                        cy + randInt(-50, 50),
                        randInt(60, 120),
                        randomFromArray(palette.colors),
                        palette
                    );
                }
                break;
        }
    }
    
    // Add ethereal text
    const phrase = randomFromArray(etherealPhrases);
    ctx.font = `${randInt(40, 80)}px 'Playfair Display', serif`;
    ctx.fillStyle = hexToRgba(randomFromArray(palette.colors), 0.8);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Text with shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillText(phrase, canvasWidth / 2, canvasHeight / 2);
    ctx.shadowBlur = 0;
    
    // Update status
    statusElement.textContent = `New artwork generated: ${phrase}`;
    
    // Re-enable button
    setTimeout(() => {
        generateButton.classList.remove('loading');
        generateButton.disabled = false;
    }, 300);
}

// Download Function
function downloadArt() {
    const link = document.createElement('a');
    const timestamp = new Date().getTime();
    link.download = `ethereal-canvas-${timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Event Listeners
generateButton.addEventListener('click', generateArt);
downloadButton.addEventListener('click', downloadArt);

// Generate initial artwork on load
window.addEventListener('load', () => {
    setTimeout(generateArt, 500);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'g' || e.key === 'G') {
        generateArt();
    } else if (e.key === 'd' || e.key === 'D') {
        if (!downloadButton.disabled) {
            downloadArt();
        }
    }
});
