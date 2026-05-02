/**
 * RANDOM SURREALISM - CENTRAL STATE ARCHITECTURE
 * Implementation of the Observer Pattern for Vanilla JS
 */

// --- 1. THE CENTRAL STORE ---
const Store = {
    // The Data
    state: {
        isGenerating: false,
        currentPhrase: "",
        currentPalette: null,
        canvasWidth: 1920,
        canvasHeight: 1080,
        timestamp: null
    },

    // The Observers (Functions that run when state changes)
    listeners: [],

    // The Dispatcher (Updates state and notifies everyone)
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    },

    // The Subscription Mechanism
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

// --- 3. DATA ASSETS (Constants) ---
const etherealPhrases = ["Whispers of Eternity", "Dreams in Technicolor", "The Architecture of Silence", "Echoes from the Void", "Fragments of Tomorrow", "The Weight of Starlight", "Memories Yet to Come", "Dancing with Shadows", "The Geometry of Souls", "Temporal Resonance"];

const colorPalettes = [
    { name: "Royal Twilight", colors: ["#6B46C1", "#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE"], bg: "#0F0A1E" },
    { name: "Golden Hour", colors: ["#D4AF37", "#F4D03F", "#E8B923", "#C9A227", "#A68A2E"], bg: "#1A1614" },
    { name: "Rose Quartz", colors: ["#B76E79", "#D4A5A5", "#E8C1C1", "#F5E1E1", "#FFE5E5"], bg: "#1E1419" },
    { name: "Ocean Depths", colors: ["#0A4D68", "#088395", "#05BFDB", "#00FFCA", "#7FFFD4"], bg: "#0A1A1F" },
    { name: "Sunset Ember", colors: ["#E63946", "#F77F00", "#FCBF49", "#EAE2B7", "#D4A574"], bg: "#1A0F0A" }
];

// --- 4. DRAWING MODULES (Stateless Functions) ---
// Note: These functions now receive their data from the state rather than global variables
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randFloat(min, max) { return Math.random() * (max - min) + min; }
function randomFromArray(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ... [Keep your drawCircle, drawRectangle, drawTriangle, drawPolygon, drawBezierCurve functions here] ...
// (The logic inside them remains the same as your original JS)

// --- 5. THE SUBSCRIBERS (Reactive UI) ---

// UI Subscriber: Handles buttons and status text
Store.subscribe((state) => {
    if (state.isGenerating) {
        generateButton.classList.add('loading');
        generateButton.disabled = true;
        downloadButton.disabled = true;
    } else {
        generateButton.classList.remove('loading');
        generateButton.disabled = false;
        downloadButton.disabled = false;
        statusElement.textContent = `New artwork generated: ${state.currentPhrase}`;
    }
});

// Canvas Subscriber: Handles the actual drawing
Store.subscribe((state) => {
    // Only trigger a full redraw if we have a palette and aren't mid-process
    if (!state.isGenerating && state.currentPalette) {
        renderArt(state);
    }
});

// --- 6. CORE LOGIC ---

function triggerGeneration() {
    // 1. Update state to "Generating"
    Store.setState({
        isGenerating: true,
        currentPalette: randomFromArray(colorPalettes),
        currentPhrase: randomFromArray(etherealPhrases),
        timestamp: new Date().getTime()
    });

    // 2. Simulate processing delay
    setTimeout(() => {
        Store.setState({ isGenerating: false });
    }, 500);
}

function renderArt(state) {
    const { currentPalette, currentPhrase, canvasWidth, canvasHeight } = state;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Draw Background
    const bgGradient = ctx.createRadialGradient(canvasWidth/2, canvasHeight/2, 0, canvasWidth/2, canvasHeight/2, Math.max(canvasWidth, canvasHeight));
    bgGradient.addColorStop(0, currentPalette.bg);
    bgGradient.addColorStop(1, '#000000');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Add Noise Texture
    for (let i = 0; i < 5000; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${randFloat(0.01, 0.05)})`;
        ctx.fillRect(randInt(0, canvasWidth), randInt(0, canvasHeight), 1, 1);
    }

    // Draw Randomized Shapes
    const shapeCount = randInt(8, 20);
    for (let i = 0; i < shapeCount; i++) {
        const color = randomFromArray(currentPalette.colors);
        const type = randInt(1, 5);
        // ... call your draw functions using state.currentPalette ...
        if (type === 1) drawCircle(randInt(0, canvasWidth), randInt(0, canvasHeight), randInt(40, 200), color, currentPalette);
        // [Add other shape types here as per original code]
    }

    // Draw Text
    ctx.font = `${randInt(40, 80)}px 'Playfair Display', serif`;
    ctx.fillStyle = hexToRgba(randomFromArray(currentPalette.colors), 0.8);
    ctx.textAlign = 'center';
    ctx.fillText(currentPhrase, canvasWidth / 2, canvasHeight / 2);
}

function downloadArt() {
    const link = document.createElement('a');
    link.download = `ethereal-${Store.state.timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// --- 7. EVENT LISTENERS ---
generateButton.addEventListener('click', triggerGeneration);
downloadButton.addEventListener('click', downloadArt);

window.addEventListener('load', triggerGeneration);

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'g') triggerGeneration();
    if (e.key.toLowerCase() === 'd') downloadArt();
});
