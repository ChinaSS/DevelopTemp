define(["jquery","BaseDir/tree","UtilDir/dialog","css!OrgDir/style.css"],function($,Tree,Dialog){

	var cache = {};

	function PsnTree(config){
		PsnTree.superClass.constructor.call(this,config);
	}
	//继承Tree基类
	PsnTree.extend(Tree);
	//绑定额外事件
	PsnTree.prototype.bindEvent = function(){
		var _this = this;
		PsnTree.superClass.bindEvent.call(this);
		this.$wrap.on("click",".leaf>a",function(){
			var $leaf = $(this).parent(".leaf");
			$leaf.toggleClass("open");
			if ($leaf.find(".data").length>0) {return false};
			/*
			_this.getPsnData({
				orgCode : [$leaf.data("code")]
			},function(data){
				this.renderNode($leaf,data,"data");
			});
			*/
			_this.renderNode($leaf,
				[
					{
						code : "10001",
						text : "测试人员10001"
					},
					{
						code : "10002",
						text : "测试人员10002"
					},
					{
						code : "10003",
						text : "测试人员10003"
					},
					{
						code : "10004",
						text : "测试人员10004"
					}
				]
			,"data");
		});
	};

	PsnTree.prototype.getPsnData = function(q,callback){
		var _this = this;
		this.query({
			url : this._param.psnUrl,
			data : {
				orgCode : q["orgCode"]?q["orgCode"]:null,
				psnCode : q["psnCode"]?q["psnCode"]:null,
				psnText : q["orgCode"]?q["psnText"]:null
			},
			callback : function(data){
				callback.call(_this,data);
			}
		})
	};

	PsnTree.prototype.search = function(psnText){
		if (!!psnText) {
			this.getPsnData({
				psnText : psnText
			},function(data){
				this.renderTree(data);
			});
		} else {
			this.getData(this.renderTree);
		}
	};

	function PsnInit(config){
		var psn = cache[config.id];
		if (!psn) {
			psn = new PsnSelect(config);
			cache[config.id]=psn;
		};
		psn.show();
		return psn;
	}

	PsnInit.get = function(id){
		return cache[id];
	};

	PsnInit.drop = function(id){
		delete cache[id];
	};

	PsnInit.dropAll = function(){
		cache = {};
	};

	function PsnSelect(config){
		var _this = this;
		this._param = $.extend({},config);
		//init Dialog
        this.dialog = Dialog({
            id:this._param.id+"_SelectPsnDialog",
            cache:true,
            title:"人员选择",
            height:"300px",
            width:"500px",              //modal-lg或modal-sm
            body:"窗口中间内容",
            buttons:this._param.type=="multi"?[{
            	name : "确定",
            	close : true,
            	callback : function(){
            		_this._param.callback(_this.getResultData());
            	}
            }]:null
        });
        var html = '<div class="psnSearch"><input type="text" class="search"></div>'+
        		   '<div class="psnTree">'+
        		   '<div class="orgTag"><ul></ul></div>'+
        		   '<div id="'+this._param.id+'_psnTree" class="tree"></div></div>';
        if (this._param.type == "multi") {
        	html += '<div class="psnResult"><div class="tree"></div></div>';
        }         
        this.dialog.setBody(html);

        //init psnTree
		this.tree = new PsnTree({
			id : this._param.id+"_psnTree",
			data : this._param.org.data,
			url : this._param.org.url,
			code : this._param.org.code,
			psnUrl : this._param.psn.url
		});
		this.loadSelectData(this._param.psn.code);
		this.bindEvent();
	}

	PsnSelect.prototype.bindEvent = function(){
		var _this = this;
		var $dialog = this.dialog.$getDialog();
		if (this._param.type == "multi") {
			var $resultTree = $dialog.find(".psnResult .tree"),
				$resultUL = $resultTree.children("ul");
			if ($resultUL.length==0) {
				$resultUL = $("<ul></ul>");
				$resultTree.append($resultUL);
			}
			this.tree.$getWrap().on("dblclick",".data",function(event){
				$resultUL.append($(this).clone(true));
			});
			$resultTree.on("dblclick",".data",function(event){
				$(this).remove();
			});
			/*
			$dialog.find(".save").on("click",function(){
				
			});
			*/
		} else {
			this.tree.$getWrap().on("dblclick",".data",function(event){
				_this._param.callback([
					{
						code : $(this).data("code"),
						text : $(this).text()
					}
				]);
				_this.hide();
			});
		}
		var lazySearch = null; //延迟搜索,减少数据请求压力
		$dialog.find(".psnSearch .search").on("keyup",function(){
			clearInterval(lazySearch);
			var psnText = $.trim(this.value());
			lazySearch = setInterval(function(){
				_this.tree.search(psnText);
			},400);		
		});
	};

	PsnSelect.prototype.getResultData = function(){
		var $results = this.dialog.$getDialog().find(".psnResult .tree li"),
			data = [];
		$results.each(function(){
			data.push({
				code : $(this).data("code"),
				text : $(this).text()
			});
		});
		return data;
	};

	PsnSelect.prototype.loadSelectData = function(selectCode){
		var $resultTree = this.dialog.$getDialog().find(".psnResult .tree");
		if (!selectCode||selectCode.length==0) {return false;}
		if (typeof selectCode == "string") {
			selectCode = selectCode.split(",");
		} else if (selectCode.constructor == Array&&typeof selectCode[0] == "object") {
			//当所传值为数据对象的数组时
			console.log("所选人员初始化,使用直接数据对象,而非使用人员代码从后台查询");
			this.tree.renderNode($resultTree,selectCode,"data");
			return false;
		}else {
			this.tree.getPsnData({
				psnCode : selectCode
			},function(data){
				this.renderNode($resultTree,data,"data");
			});
		}
		
	};

	PsnSelect.prototype.reload = function(data,selectCode){
		if (argument.length==1) {
			typeof data[0] == "object"?this.tree.renderTree(data):this.loadSelectData(selectCode);
		} else if(argument.length==2) {
			this.tree.renderTree(data);
			this.loadSelectData(selectCode);
		} else {
			console.log("no argument or arguments are illegal!");
		}
		this.show();
	};

	PsnSelect.prototype.refresh = function(){
		var $wrap = this.tree.$getWrap();
		$wrap.find("li.open").removeClass("open");
		$wrap.find(".leaf>ul").remove();
	};

	PsnSelect.prototype.show = function(){
		this.dialog.show();
	};

	PsnSelect.prototype.hide = function(){
		this.dialog.hide();
	};

	return PsnInit;
});