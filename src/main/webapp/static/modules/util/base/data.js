define(["jquery"],function($){
	function Data(){};
	Data.prototype = {
		query : function(config){
			var config = $.extend({},config),
				type;
			if (!config.url||!config.callback) {
				console.log("required params undefined!");
				return false;
			}
			type = config.type?config.type.toUpperCase():(function(){
					if (!config.data) {
						console.log("ajax requset without data");
						return "GET";
					}else if ((typeof config.data == "string")&&config.data.length<100) {
						return "GET";
					}else if (typeof config.data == "object"){
						return "POST";
					}else{
						return "";
					}
				})();
			//type未定义,默认为GET
			if(type=="GET"){
				$.ajax({
					type:"GET",
					url:config.url+"?q="+cofnig.data,
					dataType:config.dataType?config.dataType:"",
					success:function(data){
						config.callback(data.model);
					},
					error:function(xhr){
						console.log("ajax request to url("+config.url+") has failed");
					}
				});
			}else if (type=="POST") {
				$.ajax({
					type:"POST",
					url:config.url,
					data:config.data,
					dataType:config.dataType?config.dataType:"",
					success:function(data){
						config.callback(data.model);
					},
					error:function(xhr){
						console.log("ajax request to url("+config.url+") has failed");
					}
				});
			}else{
				console.log("ajax type is incorrect!");
				return false;
			}
		},
		listToTree : function(data){

		},
		format : function(data){
			console.log("abstract function, format function should be overwritten");
		},
		sort : function(data){
			console.log("abstract function, sort function should be overwritten");
		}
	};
	return Data;
});