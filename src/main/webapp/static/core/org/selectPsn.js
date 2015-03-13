define(["jquery","BaseDir/tree","UtilDir/dialog"],function($,Tree,Dialog){

	var cache = {},
		orgUrl = "",
		psnUrl = "";

	function PsnTree(config){
		OrgTree.superClass.constructor.call(this,config);
	}
	//继承Tree基类
	PsnTree.extend(Tree);
	//绑定额外事件
	PsnTree.prototype.bindEvent = function(){
		var _this = this;
		this.superClass.bindEvent($wrap);
		this.$wrap.on("click",".item>a",function(){
			var $elem = $(this).parent();
			_this.getAjaxData({
				url : orgUrl,
				data : $elem.data("code"),
				callback : function(data){
					this.renderNode($elem,data,"data");
				}
			})
		});
	};

	function PsnInit(config){
		var psn = cache[config.id];
		if (!psn) {
			psn = new PsnSelect(config);
			cache[config.id]=psn;
		};
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
		var this._param = $.extend({},config);
		//init Dialog
        this.dialog = Dialog({
            id:"CS_SelectPsnDialog",
            cache:false,
            title:"人员选择",
            height:"350px",
            dialogSize:"modal-lg",               //modal-lg或modal-sm
            body:"窗口中间内容",
            buttons:this._param.buttons
        });
        var html = '<div id="psnTree" class="tree"></div>'+
                   '<div class="result"><ul></ul></div>';
        this.dialog.setBody(html);
        this.dialog.show();

        //init psnTree
		this.$tree = new PsnTree({
			id : "psnTree",
			data : this._param.data
		});
		this.bindEvent();
	}

	PsnSelect.prototype.bindEvent = function(){
		var $dialog = this.dialog.$getDialog();
		var $resultUL = $dialog.find(".result ul"),
		this.$tree.on("dblclick",".data",function(event){
			$resultUL.append($(this).clone());
		});
		$resultUL.on("dblclick",".data",function(event){
			$(this).remove();
		});
		$dialog.find(".save").on("click",function(){
			this._param.callback(this.getResultData());
		});
	};

	PsnSelect.prototype.getResultData = function(){
		var $results = $dialog.find(".result li");
			data = [];
		$results.each(function(){
			data.push({
				code : $(this).data("code"),
				text : $(this).text();
			});
		});
		return data;
	};

	PsnSelect.prototype.reload = function(data){

	};

	return PsnInit;
});