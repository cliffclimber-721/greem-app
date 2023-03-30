const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("files");
const eraseBtn = document.getElementById("erase-btn");
const destroyBtn = document.getElementById("destroy-btn");
const fillBtn = document.getElementById("fill-btn");
const modeBtn = document.getElementById("mode-btn");
const colorOption = Array.from(document.getElementsByClassName("color-option"));
const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";
// isPainting 변수 같은 경우는 초기값이다.
// false 를 준 이유는 범위 안에 마우스를 가져다 대면 내 마우스가 움직이는 대로 선이 그어지기 때문에
// 마우스를 누르는 동시에 그림이 그려지게 된다.
let isPainting = false;
let isFilling = false;

function onMove(event) {
    if(isPainting) {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        return;
    }
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

// 마우스를 누른 채 움직이는 경우
function startPainting() {
    isPainting = true;
}

function cancelPainting() {
    isPainting = false;
    ctx.beginPath();
}

function onModeClick() {
    isPainting = false;
    ctx.fill();
    ctx.beginPath();
    modeBtn.innerText = "Shape Mode 🔴";
}

function onLineWidthChange(e) {
    ctx.lineWidth = e.target.value;
}

function onColorChange(e) {
    ctx.strokeStyle = e.target.value;
    ctx.fillStyle = e.target.value;
}

function onColorClick(e) {
    const colorValue = e.target.dataset.color;
    ctx.strokeStyle = colorValue;
    ctx.fillStyle = colorValue;
    color.value = colorValue;
}

// 상태를 변환하는 함수
function onFillClick() {
    if(isFilling) {
        isFilling = false;
        fillBtn.innerText = "Fill 🎨";
    } else {
        isFilling = true;
        fillBtn.innerText = "Draw ✍️";
    }
}

function onCanvasClick() {
    if(isFilling) {
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}

function onDestroyClick() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraseClick() {
    ctx.strokeStyle = "white";
    isFilling = false;
    fillBtn.innerText = "Fill";
}

function onFileChange(e) {
    // 하나의 파일만 업로드 하기 때문에 첫번째 파일을 가져오는 것이다. (그래서 [0])
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    image.onload = function() {
        ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        fileInput.value = null;
    }
}

function onDoubleClick(e) {
    const text = textInput.value;
    //현재 상태나 색상 스타일 모두 저장
    // canvas 더블클릭해도 텍스트가 없으면 아무것도 안하는 경우엔 아무것도 보이지 않을 것이니까
    // text !== "" => 이 경우는 곧 텍스트가 존재하면 아래와 같은 명령을 진행한다고 볼 수 있다.
    if (text !== ""){
        ctx.save();
        ctx.lineWidth = 1;
        ctx.font = "48px serif"
        ctx.fillText(text, e.offsetX, e.offsetY);
        // 변경 후 restore => 다시 초기 상태로 간다.
        ctx.restore();
    }
}

function onSaveClick() {
    const saveImg = canvas.toDataURL();
    const a = document.createElement("a")
    a.href = saveImg;
    a.download = "myDraws.png";
    a.click();
}

canvas.addEventListener("mousemove", onMove);

// 마우스가 눌렸을 때
canvas.addEventListener("mousedown", startPainting);

// 마우스를 뗐을 때
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
// 아래 mouseleave 를 추가시킨 이유는 범위를 넘어갔음에도 선이 끊어지지 않고 이어졌기 때문에
// 범위 밖을 넘어갔으면 그 선을 끊어줘야하기 때문이다

canvas.addEventListener("click", onCanvasClick);

canvas.addEventListener("dblclick", onDoubleClick);

lineWidth.addEventListener("change", onLineWidthChange);

color.addEventListener("change", onColorChange);

fillBtn.addEventListener("click", onFillClick);

colorOption.forEach(color => color.addEventListener("click", onColorClick));

destroyBtn.addEventListener("click", onDestroyClick);

eraseBtn.addEventListener("click", onEraseClick);

fileInput.addEventListener("change", onFileChange);

saveBtn.addEventListener("click", onSaveClick);

modeBtn.addEventListener("click", onModeClick);
modeBtn.addEventListener("mousedown", onModeClick);