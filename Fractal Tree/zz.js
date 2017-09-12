var xAngle = 50 * Math.PI / 180; // 角度的一半
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var domAngle = document.getElementById('xAngle');
var mWidth = canvas.width;
var mHeight = canvas.height;
var len = 200; // 第一主干线长
var proportion = 0.7; // 支干与主干的比例
var angle = Math.PI / 2; // 角度的一般
var level = 12; // 层级
domAngle.onchange = function (e) {
    xAngle = domAngle.value / 2 * Math.PI / 180;
};
setInterval(function () {
    ctx.clearRect(0, 0, mWidth, mHeight);
    drawTree(mWidth / 2, mHeight, angle, len, level);
}, 300);
/**
 * @param  {number} x:起点 x
 * @param  {number} y:起点 y
 * @param  {number} angle:差分角度
 * @param  {number} length:长度
 * @param  {number} level:层级
 */
function drawTree(x, y, angle, length, level) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - length);
    ctx.closePath();
    ctx.stroke();
    ramus(x, y - length, angle, length * proportion, level - 1);
}
function ramus(x, y, angle, length, level) {
    var x0 = x + length * Math.cos(angle + xAngle);
    var y0 = y - length * Math.sin(angle + xAngle);
    var x1 = x + length * Math.cos(angle - xAngle);
    var y1 = y - length * Math.sin(angle - xAngle);
    ctx.strokeStyle = randomHexColor();
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    if (level >= 0) {
        ramus(x0, y0, angle + xAngle, length * proportion, level - 1);
        ramus(x1, y1, angle - xAngle, length * proportion, level - 1);
    }
}
function randomHexColor() {
    return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
}
