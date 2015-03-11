define(["jquery","BaseDir/data"],function($,Data){

	function Tree(config){
		//获取锚点
		this.$wrap = $("#"+config.id);
		//保存url地址
		this._param = $.extend({},config);
		//绑定事件
		this.bindEvent($wrap);
		//渲染节点
		try{
			if(!!config.url){
				this.getAjaxData({
					url : config.url,
					data : config.code,
					callback : this.renderTree
				});
			}else if (!!config.data) {
				this.renderTree(config.data);
			}else{
				throw("data sorce undefined!");
			}
		}catch{
			return false;
		}
	}

	Tree.mix(Data);//扩展数据处理API

	Tree.prototype.bindEvent = function($wrap){
		$wrap.on("click","a",function(event){
			event.preventDefault();
			event.stopPropagation();
			$(this).parent().toggleClass("open");
		});
	};

	Tree.prototype.renderTree = function(data){
		console.log("renderTree, abstract function should be overwritten!");
	};

	Tree.prototype.renderNode = function($elem,data,tag){
		var $list = $elem.children("ul"),
			$frag = $(document.createDocumentFragment()),
			li = '<li'+(tag?' class='+tag:'')+'></li>',
			$li;
		if (!$list.length) {
			$list = $("<ul></ul>");
			$elem.append($list);
		}
		$list.empty();
		for (var i = 0; i < data.length; i++) {
			$li = $(li);
			$li.append('<a><span></span>'+data[i].text+'</a>');
			$li.data("code",data[i].code);
			$frag.append($li);
		}
		$list.append($frag);
	};

	Tree.prototype.getAjaxData(param){
		var _this = this;
		this.query({
			url : param.url,
			data : param.data,
			callback : function(data){
				param.callback.call(_this,data);
			}
		});
	};

	return Tree;
});