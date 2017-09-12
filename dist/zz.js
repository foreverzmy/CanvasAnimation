const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const mWidth = canvas.width;
const mHeight = canvas.height;
const alpha = 60;
const len = 100;
const level = 4;
ramus(mWidth / 2, mHeight, alpha, len, level);
function ramus(x, y, alpha, length, level) {
    ctx.strokeStyle = '#f00';
    ctx.lineWidth = 2;
    ctx.moveTo(x, y);
    ctx.lineTo(x, len);
    ctx.stroke();
}
//# sourceMappingURL=E:/MyDemo/CanvasAnimation/zz.js.map