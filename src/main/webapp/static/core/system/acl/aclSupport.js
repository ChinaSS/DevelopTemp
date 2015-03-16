define(["UtilDir/grid","UtilDir/util","ZTree","css!ZTreeCss"],function(grid,util){
    var sysPath = "core/system";
    
    /**
     * 主页初始化
     */
    var init = function(){
        createResTree();
    };

    var curretNode;
    
    var createResTree = function() {
        $.ajax({
            url : getServer() + "/sword/authGetResAll",
            success : function(data) {
            	//配置ztree的属性
                var setting = {
                    data: {
                    	key : {
                    		name:"resName"
                    	},
                        simpleData: {
                            enable: true,
                            idKey:"resId",
                            pIdKey:"resPid",
                            rootPId:null
                        }
                    },
                    callback : {
                        onClick : function(event, treeId, treeNode, clickFlag) {
                            currentNode = treeNode;
                        	createResGrid();
                        }
                    }
                }
                //初始化
                $.fn.zTree.init($("#tree_res"), setting, data.model);
            }
        });
    }

    var createResGrid = function() {
    	if (!currentNode) util.alert("请选择树节点");
    	$.ajax({
    		url : getServer() + "/sword/authGetResSub",
    		data : {
    			resPid : currentNode.resId
    		},
    		success : function(data) {
    			grid({
    	            id : "gridRes",
    	            placeAt : "grid_res",
    	            title : "资源列表",
    	            index:"checkbox",
    	            hidden:false,
    	            pagination:true,
    	            formData : {
    	            	resPid : currentNode.resId
    	            },
    	            layout : [{
    	                name:"资源名称",field:"resName",click:function(e){
    	                	editRes(true, e.data.row);
    	            	}
    	            },{
    	                name:"资源地址",field:"resUrl"
    	            },{
    	                name:"资源类型",field:"resType"
    	            }],
    	            toolbar:[
    	                {name:"添加",class:"fa fa-plus-circle",callback:function(event){ editRes(); }},
    	                {name:"删除",class:"fa fa-trash-o",callback:function(event){ deleteRes(); }},
    	                {name:"刷新",class:"fa fa-refresh",callback:function(event){ }}
    	            ],
    	            data:data.model
    	        })
    		}
    	});
        
    }

    //编辑资源
    function editRes(edit, data) {
        util.slidebar({
            url:sysPath + "/acl/views/res.html",
            width:"500px",
            cache:false,
            afterLoad : function() {
            	if (edit) {//edit
            		$.ajax({
            			url:getServer() + "/sword/authGetRes",
						data : {
							resId : data.resId
						},
            			success:function(data) {
            				setFormData("#form_res", data.model);
            			}
            		});
            	} else { // add
            		var resPid = currentNode ? currentNode.resId : "";
            		var resParent = currentNode ? currentNode.resName : "";
            		setFormData("#form_res", {
            			resPid : resPid,
            			resParent : resParent
            		});
            	}
            	//监听【保存】按钮事件
            	$("#btn_res_save").on("click", function() {
            		var data = getFormData("#form_res");
            		$.ajax({
            			url : getServer() + "/sword/authSaveRes",
            			data : data,
            			type : "post",
            			success : function(data) {
            				util.alert("操作成功");
							//Grid.getGrid("gridRes").refresh();
							createResGrid();
            			}
            		});
            	})
            }
        });
    }

    function setFormData(formSelector, data) {
    	var aEle = $(formSelector + " input," + formSelector + " select");
    	for (var name in data) {
    		aEle.each(function(){
    			var eleName = $(this).attr("name") || $(this).attr("id");
    			if (eleName == name) {
    				$(this).val(data[name]);
    			}
    		})
    	}
    }
    
    function getFormData(formSelector) {
    	var aEle = $(formSelector + " input," + formSelector + " select");
    	var data = {};
    	aEle.each(function(i, value){
    		var eleName = $(this).attr("name") || $(this).attr("id");
    		if (eleName) {
    			data[eleName] = $(this).val();
    		}
    	})
    	return data;
    }

	function deleteRes() {
		var rows = grid.getGrid("gridRes").getSelectedRow();
		if (rows && rows.length > 0) {
			util.confirm("确定要删除指定的记录吗？", function() {
				var ids = "";
				$.each(rows, function(i, row){
					ids = ids.concat(row.resId).concat(",");
				})
				$.ajax({
					url : getServer() + "/sword/authDeleteRes",
					data : {
						ids : ids
					},
					success : function(data) {
						util.alert("删除成功");
						createResGrid();
					}
				})
			});
		} else {
			util.alert("请选择要删除的行记录");
		}
	}

    return {
        init:init
    }
});