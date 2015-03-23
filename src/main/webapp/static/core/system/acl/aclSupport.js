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
                            },
                            onRemove : function() {
                            	var treeObj = $.fn.zTree.getZTreeObj("tree_resDir");
	 							if (!treeObj) {
	 								createResTree();
	 							} else {
	 								var nodes = $.fn.zTree.getZTreeObj("tree_resDir").getSelectedNodes();
	 								if (!nodes || nodes.length == 0) {
	 									showResTreeTip();
	 								}
	 							}
                            }
                        }
                    }
                    //初始化
                    $.fn.zTree.init($("#tree_resDir"), setting, data);
                    //展开所有
                    $.fn.zTree.getZTreeObj("tree_resDir").expandAll(true);
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
    	var treeNode = $.fn.zTree.getZTreeObj("tree_resDir").getSelectedNodes()[0];
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
    	                	on_BtnAuthResEdit_click(e.data.row);
    	            	}
    	            },{
    	                name:"资源地址",field:"resUrl"
    	            },{
    	                name:"资源描述",field:"resDesc"
    	            }],
    	            toolbar:[
    	                {name:"添加",class:"fa fa-plus-circle",callback:on_BtnAuthResAdd_click},
    	                {name:"删除",class:"fa fa-trash-o",callback:function(event){ deleteRes(); }},
    	                {name:"刷新",class:"fa fa-refresh",callback:function(event){ createResGrid(); }}
    	            ],
    	            data:data
    	        })
    		}
    	});
    }

    /* 校验是否选择目录节点 */
    function validate_opr_resSort() {
    	var nodes = $.fn.zTree.getZTreeObj("tree_resDir").getSelectedNodes();
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
    	var nodes = validate_opr_resSort();
    	if (nodes) {
    		editResSort(false, {
    			resPid : nodes[0].resId,
    			resParent : nodes[0].resName
    		});
    	}
    }
    
    function on_BtnAuthResEditSort_click() {
    	var nodes = validate_opr_resSort();
    	if (nodes) {
    		editResSort(true, nodes[0]);
    	}
    }
    
    function on_BtnAuthResDeleteSort_click() {
		deleteResSort();
    }
    
    /** 添加/编辑 资源分类 */
    function editResSort(edit, row) {
    	 util.slidebar({
	         url:sysPath + "/acl/views/res_sort.html",
	         width:"500px",
	         cache:false,
	         afterLoad : function() {
	        	//如果是编辑，需要重新从后台获取最新的数据
	        	if (edit) {
	        		$.ajax({
	        			url : getServer() + "/sword/authGetRes",
	        			data : {
	        				resId : row.resId
	        			},
	        			success : function(data) {
	        				setFormData("#form_resSort", data);
	        			}
	        		});
	        	} else {
	        		//添加时初始化表单
		        	setFormData("#form_resSort", row);
	        	}
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
	    	 					util.alert(data.message);
	    	 					if (data.code == "success") {
	    	 						hideResTreeTip();
	    	 						if(!edit) {
	    	 							var treeObj = $.fn.zTree.getZTreeObj("tree_resDir");
	    	 							if (!treeObj) {
	    	 								createResTree();
	    	 							} else {
	    	 								var nodes = $.fn.zTree.getZTreeObj("tree_resDir").getSelectedNodes();
	    	 								var node = nodes.length > 0 ? nodes[0] : null;
	    	 								$.fn.zTree.getZTreeObj("tree_resDir").addNodes(node, data.data);
	    	 							}
	    	 						} else {
	    	 							$.extend(row, data.data);
	    	 							$.fn.zTree.getZTreeObj("tree_resDir").updateNode(row);
	    	 						}
	    	 					}
	    	 				}
	    	 			});
	    	 		}
	    	 	})
	         }
	     });
    }
    
  //删除资源
	function deleteResSort() {
		var nodes = $.fn.zTree.getZTreeObj("tree_resDir").getSelectedNodes();
		if (nodes && nodes.length > 0) {
			util.confirm("确定要删除指定的记录吗？", function() {
				var ids = "";
				$.each(nodes, function(i, node){
					ids = ids.concat(node.resId).concat(",");
				})
				$.ajax({
					url : getServer() + "/sword/authDeleteRes",
					data : {
						ids : ids
					},
					success : function(data) {
						util.alert(data.message);
						if (data.code == "success") {
							$.each(nodes, function(i, node){
								$.fn.zTree.getZTreeObj("tree_resDir").removeNode(node, true);
							})
						}
					}
				})
			});
		} else {
			util.alert("请选择要删除的行记录");
		}
	}
    
    function on_BtnAuthResAdd_click() {
    	var nodes = validate_opr_resSort();
    	if (nodes) {
    		editRes(false, {
    			resPid : nodes[0].resId,
    			resParent : nodes[0].resName
    		});
    	}
    }
    
    function on_BtnAuthResEdit_click(row) {
		editRes(true, row);
    }
    
    function on_BtnAuthResDelete_click() {
    	
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
            		setFormData("#form_res", row);
            	}
            	//监听【保存】按钮事件
            	$("#btn_res_save").on("click", function() {
            		$("#form_res").validate({
            			rules : {
            				resName : "required",
            				resUrl : "required",
            			},
            			messages : {
            				resName : "请填写资源名称",
            				resUrl : "请填写资源地址"
            			}
            		})
            		if ($("#form_res").valid()) {
            			var data = getFormData("#form_res");
            			$.ajax({
            				url : getServer() + "/sword/authSaveRes",
            				data : data,
            				type : "post",
            				success : function(data) {
            					util.alert(data.message);
            					if (data.code == "success") {
            						createResGrid();
            					}
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
						util.alert(data.message);
						if (data.code == "success") {
							createResGrid();
						}
					}
				})
			});
		} else {
			util.alert("请选择要删除的行记录");
		}
	}

	/*--------------------------------------授权模块---------------------------------------------*/
	function initAuthSet() {
		//初始化角色选择资源
		initAuthSetRoleRes();
		//初始化资源选择角色
		initAuthSetResRole();
		$("#btn_authSet_save").on("click", function(){
			if ($("#tab_roleRes").hasClass("active")) {
				saveRoleRes();
			} else if ($("#tab_resRole").hasClass("active")) {
				saveResRole();
			}
		})
	}
	
	function initAuthSetRoleRes() {
		createRoleTree();
		createResCheckTree();
	}
	
	/* 创建角色目录树 */
	function createRoleTree() {
		$.ajax({
            url: getServer()+"/sword/orgGetAllRoleDir",
            success:function(data) {
                var arr = [];
                for (var i = 0, dir; dir = data[i++];) {
                    if (dir.dirCode == "root") {
                        arr.push({"id": "root", "name": dir.dirName, "open": true});
                    } else {
                        arr.push({"id": dir.dirCode, "pId": dir.pDirCode, "name": dir.dirName});
                    }
                }
                var setting = {
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        onClick:function (event, treeId, treeNode) {
                        	createRoleGrid();
                        }
                    }
                };
                $.fn.zTree.init($("#tree_roleDir"), setting, arr);
            }
        });
	}
	
	/* 创建角色表格 */
	function createRoleGrid() {
		var nodes = $.fn.zTree.getZTreeObj("tree_roleDir").getSelectedNodes();
		var node = nodes.length && nodes[0];
		var config = {
            id: "gridRole",
            placeAt : "grid_role",
            index:"radio",
            hidden:false,
            pagination:false,
            layout: [
                {
                    name: "角色编号", field: "roleCode", click: function (e) {
                    	//设置角色-资源
                    	setResTreeCheck(e.data.row.roleCode);
                    }
                },
                {name: "角色名称", field: "roleName"}
            ],
            data: {
                "type": "URL",
                "value": getServer() + "/sword/orgGetRoleByPidPage?dir_code="+node.id
            }
    	};
        grid.init(config);
	}
	
	/* 创建资源树 */
	function createResCheckTree() {
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
                $.fn.zTree.init($("#treeCheck_res"), setting, data);
                //展开所有
                $.fn.zTree.getZTreeObj("treeCheck_res").expandAll(true);
            }
        });
	}
	
	/* 根据所选择角色勾选不同角色的资源 */
	function setResTreeCheck(roleId) {
		$.ajax({
			url : getServer() + "/sword/authGetRoleRes",
			data : {
				roleId : roleId
			},
			success : function(data) {
				$.fn.zTree.getZTreeObj("treeCheck_res").checkAllNodes(false);
				$.each(data, function(i, n) {
					var treeObj = $.fn.zTree.getZTreeObj("treeCheck_res");
					var node = treeObj.getNodeByParam("resId", n.resId);
					if (node) {
						treeObj.checkNode(node, true);
					}
				})
			}
		})
	}
	
	/* 保存角色资源 */
	function saveRoleRes() {
		var rows = grid.getGrid("gridRole") && grid.getGrid("gridRole").getSelectedRow();
		if (rows && rows.length > 0) {
			var row = rows[0];
			util.confirm("确定要保存角色【" + row.roleName + "】授权吗？", function() {
				var resIds = [];
				var nodes = $.fn.zTree.getZTreeObj("treeCheck_res").getCheckedNodes(true);
				$.each(nodes, function(i, n) {
					resIds.push(n.resId);
				})
				$.ajax({
					url : getServer() + "/sword/authSaveRoleRes",
					data : {
						roleId : row.uuid,
						resIds : resIds.join(",") 
					},
					success : function(data) {
						util.alert(data.message);
					}
				})
			});
		} else {
			util.alert("请选择角色");
		}
	}
	
	function initAuthSetResRole() {
		createSetResDirTree();
		createRoleCheckTree();
	}
	
	/* 创建资源目录树 */
	function createSetResDirTree() {
		$.ajax({
            url: getServer()+"/sword/authGetResSort",
            success:function(data) {
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
                        	createSetResGrid();
                        }
                    }
                }
                //初始化
                $.fn.zTree.init($("#tree_roleDir_set"), setting, data);
                //展开所有
                $.fn.zTree.getZTreeObj("tree_roleDir_set").expandAll(true);
            }
        });
	}
	
	/* 创建角色表格 */
	function createSetResGrid() {
		var nodes = $.fn.zTree.getZTreeObj("tree_roleDir_set").getSelectedNodes();
		var node = nodes.length && nodes[0];
    	$.ajax({
    		url : getServer() + "/sword/authGetResSub",
    		data : {
    			resPid : node.resId
    		},
    		success : function(data) {
    			grid({
    	            id : "gridResSet",
    	            placeAt : "grid_res_set",
    	            index:"radio",
    	            hidden:false,
    	            pagination:true,
    	            layout : [{
    	                name:"资源名称",field:"resName",click:function(e){
    	                	setRoleTreeCheck(e.data.row.resId);
    	            	}
    	            }],
    	            data:data
    	        })
    		}
    	});
	}
	
	/* 创建角色树 */
	function createRoleCheckTree() {
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
                            enable: true
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
                $.fn.zTree.init($("#treeCheck_role"), setting, data);
                //展开所有
                $.fn.zTree.getZTreeObj("treeCheck_role").expandAll(true);
            }
        });
	}
	
	/* 根据所选择资源勾选不同资源的角色 */
	function setRoleTreeCheck(resId) {
		$.ajax({
			url : getServer() + "/sword/authGetResRole",
			data : {
				resId : resId
			},
			success : function(data) {
				$.fn.zTree.getZTreeObj("treeCheck_role").checkAllNodes(false);
				$.each(data, function(i, n) {
					var treeObj = $.fn.zTree.getZTreeObj("treeCheck_role");
					var node = treeObj.getNodeByParam("id", n.roleId);
					if (node) {
						treeObj.checkNode(node, true);
					}
				})
			}
		})
	}
	
	/* 保存资源角色 */
	function saveResRole() {
		var rows = grid.getGrid("gridResSet") && grid.getGrid("gridResSet").getSelectedRow();
		if (rows && rows.length > 0) {
			var row = rows[0];
			util.confirm("确定要保存资源【" + row.resName + "】授权吗？", function() {
				var roleIds = [];
				var nodes = $.fn.zTree.getZTreeObj("treeCheck_role").getCheckedNodes(true);
				$.each(nodes, function(i, n) {
					roleIds.push(n.id);
				})
				$.ajax({
					url : getServer() + "/sword/authSaveResRole",
					data : {
						resId : row.resId,
						roleIds : roleIds.join(",") 
					},
					success : function(data) {
						util.alert(data.message);
					}
				})
			});
		} else {
			util.alert("请选择角色");
		}
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
                $.fn.zTree.init($("#tree_check_res2"), setting, data);
            }
        });
	}
	
    return {
        init:init
    }
});