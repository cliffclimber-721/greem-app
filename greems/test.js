const canvas2 = document.querySelector("canvas");
const ctx2 = canvas.getContext("2d");

canvas2.width = 800;
canvas2.height = 800;

// 사각형 만들기 -> 좌표값으로 그림 그리기
ctx2.moveTo(50, 50);
ctx2.lineTo(150, 50);
ctx2.lineTo(150, 150);
ctx2.lineTo(50, 150);
ctx2.lineTo(50, 50);
ctx2.fill();