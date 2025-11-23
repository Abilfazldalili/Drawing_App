const canvas = document.querySelector("canvas"),
    toolBtns = document.querySelectorAll(".tool"),
    fillColor = document.querySelector("#fill-color"),
    sizeSlider = document.querySelector("#size-slider"),
    colorBtns = document.querySelectorAll(".colors .option"),
    colorPicker = document.querySelector("#color-picker"),
    clearCanvas = document.querySelector(".clear-canvas"),
    saveImg = document.querySelector(".save-img"),
    ctx = canvas.getContext("2d");
let prevMouseX, prevMouseY, snapshot, isDrawing = false,
    selectedTool = "brush",
    brushWidth = 5,
    selectedColor = "#000";
const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}
window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});
const drawRect = (e) => {
    const width = e.offsetX - prevMouseX;
    const height = e.offsetY - prevMouseY;
    if (!fillColor.checked) {
        ctx.strokeRect(prevMouseX, prevMouseY, width, height);
    } else {
        ctx.fillRect(prevMouseX, prevMouseY, width, height);
    }
}
const drawCircle = (e) => {
    ctx.beginPath();
    const centerX = (prevMouseX + e.offsetX) / 2;
    const centerY = (prevMouseY + e.offsetY) / 2;
    const radius = Math.sqrt(Math.pow((e.offsetX - prevMouseX), 2) + Math.pow((e.offsetY - prevMouseY), 2)) / 2;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}
const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}
const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    if (selectedTool !== "brush" && selectedTool !== "eraser") {
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } else {
        ctx.moveTo(prevMouseX, prevMouseY);
    }
}
const drawing = (e) => {
    if (!isDrawing) return;
    if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke(); 
        ctx.beginPath(); 
        ctx.moveTo(e.offsetX, e.offsetY);
    } else {
        ctx.putImageData(snapshot, 0, 0);
        if (selectedTool === "rectangle") {
            drawRect(e);
        } else if (selectedTool === "circle") {
            drawCircle(e);
        } else {
            drawTriangle(e);
        }
    }
}
const stopDraw = (e) => {
    if (!isDrawing) return;
    isDrawing = false;
    if (selectedTool !== "brush" && selectedTool !== "eraser") {
        ctx.putImageData(snapshot, 0, 0);
        ctx.strokeStyle = selectedColor;
        ctx.fillStyle = selectedColor;
        ctx.lineWidth = brushWidth;
        if (selectedTool === "rectangle") {
            drawRect(e);
        } else if (selectedTool === "circle") {
            drawCircle(e);
        } else {
            drawTriangle(e);
        }
    }
}
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const currentActiveToolElement = document.querySelector(".options .active");
        if (currentActiveToolElement) {
            currentActiveToolElement.classList.remove("active");
        }
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});
sizeSlider.addEventListener("change", () => brushWidth = parseInt(sizeSlider.value)); // FIX: Ensure brushWidth is a number
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const currentlySelectedColorElement = document.querySelector(".options .selected");
        if (currentlySelectedColorElement) {
            currentlySelectedColorElement.classList.remove("selected");
        }
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});
colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
    selectedColor = colorPicker.value; 
});
clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});
saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseout", stopDraw);