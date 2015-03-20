define(["UtilDir/grid","UtilDir/util","ZTree","css!ZTreeCss","JQuery.validate","JQuery.validate.extra","JQuery.validate.message"],function(grid,util){
    var sysPath = "core/system";
    
    /**
     * 主页初始化
     */
    var init = function(){
        //初始化资源模块
    	initAuthRes();
    	//初始化资源授权模块
    	initAuthSet();
    	//初始化资源变更模块
    	initAuthUpdate();
    };

    /*--------------------------------------资源模块---------------------------------------------*/
    //初始化入口
    function initAuthRes() {
    	createResTree();
    	(function(){
    		$("#btn_authRes_addSort").on("click", on_BtnAuthResAddSort_click);
    		$("#btn_authRes_editSort").on("click", on_BtnAuthResEditSort_click)
    		$("#btn_authRes_deleteSort").on("click", on_BtnAuthResDeleteSort_click);
    	})();
    }
    
    //创建资源目录树
    var createResTree = function() {
        $.ajax({
            url : getServer() + "/sword/authGetResSort",
            success : function(data) {
            	//没有数据
            	if (!data || data.length == 0) {
            		showResTreeTip();
            	} else {
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
                            	createResGrid();
                            }
                        }
                    }
                    //初始化
                    $.fn.zTree.init($("#tree_res"), setting, data);
            	}
            }
        });
    }
    
    function showResTreeTip() {
    	$("#authRes_tree_tip").fadeIn();
		$("#btn_authRes_addRoot").on("click", function(){
			editResSort();
		});
    }
    
    function hideResTreeTip() {
    	$("#authRes_tree_tip").fadeOut();
		$("#btn_authRes_addRoot").off("click");
    }
    
    //创建资源表格
    var createResGrid = function() {
    	var treeNode = $.fn.zTree.getZTreeObj("tree_res").getSelectedNodes()[0];
    	$.ajax({
    		url : getServer() + "/sword/authGetResSub",
    		data : {
    			resPid : treeNode.resId
    		},
    		success : function(data) {
    			grid({
    	            id : "gridRes",
    	            placeAt : "grid_res",
    	            index:"checkbox",
    	            hidden:false,
    	            pagination:true,
    	            formData : {
    	            	resPid : treeNode.resId
    	            },
    	            layout : [{
    	                name:"资源名称",field:"resName",click:function(e){
    	                	editRes(true, e.data.row);
    	            	}
    	            },{
    	                name:"资源地址",field:"resUrl"
    	            },{
    	                name:"资源描述",field:"resDesc"
    	            }],
    	            toolbar:[
    	                {name:"添加",class:"fa fa-plus-circle",callback:function(event){ editRes(); }},
    	                {name:"删除",class:"fa fa-trash-o",callback:function(event){ deleteRes(); }},
    	                {name:"刷新",class:"fa fa-refresh",callback:function(event){ createResGrid(treeNode); }}
    	            ],
    	            data:data
    	        })
    		}
    	});
    }

    function validate_opr_resSort() {
    	var nodes = $.fn.zTree.getZTreeObj("tree_res").getSelectedNodes();
    	if (!nodes || nodes.length == 0) {
    		showResTreeOprTip();
    		return false;
    	} else {
    		hideResTreeOprTip();
    		return nodes;
    	}
    }

    function showResTreeOprTip() {
    	$("#authRes_tree_opr_tip").fadeIn();
    }
    
    function hideResTreeOprTip() {
    	$("#authRes_tree_opr_tip").fadeOut();
    }
    
    function on_BtnAuthResAddSort_click() {
    	if (validate_opr_resSort()) {
    		alert("yes");
    		editResSort();
    	}
    }
    
    function on_BtnAuthResEditSort_click() {
    	
    }
    
    function on_BtnAuthResDeleteSort_click() {
    	
    }
    
    function editResSort() {
    	 util.slidebar({
	         url:sysPath + "/acl/views/res_sort.html",
	         width:"500px",
	         cache:false,
	         afterLoad : function() {
	        	//初始化表单校验
	    	 	$("#form_resSort").validate({
	     			rules : {
	     				resName : "required"
	     			},
	     			messages : {
	     				resName : "请填写目录名称"
	     			}
	     		});
	    	 	//注册保存按钮事件
	    	 	$("#btn_resSort_save").on("click", function(){
	    	 		if ($("#form_resSort").valid()) {
	    	 			var data = getFormData("#form_resSort");
	    	 			$.ajax({
	    	 				url : getServer() + "/sword/authSaveRes",
	    	 				data : data,
	    	 				type : "post",
	    	 				success : function(data) {
	    	 					util.alert("操作成功");
	    	 					hideResTreeTip();
	    	 					createResTree();
	    	 				}
	    	 			});
	    	 		}
	    	 	})
	         }
	     });
    }
    
    function addResSort() {
    	
    }
    
    function editResSort() {
    	
    }
    
    //编辑资源
    function editRes(edit, row) {
        util.slidebar({
            url:sysPath + "/acl/views/res.html",
            width:"500px",
            cache:false,
            afterLoad : function() {
            	if (edit) {//edit
            		$.ajax({
            			url:getServer() + "/sword/authGetRes",
						data : {
							resId : row.resId
						},
            			success:function(data) {
            				setFormData("#form_res", data);
            			}
            		});
            	} else { // add
            		var treeNode =  $.fn.zTree.getZTreeObj("tree_res").getSelectedNodes()[0];
            		var resPid = treeNode ? treeNode.resId : "";
            		var resParent = treeNode ? treeNode.resName : "";
            		setFormData("#form_res", {
            			resPid : resPid,
            			resParent : resParent
            		});
            	}
            	//监听【保存】按钮事件
            	$("#btn_res_save").on("click", function() {
            		$("#form_res").validate({
            			rules : {
            				resName : "required",
            				resType : "required",
            			},
            			messages : {
            				resName : "请填写资源名称",
            				resType : "请选择资源类型"
            			}
            		})
            		if ($("#form_res").valid()) {
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
            		}
            		/*
            		*/
            	})
            }
        });
    }

    //设置表单信息
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
    
    //获取表单信息
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

    //删除资源
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

	/*--------------------------------------授权模块---------------------------------------------*/
	function initAuthSet() {
		createRoleTree();
		createResCheckTree();
	}
	
	function createRoleTree() {
		$.ajax({
            url : getServer() + "/sword/orgGetRoleTree",
            success : function(data) {
            	//配置ztree的属性
                var setting = {
                    data: {
                    	key : {
                    		name:"name"
                    	},
                        simpleData: {
                            enable: true,
                            idKey:"id",
                            pIdKey:"pid",
                            rootPId:null
                        }
                    },
                    callback : {
                        onClick : function(event, treeId, treeNode, clickFlag) {
                        	
                        }
                    }
                }
                if (!data || data.length == 0) {
                	data = [{
                		id : "root",
                		name : "暂未有角色信息",
                		pid : ""
                	}];
                }
                //初始化
                $.fn.zTree.init($("#tree_role"), setting, data);
            }
        });
	}
	
	function createResCheckTree() {
		$.ajax({
            url : getStaticPath() + "/core/system/acl/data/treeRes.json",
            success : function(data) {
            	//配置ztree的属性
                var setting = {
                    data: {
                    	key : {
                    		name:"name"
                    	},
                        simpleData: {
                            enable: true
//                            idKey:"id",
//                            pIdKey:"pId",
//                            rootPId:null
                        }
                    },
                    check : {
                    	enable : true
                    },
                    callback : {
                        onClick : function(event, treeId, treeNode, clickFlag) {
                        	
                        },
                        onCheck : function() {
                        	var nodes = $.fn.zTree.getZTreeObj("tree_check_res").getChangeCheckedNodes()
                        	if (nodes && nodes.length > 0) {
                        		$("#btn_authSet_save").removeClass("disabled");
                        	} else {
                        		$("#btn_authSet_save").addClass("disabled");
                        	}
                        }
                    }
                }
                //初始化
                $.fn.zTree.init($("#tree_check_res"), setting, data);
                setResTreeCheck();
            }
        });
	}
	
	function setResTreeCheck() {
		var treeObj = $.fn.zTree.getZTreeObj("tree_check_res");
		var nodes = treeObj.getNodes();
		var arr = ["0101", "0201"];
		$.each(arr, function(i, n){
			var node = treeObj.getNodeByParam("id", n);
			treeObj.checkNode(node, true);
		})
	}
	
	/*--------------------------------------变更模块---------------------------------------------*/
	function initAuthUpdate() {
		createResCheckTree2();
	}
	
	function createResCheckTree2() {
		$.ajax({
            url : getStaticPath() + "/core/system/acl/data/treeRes.json",
            success : function(data) {
            	//配置ztree的属性
                var setting = {
                    data: {
                    	key : {
                    		name:"name"
                    	},
                        simpleData: {
                            enable: true,
                            pIdKey:"pId"
//                            idKey:"id",
//                            pIdKey:"pId",
//                            rootPId:null
                        }
                    },
                    check : {
                    	enable : true
                    },
                    callback : {
                        onClick : function(event, treeId, treeNode, clickFlag) {
                        	
                        },
                        onCheck : function() {
                        }
                    }
                }
                //初始化
                console.log(data);
                $.fn.zTree.init($("#tree_check_res2"), setting, data);
            }
        });
	}
	
    return {
        init:init
    }
});