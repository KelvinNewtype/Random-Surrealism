/**
 * RANDOM SURREALISM - COMPLETE ARCHITECTURE
 * Features: Central State, Observer Pattern, Real-time Settings
 */

// --- 1. THE CENTRAL STORE (Single Source of Truth) ---
const Store = {
    state: {
        isGenerating: false,
        currentPhrase: "",
        currentPalette: null,
        canvasWidth: 1920,
        canvasHeight: 1080,
        // UI Parameters
        shapeCount: 15,
        baseSize: 150,
        useColorVariance: true,
        timestamp: null
    },
    listeners: [],
    
    // Updates state and triggers all subscribers
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
const resetBtn = document.getElementById("reset-btn");
const statusElement = document.getElementById("generation-status");

// Inputs
const shapeCountInput = document.getElementById("shape-count");
const shapeSizeInput = document.getElementById("shape-size");
const colorVarianceInput = document.getElementById("color-variance");

// --- 3. ASSETS ---
const etherealPhrases = ["Whispers of Eternity", "Dreams in Technicolor", "The Architecture of Silence", "Echoes from the Void", "Fragments of Tomorrow", "The Weight of Starlight", "Memories Yet to Come", "Dancing with Shadows", "The Geometry of Souls", "Temporal Resonance"];

const colorPalettes = [
    { name: "Royal Twilight", colors: ["#6B46C1", "#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE"], bg: "#0F0A1E" },
    { name: "Golden Hour", colors: ["#D4AF37", "#F4D03F", "#E8B923", "#C9A227", "#A68A2E"], bg: "#1A1614" },
    { name: "Rose Quartz", colors: ["#B76E79", "#D4A5A5", "#E8C1C1", "#F5E1E1", "#FFE5E5"], bg: "#1E1419" },
    { name: "Ocean Depths", colors: ["#0A4D68", "#088395", "#05BFDB", "#00FFCA", "#7FFFD4"], bg: "#0A1A1F" },
    { name: "Sunset Ember", colors: ["#E63946", "#F77F00", "#FCBF49", "#EAE2B7", "#D4A574"], bg: "#1A0F0A" }
];

// --- 4. UTILITIES & DRAWING ENGINE ---
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
    gradient.addColorStop(0, hexToRgba(color, 0.8));
    gradient.addColorStop(1, hexToRgba(randomFromArray(palette.colors), 0.1));
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawRectangle(x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(randFloat(0, Math.PI));
    ctx.fillStyle = hexToRgba(color, 0.6);
    ctx.fillRect(-size/2, -size/2, size, size);
    ctx.restore();
}

function drawTriangle(x, y, size, color) {
    ctx.fillStyle = hexToRgba(color, 0.5);
    ctx.beginPath();
    ctx.moveTo(x, y - size/2);
    ctx.lineTo(x - size/2, y + size/2);
    ctx.lineTo(x + size/2, y + size/2);
    ctx.closePath();
    ctx.fill();
}

// --- 5. THE SUBSCRIBERS ---

// Subscriber A: UI Elements
Store.subscribe((state) => {
    generateButton.disabled = state.isGenerating;
    generateButton.classList.toggle('loading', state.isGenerating);
    
    if (!state.isGenerating && state.currentPhrase) {
        statusElement.textContent = `Vibe: ${state.currentPhrase}`;
    }
});

// Subscriber B: Canvas Redraw
Store.subscribe((state) => {
    // Redraw whenever state changes (real-time response)
    if (state.currentPalette) {
        renderArt(state);
    }
});

// --- 6. CORE LOGIC ---

function triggerGeneration() {
    Store.setState({ isGenerating: true });

    // Pick new random vibes
    const newPalette = randomFromArray(colorPalettes);
    const newPhrase = randomFromArray(etherealPhrases);

    // Short delay for UX feel
    setTimeout(() => {
        Store.setState({ 
            isGenerating: false, 
            currentPalette: newPalette, 
            currentPhrase: newPhrase,
            timestamp: Date.now()
        });
    }, 400);
}

function renderArt(state) {
    const { currentPalette, currentPhrase, canvasWidth, canvasHeight, shapeCount, baseSize, useColorVariance } = state;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    bgGradient.addColorStop(0, currentPalette.bg);
    bgGradient.addColorStop(1, "#000000");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Shapes Loop
    for (let i = 0; i < shapeCount; i++) {
        const x = randInt(0, canvasWidth);
        const y = randInt(0, canvasHeight);
        const color = useColorVariance ? randomFromArray(currentPalette.colors) : currentPalette.colors[0];
        const size = randInt(baseSize * 0.5, baseSize * 1.5);
        const type = randInt(1, 3);

        if (type === 1) drawCircle(x, y, size, color, currentPalette);
        else if (type === 2) drawRectangle(x, y, size, color);
        else drawTriangle(x, y, size, color);
    }

    // Text Overlay
    ctx.shadowColor = "black";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "italic 700 80px 'Playfair Display', serif";
    ctx.textAlign = "center";
    ctx.fillText(currentPhrase, canvasWidth / 2, canvasHeight / 2);
    ctx.shadowBlur = 0; // Reset shadow
}

// --- 7. EVENT LISTENERS ---

// Setting Controls
shapeCountInput.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    document.getElementById("count-val").textContent = val;
    Store.setState({ shapeCount: val });
});

shapeSizeInput.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    document.getElementById("size-val").textContent = val;
    Store.setState({ baseSize: val });
});

colorVarianceInput.addEventListener('change', (e) => {
    Store.setState({ useColorVariance: e.target.checked });
});

resetBtn.addEventListener('click', () => {
    // Reset State
    Store.setState({ shapeCount: 15, baseSize: 150, useColorVariance: true });
    // Sync UI
    shapeCountInput.value = 15;
    shapeSizeInput.value = 150;
    colorVarianceInput.checked = true;
    document.getElementById("count-val").textContent = 15;
    document.getElementById("size-val").textContent = 150;
});

// Primary Actions
generateButton.addEventListener('click', triggerGeneration);

downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `surreal-${Store.state.timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Boot the app
window.addEventListener('load', triggerGeneration);
