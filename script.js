/**
 * RANDOM SURREALISM - CENTRAL STATE ARCHITECTURE
 */

// --- 1. THE CENTRAL STORE ---
const Store = {
    state: {
        isGenerating: false,
        currentPhrase: "",
        currentPalette: null,
        canvasWidth: 1920,
        canvasHeight: 1080,
        timestamp: null
    },
    listeners: [],
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    },
    subscribe(callback) {
        this.listeners.push(callback);
    },
    notify() {
        this.listeners.forEach(callback => callback(this.state));
    }
};

// --- 2. DOM ELEMENTS ---
const canvas = document.getElementById("artCanvas");
const ctx = canvas.getContext("2d");
const generateButton = document.getElementById("generate-btn");
const downloadButton = document.getElementById("download-btn");
const statusElement = document.getElementById("generation-status");

// --- 3. DATA ASSETS ---
const etherealPhrases = ["Whispers of Eternity", "Dreams in Technicolor", "The Architecture of Silence", "Echoes from the Void", "Fragments of Tomorrow", "The Weight of Starlight", "Memories Yet to Come", "Dancing with Shadows", "The Geometry of Souls", "Temporal Resonance"];

const colorPalettes = [
    { name: "Royal Twilight", colors: ["#6B46C1", "#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE"], bg: "#0F0A1E" },
    { name: "Golden Hour", colors: ["#D4AF37", "#F4D03F", "#E8B923", "#C9A227", "#A68A2E"], bg: "#1A1614" },
    { name: "Rose Quartz", colors: ["#B76E79", "#D4A5A5", "#E8C1C1", "#F5E1E1", "#FFE5E5"], bg: "#1E1419" },
    { name: "Ocean Depths", colors: ["#0A4D68", "#088395", "#05BFDB", "#00FFCA", "#7FFFD4"], bg: "#0A1A1F" },
    { name: "Sunset Ember", colors: ["#E63946", "#F77F00", "#FCBF49", "#EAE2B7", "#D4A574"], bg: "#1A0F0A" }
];

// --- 4. UTILITY & DRAWING FUNCTIONS ---
// (We keep these mostly the same, ensuring they use the global ctx)
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) => Math.random() * (max - min) + min;
const randomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];
const hexToRgba = (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function drawCircle(x, y, radius, color, palette) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, hexToRgba(color, 0.9));
    gradient.addColorStop(1, hexToRgba(randomFromArray(palette.colors), 0.3));
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

// [Note: Re-include your drawRectangle, drawTriangle, etc. here using the global ctx]

// --- 5. THE SUBSCRIBERS (Reaction Logic) ---

// **Subscriber A: Update UI Elements**
Store.subscribe((state) => {
    generateButton.disabled = state.isGenerating;
    downloadButton.disabled = state.isGenerating;
    
    if (state.isGenerating) {
        generateButton.classList.add('loading');
        statusElement.textContent = "Generating masterpiece...";
    } else {
        generateButton.classList.remove('loading');
        if (state.currentPhrase) {
            statusElement.textContent = `Art generated: ${state.currentPhrase}`;
        }
    }
});

// **Subscriber B: Trigger Canvas Redraw**
Store.subscribe((state) => {
    // We only draw when isGenerating becomes false AND we have a palette
    if (!state.isGenerating && state.currentPalette) {
        renderArt(state);
    }
});

// --- 6. CORE LOGIC ---

function triggerGeneration() {
    // Start generating
    Store.setState({ 
        isGenerating: true,
        timestamp: new Date().getTime() 
    });

    // Pick data
    const newPalette = randomFromArray(colorPalettes);
    const newPhrase = randomFromArray(etherealPhrases);

    // Artificial delay for "Premium" feel and to allow UI to update
    setTimeout(() => {
        Store.setState({ 
            isGenerating: false, 
            currentPalette: newPalette, 
            currentPhrase: newPhrase 
        });
    }, 600);
}

function renderArt(state) {
    const { currentPalette, currentPhrase, canvasWidth, canvasHeight } = state;

    // Reset Canvas
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Draw Background
    const bgGradient = ctx.createRadialGradient(canvasWidth/2, canvasHeight/2, 0, canvasWidth/2, canvasHeight/2, Math.max(canvasWidth, canvasHeight));
    bgGradient.addColorStop(0, currentPalette.bg);
    bgGradient.addColorStop(1, '#000000');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw Shapes (Example Loop)
    for (let i = 0; i < randInt(10, 20); i++) {
        const color = randomFromArray(currentPalette.colors);
        drawCircle(randInt(0, canvasWidth), randInt(0, canvasHeight), randInt(50, 300), color, currentPalette);
    }

    // Draw Text Overlay
    ctx.font = `${randInt(50, 90)}px 'Playfair Display', serif`;
    ctx.fillStyle = hexToRgba(randomFromArray(currentPalette.colors), 0.9);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 15;
    ctx.fillText(currentPhrase, canvasWidth / 2, canvasHeight / 2);
}

// --- 7. INITIALIZATION ---
generateButton.addEventListener('click', triggerGeneration);
downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `surrealism-${Store.state.timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Initial load
window.addEventListener('load', triggerGeneration);
