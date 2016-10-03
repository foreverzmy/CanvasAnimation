#canvas画Material风格的loadingView
之前看到一个撸Material风格的loadingView的[文章](http://androidwing.net/index.php/73)，里面也有一个SVG做出来效果的[Demo](https://material.uplabs.com/posts/material-loader-interface),个人觉得也很好玩，就顺手也做了一个。

开头上源码和效果：

<iframe height='265' scrolling='no' src='//codepen.io/foreveryuan/embed/GjrzXK/?height=265&theme-id=dark&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/foreveryuan/pen/GjrzXK/'>loadingView</a> by Mervyn (<a href='http://codepen.io/foreveryuan'>@foreveryuan</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>


这个使用canvas实现的动画效果，svg实现可以去看上面的链接，下面就来看看用canvas的实现。

##canvas三剑客
使用canvas最先登场的当然就是canvas三剑客了，先在HTML添加canvas标签，设置好宽高，然后在JS里获取DOM对象，然后使用画布方法。

## 第一步，画圆
最先开始画两个圆。圆的颜色是白色的，所以先在CSS中把背景改为蓝色才能显示出来。
```javascript
var can = document.getElementById('canvas');
var ctx = can.getContext("2d");
var mWidth = canvas.width; //画布的宽
var mHeight = canvas.height; //画布的高
var mMaxOffset = 150; //圆最大偏移量
var mMaxRadius = 30; //圆半径
var mColor = '#fff'; //颜色
var mOffset = 0; //偏移量
var mDegrees = 0; //画布转角

function drawCircle() {
    ctx.clearRect(0, 0, mWidth, mHeight);
    ctx.beginPath();
    ctx.arc(mWidth / 2, mHeight / 2 - mOffset, mMaxRadius, 0, Math.PI * 2); //在中心点上方mOffset处画圆
    ctx.closePath();
    ctx.fillStyle = mColor;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(mWidth / 2, mHeight / 2 + mOffset, mMaxRadius, 0, Math.PI * 2); //在中心点下方mOffset处画圆
    ctx.closePath();
    ctx.fill();
}
```
此时画布上会出现一个圆，因为这时这两个圆是重合在一起的。

## 第二步，旋转
那接下来就是要使画布旋转起来。这时就需要用到定时器。
```javascript
setInterval(function() {
    drawCircle();
    rotate();
    var present = mDegrees / 360;
    if (present < 0.5) {
        mOffset = mMaxOffset * present; //改变圆心位置，使其靠近中心点
    } else {
        mOffset = mMaxOffset * (1 - present);
    }
}, 30)

function rotate() {
    canvas.style.transform = `rotate(${mDegrees}deg)`; //使canvas旋转
    mDegrees += 2;
    if (mDegrees == 360) {
        mDegrees = 0;
    }
}
```
`rotate()`函数改变旋转角度，然后使用定时器不停的使画布旋转起来。<br>
并且在定时器中对画布旋转角度进行了判断，如果画布转角小于180deg，则使两个圆的偏移量增大，当大于180deg时，则让两个圆的偏移量减小。这时其实会看到两个圆和画布一起在旋转。

## 第三步，粘合动画
最后就是绘制两个圆在靠近和分开时的粘合动画了。这里用到了canvas方法里的绘制二次贝塞尔曲线quadraticCurveTo方法;<br>
首先在定时器最后加上这句
```javascript
if (present <= 0.375 || present >= 0.625) drawPath(present); //当两圆接触时绘制粘合动画
```
然后，就是粘合动画函数
```javascript
function drawPath(present) {
    var suppoetOffset = -mMaxRadius;
    ctx.beginPath();
    ctx.moveTo(mWidth / 2 - mMaxRadius, mHeight / 2 - mOffset); //从上圆最左点开始画线
    ctx.lineTo(mWidth / 2 + mMaxRadius, mHeight / 2 - mOffset); //到上圆最右点
    if (present < 0.25 || present > 0.75) { //当两球相交
        suppoetOffset = mMaxRadius;
    } else if (present <= 0.375) { //当两球刚分离时
        suppoetOffset = -(480 * present - 150);
    } else if (present >= 0.625) { //当两球快要接触时
        suppoetOffset = 480 * present - 330;
    }
    // 贝塞尔选点以中心点便宜30以内距离为控制点，另一圆边点为结束点
    ctx.quadraticCurveTo(mWidth / 2 + suppoetOffset, mHeight / 2, mWidth / 2 + mMaxRadius, mHeight / 2 + mOffset);
    ctx.lineTo(mWidth / 2 - mMaxRadius, mHeight / 2 + mOffset);
    ctx.quadraticCurveTo(mWidth / 2 - suppoetOffset, mHeight / 2, mWidth / 2 - mMaxRadius, mHeight / 2 - mOffset);
    ctx.closePath();
    ctx.fill();
}
```

这里就是在两个球的左右四个点用直线和贝塞尔曲线连接起来，形成一个曲四边形，然后随着两球的距离不停的改变两个曲线的控制点，形成动态的粘合动画效果。<br>
好了，到此结束，就完成了一个Material风格的loading动画。
