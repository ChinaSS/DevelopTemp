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
		//init Dialog
		var buttons = [];
        buttons.push(
            {name:"确定",callback:function(){
                //此处写扩展代码
                dialog.hide();
            }}
        );
        this.$dialog = Dialog({
            id:"CS_SelectPsnDialog",
            cache:false,
            title:"人员选择",
            height:"350px",
            dialogSize:"modal-lg",               //modal-lg或modal-sm
            body:"窗口中间内容",
            buttons:buttons
        });
        var html = '<div id="psnTree" class="tree"></div>'+
                   '<div class="result">right</div>';
        this.$dialog.setBody(html);
        this.$dialog.show();

		this.$tree = new PsnTree({
			id : "psnTree",
			data : data
		});
	}



	

	return treeInit;
});