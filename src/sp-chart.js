(function(){	
var SPChart = {
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
			["學力不足型", "學習異常型"]		//C區
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
	},
	mixOptions : function(options){
		var opt = Object.create(this.options);
		if(options!=null){
			for(var attr in options){
				opt[attr] = options[attr];
			}
		}
		return opt;
	},
	reset : function(id){
		d3.select(id).select('svg').remove();
	},
	para : null,
	toolTip : null,
	tipRec : null,
	tipTitle : null,
	tipS:null,
	tipP:null,
	isFloat : function(n){
		return n % 1 !== 0;	
	},
	formatStr : function(val){
		return (val * 100 | 0) / 100;
	},
	renderToolTip : function(svg, parameter, opt, self){
		//panel
		var g = svg.append('g').attr('class', 'sp-toolTip-group').attr('opacity', opt.toolTipOpacity);
			self.toolTip = g;
		var tipRect = 	g.append('rect');
			self.tipRec = tipRect;   
			tipRect .attr('x' , opt.toolTipDefPoint.x)
			   		.attr('y' , opt.toolTipDefPoint.y)
			   		.attr('width', opt.toolTipW)
			   		.attr('height', opt.toolTipH)
			   		.attr('fill', opt.toolTipBgColor)
			   		.attr('stroke', opt.toolTipStork)
			   		.attr('stroke-width', opt.toolTipStrokeWidth)
			   		.attr('rx', opt.toolTipRadius.rx)
			   		.attr('ry', opt.toolTipRadius.ry)
			   		.attr('pointer-events', 'none');
		
		//text title
		var title = g.append('text').attr('class', 'sp-toolTip-title');
		self.tipTitle = title;
		title.text("")
		 .attr('x', opt.toolTipDefPoint.x + opt.toolTipTextOffsetX)
		 .attr('y', opt.toolTipDefPoint.y + opt.toolTipTextOffsetY)
		 .attr('fill', opt.scaleTextColor)
		 .attr('font-size', opt.toolTipFontSize)
		 .attr('pointer-events', 'none');
		
		//text P
		var tipS = g.append('text').attr('class', 'sp-toolTip-s');
		self.tipS = tipS;
		tipS.text(" : ")
		 .attr('x', opt.toolTipDefPoint.x + opt.toolTipTextOffsetX + opt.toolTipTextOffsetSX)
		 .attr('y', opt.toolTipDefPoint.y + opt.toolTipTextOffsetY + opt.toolTipTextOffsetSY)
		 .attr('fill', opt.scaleTextColor)
		 .attr('font-size', opt.toolTipFontSize)
		 .attr('pointer-events', 'none');
		
		//text S
		var tipP = g.append('text').attr('class', 'sp-toolTip-title-p');
		self.tipP = tipP;
		tipP.text(" : ")
		 .attr('x', opt.toolTipDefPoint.x + opt.toolTipTextOffsetX + opt.toolTipTextOffsetPX)
		 .attr('y', opt.toolTipDefPoint.y + opt.toolTipTextOffsetY + opt.toolTipTextOffsetSY + opt.toolTipTextOffsetPY + opt.toolTipTextGap)
		 .attr('fill', opt.scaleTextColor)
		 .attr('font-size', opt.toolTipFontSize)
		 .attr('pointer-events', 'none');
	},
	markMouseOver : function(e){
		var self = SPChart;
		var opt = self.options;
		var parameter = self.para;
		//mark
		var mark = d3.select(this);
		mark.attr('fill-opacity', opt.markShowOpacity);
		d = d3.select(this).datum();
		
		var cx = Number(mark.attr('cx')) - (opt.toolTipW / 2) + opt.tipBasicOffsetX;
		var cy = Number(mark.attr('cy')) - opt.markRadius - opt.toolTipH + opt.tipBasicOffsetY;
		
		var padding = 5;
		//處理水平超出邊界
		if(cx < 0){
			cx = padding;
		}else if( (cx + opt.toolTipW) > parameter.w){
			
			cx -= (cx + opt.toolTipW) - parameter.w + padding ;
		}
		//處理垂直超出邊界
		if(cy < 0){
			var overVal = 0 - cy;
			cy += overVal + padding;
		}
		
		//panel
		self.toolTip.attr('opacity', opt.toolTipShowOpacity);
		
		//background
		self.tipRec.attr('x', cx)
				   .attr('y', cy);
		//title
		self.tipTitle.text(d.title)
			.attr('x', cx + opt.toolTipTextOffsetX )
			.attr('y', cy + opt.toolTipTextOffsetY );
		
		var valueS = Number(d.s);
		if(self.isFloat( valueS))
			valueS = self.formatStr(valueS);
		//
		self.tipS.text('學生注意係數 : ' + valueS)
			.attr('x', cx + opt.toolTipTextOffsetX + opt.toolTipTextOffsetSX)
			.attr('y', cy + opt.toolTipTextOffsetY + opt.toolTipTextOffsetSY);
		
		//如果是浮點數，就只取兩位
		var valueP = Number(d.p) * 100;
		if(self.isFloat( valueP))
			valueP = self.formatStr(valueP);
		//
		self.tipP.text('得分百分比 : ' + valueP + '%')
			.attr('x', cx + opt.toolTipTextOffsetX + opt.toolTipTextOffsetPX)
			.attr('y', cy + opt.toolTipTextOffsetY + opt.toolTipTextOffsetSY + opt.toolTipTextOffsetPY + opt.toolTipTextGap);
		
		self = null;
		
	},
	markMouseOut : function(e){
		var self = SPChart;
		d3.select(this).attr('fill-opacity', self.options.markOpacity);
		self.toolTip.attr('opacity', self.options.toolTipOpacity);
		self = null;
	},
	//畫標記點
	renderMark : function(svg, parameter, opt, self){
		var g = svg.append('g').attr('class', 'sp-markGroup');
		var d = svg.datum();
		//垂直軸所需數據
		var basicOne = parameter.cileSize.h * 2 / (opt.scaleY[3] - opt.scaleY[1]); //50 ~ 100
		var basicTwo = parameter.cileSize.h * 1 / (opt.scaleY[1] - opt.scaleY[0]); //0 ~ 50
		var bottomY = (parameter.p.y  + parameter.spHeight);
		var leftX = parameter.p.x;
		//水平軸所需數據
		var basicThree = parameter.spWidth / (opt.scaleX[2] - opt.scaleX[0]);
		for(var i=0,c=d.length ; i < c ; i++){
			var p = d[i].p * 100; //垂直
			var s = d[i].s;		  //水平
			var point = {x:0, y :0};
			
			//y軸
			
			if(p >= opt.scaleY[1]){
				var length = (p - opt.scaleY[1])  * basicOne;
				point.y = bottomY - parameter.cileSize.h - length;
			}else{
				var length = p * basicTwo;
				point.y = bottomY - length;
			}
			//x軸
			point.x = leftX + (s *basicThree);
			
			g.append('circle')
			 .datum(d[i])
			 .attr('cx', point.x )
			 .attr('cy', point.y )
			 .attr('r' , opt.markRadius)
			 .attr('fill', opt.markColor(i))
			 .attr('fill-opacity', opt.markOpacity)
			 .attr('stroke', opt.markStroke)
			 .attr('stroke-width', opt.markStrokeWidth)
			 .on('mouseover', self.markMouseOver)
			 .on('mouseout' , self.markMouseOut);
			 
		}
	},
	//畫刻度
	renderScale : function(svg, parameter, opt, self){
		var g = svg.append('g').attr('class', 'sp-scaleGroup');
		var topY  = parameter.p.y;
		var leftX = parameter.p.x;
		//垂直軸
		for(var i = 0, row = opt.scaleY.length ; i < row ; i++ ){
			var rowY = (topY + parameter.cileSize.h * i) + opt.scaleOffextY;
			var rowX = leftX + opt.scaleOffextX;
			g.append('g').append('text')
			 .text(opt.scaleY[row - i - 1] + "%")
			 .attr('x', rowX)
			 .attr('y', rowY)
			 .attr('fill', opt.scaleTextColor)
			 .attr('font-size', opt.scaleFontSize);
			
		}
		 //水平
		for(var j = 0, column = opt.scaleX.length ; j < column ; j++){
				var columnY = topY + parameter.spHeight + opt.scaleOffsetPY;
				var columnX = (leftX + parameter.cileSize.w * j) + opt.scaleOffsetPX;
				var textValue = opt.scaleX[j];
				if(textValue == 0)
					textValue = '0.' + textValue;
				if(textValue == 1)
					textValue = textValue + '.0';
				g.append('g').append('text')
			 	 .text(textValue)
			 	 .attr('x', columnX)
			 	 .attr('y', columnY)
			 	 .attr('fill', opt.scaleTextColor)
			 	 .attr('font-size', opt.scaleFontSize);
		}
	},
	//畫水平與垂直線條
	renderGrid : function(svg, parameter, opt, self){
		var g = svg.append('g').attr('class', 'sp-gridGroup');
		var row = opt.scaleY.length -2;
		var column = opt.scaleX.length -2;
		//水平線
		for(var i=1 ; i <= row ; i++){
			var y1 = parameter.cileSize.h * i + parameter.p.y;
			var y2 = y1;
			var x1 = parameter.p.x;
			var x2 = parameter.p.x +  parameter.spWidth;
			g.append('line')
			 .attr('stroke', opt.gridStroke )
			 .attr('stroke-width', opt.gridStrokeWidth)
			 .attr('x1', x1)
			 .attr('y1', y1)
			 .attr('x2', x2)
			 .attr('y2', y2);
		}
		//垂直線
		for(var i=1 ; i <= column ; i++){
			var y1 = parameter.p.y;
			var y2 = parameter.p.y  + parameter.spHeight;
			var x1 = parameter.cileSize.w * i + parameter.p.x;
			var x2 = x1;
			g.append('line')
			 .attr('stroke', opt.gridStroke )
			 .attr('stroke-width', opt.gridStrokeWidth)
			 .attr('x1', x1)
			 .attr('y1', y1)
			 .attr('x2', x2)
			 .attr('y2', y2);
		}
	},
	//類型文字
	renderGenreText : function(svg, parameter, opt, self){
		var g = svg.append('g').attr('class', 'sp-generTextGroup');
		var topY  = parameter.p.y;
		var leftX = parameter.p.x;
		var point = {x:0, y:0};
		for(var i=0, row=opt.generTextList.length ;  i < row ; i++ ){
			var rowItem = opt.generTextList[i];
			point.y = (topY + parameter.cileSize.h * i) + ( (parameter.cileSize.h - opt.generOffsetY )/ 2);
			for(var j=0, column=opt.generTextList[0].length ; j < column ; j++ ){
				point.x = (leftX + parameter.cileSize.w *j) + ( (parameter.cileSize.w - opt.generOffsetX )/ 2);
				g.append('text')
				 .text(rowItem[j])
				 .attr('x', point.x)
				 .attr('y', point.y)
				 .attr('fill', opt.generTextColor)
				 .attr('font-size', opt.generFontSize)
				 .attr('pointer-events', 'none');
			}
		}
	},
	//畫最底層的正方形
	renderBackground : function(svg, parameter, opt, self){
		var g = svg.append('g').attr('class', 'sp-backgroundGroup');
		g.append('rect')
			.attr('x', parameter.p.x)
			.attr('y', parameter.p.y)
			.attr('rx', opt.radius.rx)
			.attr('ry', opt.radius.ry)
			.attr('width' , parameter.baseLength * opt.zoomW)
			.attr('height', parameter.baseLength * opt.zoomH)
			.attr('fill', opt.backgroundColor)
			.attr('fill-opacity', opt.backgroundOpacity)
			.attr('stroke', opt.backgroundStroke)
			.attr('stroke-width', opt.backgroundStrokeWidth);
	},
	renderRadar : function(svg, opt, self){
		var parameter = {};
		var viewBoxList = opt.viewBox.split(',');
		parameter.w = viewBoxList[2];
		parameter.h = viewBoxList[3];
		parameter.baseLength = Math.min(parameter.h, parameter.w) *  opt.axisZoom; //取容器最小邊當作基準
		parameter.center = {x: parameter.w / 2 , y: parameter.h / 2};
		parameter.halfW = parameter.baseLength * opt.zoomW / 2;
		parameter.halfH = parameter.baseLength * opt.zoomH/ 2;
		//sp圖大小
		parameter.spWidth  = parameter.baseLength * opt.zoomW;
		parameter.spHeight = parameter.baseLength * opt.zoomH;
		//一格的大小
		parameter.cileSize = {
			w : parameter.spWidth  / (opt.scaleX.length -1),
			h : parameter.spHeight / (opt.scaleY.length -1)
		};
		//繪製起始點參考點
		parameter.p = {
			x : parameter.center.x - parameter.halfW, 
			y : parameter.center.y - parameter.halfH
		};
		self.para = parameter;
		//開始繪製
		svg.call(self.renderBackground, parameter, opt, self);
		svg.call(self.renderGenreText, parameter, opt, self);
		svg.call(self.renderGrid, parameter, opt, self);
		if(svg.datum() && svg.datum().length > 0){
			svg.call(self.renderMark, parameter, opt, self);
		}
		svg.call(self.renderScale, parameter, opt, self);
		svg.call(self.renderToolTip, parameter, opt, self);
	},
	draw : function(id, data, options){
		this.reset(id);
		var opt = (options) ? this.mixOptions(options) : this.mixOptions(null) ;
		var svg = d3.select(id).append("svg");
			svg.attr('class', 'lineChart');
      		svg.attr("width", opt.chart.width);
      		svg.attr("height", opt.chart.height);
      		svg.attr("viewBox",opt.viewBox);
      		svg.attr("preserveAspectRatio", opt.preserveAspectRatio);
      		svg.datum(data);
      		svg.call(this.renderRadar, opt, this);	//要呼叫的函數 (會先執行)
	}
};

if(!window.SPChart){
	window.SPChart = SPChart;
}

if(typeof(module)!= "undefined"){
	module.exports = SPChart;
}

}).call(this);