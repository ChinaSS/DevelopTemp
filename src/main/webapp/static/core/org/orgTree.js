define(["jquery","BaseDir/tree"],function($,Tree){

	var cache = {};

	function treeInit(config){
		var tree = cache[config.id];
		if (!tree) {
			tree = new OrgTree(config);
			cache[config.id]=tree;
		};
		return tree;
	}

	treeInit.getTree = function(id){
		return cache[id];
	};

	treeInit.dropCache = function(){
		cache = {};
	};

	function OrgTree(config){
		OrgTree.superClass.constructor.call(this,config);
	}

	OrgTree.extend(Tree);

	OrgTree.prototype.bindEvent = function(){
		var _this = this;
		this.superClass.bindEvent();
		this.$wrap.on("click",".item>a",function(){
			var $elem = $(this).parent();
			_this.getAjaxData({
				url : config.url,
				data : config.code,
				callback : function(data){
					this.renderNode($elem,data);
				}
			})
		});
	};

	

	return treeInit;
});