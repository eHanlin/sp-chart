## SP Chart

## 說明
1.依賴於 D3.js

### 安裝 Install
1. sudo npm install d3

### 資料結構 Data structure
```
var data = [
			{title: "java",s: 0, 		p:0.01}, 
           	{title: "地理", s: 0.1, 		p:0.15},
           	{title: "歷史", s: 0.2, 		p:0.27},
           	{title: "公民", s: 0.3, 		p:0.37},
           	{title: "數學", s: 0.4, 		p:0.47},
           	{title: "國文", s: 0.5, 		p:0.57},
           	{title: "英文", s: 0.6, 		p:0.67},
           	{title: "程式", s: 0.75, 	p:0.74}, 
           	{title: "生物", s: 0.7018992568125517, p:0.8}, 
           	{title: "生物", s: 0.8, 		p:0.85}, 
           	{title: "生物", s: 0.9, 		p:0.9}, 
           	{title: "生物", s: 1, 		p:1}, 
           	{title: "A", s: 1, 		p:0},
           	{title: "A", s: 0, 		p:1}
           ];
```

### 範例 examp
```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>sp chart</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
	<link rel="stylesheet" href="./src/sp-chart.css"/>
	<style>
		#box{
			width: 610px;
			height: 610px;
		}
	</style>
</head>
<body>
	<div id="box"></div>
</body>

<script src="./node_modules/d3/d3.min.js"></script>
<script src="./src/sp-chart.js"></script>

<script>
var data = [
			{title: "java",s: 0, 		p:0.01}, 
           	{title: "地理", s: 0.1, 		p:0.15},
           	{title: "歷史", s: 0.2, 		p:0.27},
           	{title: "公民", s: 0.3, 		p:0.37},
           	{title: "數學", s: 0.4, 		p:0.47},
           	{title: "國文", s: 0.5, 		p:0.57},
           	{title: "英文", s: 0.6, 		p:0.67},
           	{title: "程式", s: 0.75, 	p:0.74}, 
           	{title: "生物", s: 0.7018992568125517, p:0.8}, 
           	{title: "生物", s: 0.8, 		p:0.85}, 
           	{title: "生物", s: 0.9, 		p:0.9}, 
           	{title: "生物", s: 1, 		p:1}, 
           	{title: "A", s: 1, 		p:0},
           	{title: "A", s: 0, 		p:1}
           ];
window.SPChart.draw("#box", data);
//
draw第三個參數就是options,程式內部會自動 mix
</script>
</html>

```

### 設定 Configure
```javascript
	options : {
		viewBox : '0,0,610,610',
		preserveAspectRatio : "none",
		chart : {width:'100%', height:'100%'},
		axisZoom : 0.85,								//縮放比,1不縮放,起點會從 (0,0)開始
		zoomW : 0.9,
		zoomH : 0.7,
		maxValue : 100,								//軸的最大值
		minValue : 0,								//軸的最小值
		scaleY : [0, 50, 75, 100],					//Y軸刻度值  固定四個不要亂改
		scaleX : [0, 0.5, 1.0],						//X軸刻度值  固定三個不要亂改
		radius : {rx:5, rx:5},						//最外框圓角
		backgroundColor : "#eeeeee",
		backgroundOpacity : 0.8,
		backgroundStroke : '#bdbdbd',
		backgroundStrokeWidth : 2,
		gridStroke : "#bdbdbd",						//網格線顏色
		gridStrokeWidth : 2,						//網格線粗細
		markRadius : 10,							//標記點半徑
		markColor : d3.scale.category20(),			//圓點顏色
		markOpacity : 0.7,
		markShowOpacity : 1,
		markStroke: "grey",
		markStrokeWidth : 1,
		//SP表分類
		generTextList : [
			["學習穩定型", "粗心大意型"],	//A區
			["努力不足型", "欠缺充分型"],	//B區
			["學歷不足型", "學習異常型"]		//C區
		],
		generTextColor : '#757575',		//類型文字顏色
		generTextOpacity : 0.7,			//類型文字透明
		generFontSize : '20px',			//類型文字大小
		//置中調整用
		generOffsetY : -20,				//類型文字偏移
		generOffsetX : 110,				//類型文字偏移
		//刻度文字
		scaleTextColor : 'black',
		scaleTextOpacity : 1,
		scaleFontSize : '14px',
		//刻度文字位置調整
		//S軸偏移
		scaleOffextY : 6,				//
		scaleOffextX : -45,
		//P軸偏移
		scaleOffsetPY : 30,
		scaleOffsetPX : -6,
		//toolTip
		tipBasicOffsetX : 0,		//tip 與 mark gap
		tipBasicOffsetY : -10,
		toolTipOpacity : 0,			//toolTip 只有  mouseOver才會顯示
		toolTipShowOpacity : 0.9,
		toolTipDefPoint : {x:0, y:0},
		toolTipW : 200,
		toolTipH : 70,
		toolTipBgColor : "white",
		toolTipStork: "#bdbdbd",	//邊框
		toolTipStrokeWidth: 1,		//粗細
		toolTipColor : "black",		//toolTip文字顏色
		toolTipRadius : {rx : 5, ry: 5},
		toolTipFontSize : '14px',
		toolTipTextOffsetX : 10,
		toolTipTextOffsetY : 20,
		toolTipTextGap : -2,
		toolTipTextOffsetSX : 14,
		toolTipTextOffsetSY : 18,
		toolTipTextOffsetPX : 14,
		toolTipTextOffsetPY : 18
	}
```