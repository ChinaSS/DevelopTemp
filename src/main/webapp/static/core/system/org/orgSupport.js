/**
 * Created by YiYing on 2015/1/14.
 */
define(["UtilDir/grid","UtilDir/util","ZTree","css!ZTreeCss"],function(grid,util){

    var sysPath = "core/system";

    /**
     * 创建部门树
     */
    var createDeptTree = function(element){
        $.ajax({
            //静态数据
            //"url":sysPath+"/org/data/OrgTree.json",
            //"url": getServer()+"/v1/org/dept",
            "url": getServer()+"/sword/orgGetAllDept",
            "success":function(data) {
                //console.log(data)
                //数据转换zTree支持的格式
                var arr = [];
                for (var i = 0, dept; dept = data[i++];) {
                    if (dept.deptId == "root") {
                        arr.push({"id": "root", "name": dept.deptName, "open": true});
                    } else {
                        arr.push({"id": dept.deptId, "pId": dept.pDeptId, "name": dept.deptName});
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
                            $("#orgShowListTitle").html("组织-"+treeNode.name);
                            showListPanel();
                            showPersonList(treeNode.id);

                            //单击节点展开
                            $.fn.zTree.getZTreeObj("orgtree").expandNode(treeNode);
                            //显示组织相关操作
                            toolbarDisplay(["btn_importOrg","btn_importPerson","btn_editDept","btn_addDept","btn_addPerson"])
                        }
                    }
                };
                $.fn.zTree.init(element, setting, arr);
            }
        });
    };

    /**
     * 创建角色树
     */
    var createRoleTree = function(element){
        $.ajax({
            //"url":sysPath+"/org/data/RoleTree.json",
            //"url": util.getServerPath()+"/org/roleDir/v1/",
            "url": getServer()+"/sword/orgGetAllRoleDir",
            "success":function(data) {
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
                            $("#orgShowListTitle").html("角色-"+treeNode.name);
                            showListPanel();
                            //查询出该节点下的所有角色信息
                            showRoleList(treeNode.id);
                            //单击节点展开
                            $.fn.zTree.getZTreeObj("roletree").expandNode(treeNode);
                            //显示角色相关操作
                            toolbarDisplay(["btn_importRoleDir","btn_importRole","btn_editRoleDir","btn_addRoleDir","btn_addRole"])
                        }
                    }
                };
                $.fn.zTree.init(element, setting, arr);
            }
        });
    };

    /**
     * 创建高级功能树
     */
    var createConfigTree = function(element){
        var setting = {
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick:function (event, treeId, treeNode) {
                    $("#orgShowListTitle").html("高级-"+treeNode.name);
                    showListPanel();

                    switch(treeNode.id){
                        case "GWConfig":
                            showGWList();
                            break;
                        case "ZWConfig":
                            showZWList();
                            break;
                        case "AllDept":
                            showAllDeptList();
                            break;
                        case "AllPerson":
                            showPersonList();
                            break;
                        case "AllRole":
                            showRoleList();
                            break;
                        case "RoleDir":
                            showRoleDirList();
                            break;
                        case "NoDeptPerson":
                            showPersonList();
                            break;
                        case "LockPerson":
                            showPersonList();
                            break;
                        case "LockDept":
                            showAllDeptList();
                            break;
                        case "Log":

                            break;
                    }

                    //显示相关操作
                    if(treeNode.id=="GWConfig"){
                        toolbarDisplay(["btn_importGW","btn_addGW"]);       //显示岗位导入、新增岗位
                    }else if(treeNode.id=="ZWConfig"){
                        toolbarDisplay(["btn_importZW","btn_addZW"]);       //显示职位导入、新增职务
                    }else{
                        toolbarDisplay([])
                    }
                }
            }
        };
        $.fn.zTree.init(element, setting, [
            { "id": "root", "name": "高级功能", "open": true },
            { "id": "GWConfig", "pId":"root", "name": "岗位管理"},
            { "id": "ZWConfig", "pId": "root", "name": "职务管理"},
            { "id": "AllDept", "pId":"root", "name": "所有部门列表"},
            { "id": "AllPerson", "pId": "root", "name": "所有人员列表"},
            { "id": "AllRole", "pId": "root", "name": "所有角色列表"},
            { "id": "RoleDir", "pId": "root", "name": "角色目录列表"},
            { "id": "NoDeptPerson", "pId": "root", "name": "未归属部门人员列表"},
            { "id": "LockPerson", "pId": "root", "name": "冻结人员列表"},
            { "id": "LockDept", "pId": "root", "name": "冻结部门列表"},
            { "id": "Log", "pId": "root", "name": "特殊操作日志"}
        ]);
    };

    /**
     * 显示信息列表容器
     */
    var showListPanel = function(){
        //显示隐藏控制
        $("#orgMainId").hide();
        $("#orgShowListContent").empty();
        $("#orgShowListPanel").show();
    };


    //数据列表公共部分
    var comConfig = {
        placeAt:"orgShowListContent",        //存放Grid的容器ID
        pageSize:10                          //一页多少条数据
    };
    /**
     * 显示人员列表
     * @param id
     */
    var showPersonList = function(id){
        var config = {
            id:"OrgPersonList",
            layout:[
                {name:"用户名",field:"userCode",click:function(e){
                    editPerson(e.data.row.userCode);
                }},
                {name:"姓名",field:"userName"},
                {name:"员工编号",field:"userCode"},
                {name:"办公电话",field:"officePhone"},
                {name:"移动电话",field:"phone"},
                {name:"邮件",field:"email"}
            ],
            data:{
                "type":"URL",
                //"value":getServer()+"/org/data/Persons.json"
                "value": getServer() + "/sword/"+ (id?"orgGetUserByDeptIdPage":"orgGetAllUserPage") +"?dept_id="+id
            }
        };
        grid.init($.extend(config,comConfig));
    };

    /**
     * 显示角色列表
     * @param id
     */
    var showRoleList = function(id){
        var config = {
            id: "OrgRoleList",
            layout: [
                {
                    name: "角色编号", field: "roleCode", click: function (e) {
                        //console.log(e.data);
                        editRole(e.data.row.roleCode);
                    }
                },
                {name: "角色名称", field: "roleName"},
                {name: "管理员", field: "managerName"},
                {name: "所属目录", field: "dirName"},
                {name: "序号", field: "sort"}
            ],
            data: {
                "type": "URL",
                //"value": sysPath + "/org/data/Roles.json"
                "value": getServer() + "/sword/"+(id?"orgGetRoleByPidPage":"orgGetAllRolePage")+"?dir_code="+id
            }
        };
        grid.init($.extend(config,comConfig));
    };

    /**
     * 显示角色目录列表
     */
    var showRoleDirList = function(){
        var config = {
            id: "OrgRoleDirList",
            layout: [
                {
                    name: "目录编号", field: "dirCode", click: function (e) {
                    //console.log(e.data);
                    editRoleDir(e.data.row.dirCode);
                }
                },
                {name: "目录名称", field: "dirName"},
                {name: "父节点编号", field: "pDirCode"},
                {name: "父节点名称", field: "pDirName"}
            ],
            data: {
                "type": "URL",
                "value": getServer() + "/sword/orgGetAllRoleDirPage"
            }
        };
        grid.init($.extend(config,comConfig));
    };

    /**
     * 显示岗位列表
     */
    var showGWList = function(){
        var config = {
            id: "OrgGWList",
            layout: [
                {
                    name: "岗位编号", field: "gwCode", click: function (e) {
                        editGW(e.data.row.gwCode);
                    }
                },
                {name: "岗位名称", field: "gwName"},
                {name: "序号", field: "sort"}
            ],
            data: {
                "type": "URL",
                //"value": sysPath + "/org/data/GWs.json"
                "value": getServer() + "/sword/orgGetAllGw"
            }
        };
        grid.init($.extend(config,comConfig));
    };

    /**
     * 显示职务列表
     */
    var showZWList = function(){
        var config = {
            id: "OrgZWList",
            layout: [
                {
                    name: "职务编号", field: "zwCode", click: function (e) {
                        //console.log(e.data);
                        editZW(e.data.row.zwCode);
                    }
                },
                {name: "职务名称", field: "zwName"},
                {name: "序号", field: "sort"}
            ],
            data: {
                "type": "URL",
                //"value": sysPath + "/org/data/ZWs.json"
                "value": getServer() + "/sword/orgGetAllZwPage"
            }
        };
        grid.init($.extend(config,comConfig));
    };

    /**
     * 显示所有部门列表
     */
    var showAllDeptList = function(){
        var config = {
            id: "OrgAllDeptList",
            layout: [
                {
                    name: "部门名称", field: "deptName", click: function (e) {
                    //console.log(e.data);

                    }
                },
                {name: "部门编号", field: "deptCode"},
                {name: "部门领导", field: "leader"},
                {name: "所属组织", field: "pDeptName"},
                {name: "序号", field: "sort"}
            ],
            data: {
                "type": "URL",
                //"value": sysPath + "/org/data/AllDept.json"
                "value": getServer() +"/sword/orgGetAllDeptPage"
            }
        };
        grid.init($.extend(config,comConfig));
    };

    /******************************侧边栏**********************************/
    //弹出组织配置
    var showConfigSidebar = function(){
        util.slidebar({
            url:getStaticPath()+"/core/system/org/views/orgConfig.html",
            close:true,
            width:"500px"
        });
    };
    //弹出人员侧边栏
    var showPersonSidebar = function(param){
        util.slidebar($.extend({
            url:getStaticPath()+"/core/system/org/views/orgPerson.html",
            cache:false,
            close:true,
            width:"800px"
        },param));
    };
    //弹出部门侧边栏
    var showDeptSidebar = function(param){
        util.slidebar($.extend({
            url:getStaticPath()+"/core/system/org/views/orgDept.html",
            cache:false,
            close:true,
            width:"800px"
        },param));
    };
    //弹出角色目录侧边栏
    var showRoleDirSidebar = function(param){
        util.slidebar($.extend({
            url:getStaticPath()+"/core/system/org/views/orgRoleDir.html",
            cache:false,
            close:true,
            width:"500px"
        },param));
    };
    //弹出角色侧边栏
    var showRoleSidebar = function(param){
        util.slidebar($.extend({
            url:getStaticPath()+"/core/system/org/views/orgRole.html",
            cache:false,
            close:true,
            width:"500px"
        },param));
    };
    //弹出岗位侧边栏
    var showGWSidebar = function(param){
        util.slidebar($.extend({
            url:getStaticPath()+"/core/system/org/views/orgGW.html",
            //id:"EditGWPanel",
            cache:false,
            close:true,
            width:"500px"
        },param));
    };
    //弹出职务侧边栏
    var showZWSidebar = function(param){
        util.slidebar($.extend({
            url:getStaticPath()+"/core/system/org/views/orgZW.html",
            //id:"EditZWPanel",
            cache:false,
            close:true,
            width:"500px"
        },param));
    };

    /******************************操作栏相关**********************************/
    /**
     * 操作栏显示隐藏公共方法
     * @param arr
     */
    var toolbarDisplay = function(arr){
        //隐藏全部按钮(第一个组织配置除外)
        $("#org_toolbar>button").not(":first").css({"display":"none"});
        //默认显示组织配置
        $("#btn_orgConfig").css({"display":"inline-block"});
        //显示指定id按钮
        for(var i= 0,id;id=arr[i++];){
            $("#"+id).css({"display":"inline-block"});
        }
    };

    $("#btn_orgConfig").click(function(){ showConfigSidebar() });
    $("#btn_importOrg").click(function(){ importOrg() });
    $("#btn_importPerson").click(function(){ importPerson() });
    $("#btn_importRoleDir").click(function(){ importRoleDir() });
    $("#btn_importRole").click(function(){ importRole() });
    $("#btn_importGW").click(function(){ importGW() });
    $("#btn_importZW").click(function(){ importZW() });
    $("#btn_editDept").click(function(){ editDept() });
    $("#btn_addDept").click(function(){ addDept() });
    $("#btn_addPerson").click(function(){ addPerson() });
    $("#btn_editRoleDir").click(function(){ editRoleDir() });
    $("#btn_addRoleDir").click(function(){ addRoleDir() });
    $("#btn_addRole").click(function(){ addRole() });
    $("#btn_addGW").click(function(){ addGW() });
    $("#btn_addZW").click(function(){ addZW() });


    /******************************页签切换事件绑定**********************************/
    $("#li_orgTab").click(function(){
        //显示组织导入、人员导入
        toolbarDisplay(["btn_importOrg","btn_importPerson"]);
    });
    $("#li_roleTab").click(function(){
        //显示角色目录导入、角色导入
        toolbarDisplay(["btn_importRoleDir","btn_importRole"]);
    });
    $("#li_configTab").click(function(){
        //隐藏所有
        toolbarDisplay([]);
    });


    /******************************组织相关**********************************/
    /**
     * 取得选择的树节点id
     * @param id
     * @returns {*}
     */
    var getSelectTreeNodeId = function(id){
        var nodes = $.fn.zTree.getZTreeObj(id).getSelectedNodes();
        return nodes.length?nodes[0].id : false
    };
    var getSelectTreeNodeName = function(id){
        var nodes = $.fn.zTree.getZTreeObj(id).getSelectedNodes();
        return nodes.length?nodes[0].name : false
    };

    //组织导入
    var importOrg = function(){
        var mapping = {
            "ServiceName":"orgImportDept",
            "EntityClassName":"com.css.sword.org.entity.OrgDept",
            "部门ID":"deptId","部门编号":"deptCode","部门名称":"deptName","部门领导":"leader","部门领导编号":"leaderCode",
            "管理人员":"manager","管理人员编号":"managerCode","成本中心名称":"costCenterName","成本中心代码":"costCenterCode","部门级别":"level",
            "显示序号":"sort","所属部门名称":"pDeptName","所属部门ID":"pDeptId","部门OU":"ou",
            "部门信息1":"extend1","部门信息2":"extend2","部门信息3":"extend3","部门信息4":"extend4",
            "部门信息5":"extend5","部门信息6":"extend6","部门信息7":"extend7","部门信息8":"extend8",
            "部门信息9":"extend9","部门信息10":"extend10","部门信息11":"extend11","部门信息12":"extend12",
            "部门信息13":"extend13","部门信息14":"extend14","部门信息15":"extend15","部门信息16":"extend16",
            "部门信息17":"extend17","部门信息18":"extend18","部门信息19":"extend19","部门信息20":"extend20"
        };
        importExcel({
            "title":"组织导入",
            "templeteURL":sysPath+"/org/views/importDept.html",
            "mapping":mapping
        });
    };
    //人员导入
    var importPerson = function(){
            var mapping = {
                "ServiceName":"orgImportUser",
                "EntityClassName":"com.css.sword.org.entity.OrgUser",
                "员工编号":"userCode","用户名称":"userName","性别":"sex","生日":"birthday","办公电话":"officePhone",
                "移动电话":"phone","传真":"fax","邮箱":"email","职务名称":"zwName",
                "职务编号":"zwCode","显示序号":"sort","是否冻结":"locked",
                "部门名称":"deptName","部门ID":"deptId","兼职部门名称":"jzDeptName","兼职部门ID":"jzDeptId",
                "人员信息1":"extend1","人员信息2":"extend2","人员信息3":"extend3","人员信息4":"extend4",
                "人员信息5":"extend5","人员信息6":"extend6","人员信息7":"extend7","人员信息8":"extend8",
                "人员信息9":"extend9","人员信息10":"extend10","人员信息11":"extend11","人员信息12":"extend12",
                "人员信息13":"extend13","人员信息14":"extend14","人员信息15":"extend15","人员信息16":"extend16",
                "人员信息17":"extend17","人员信息18":"extend18","人员信息19":"extend19","人员信息20":"extend20"
            };
            importExcel({
                "title":"人员导入",
                "templeteURL":sysPath+"/org/views/importPerson.html",
                "mapping":mapping
            });
    };

    //部门侧边栏操作按钮显示隐藏控制
    var orgSidebarTools = function(){
        $("#tab_DeptBaseInfo").click(function(){
            $("#btn_orgDetpAddPerson").hide();
            $("#btn_orgAddGW").hide();
        });
        $("#tab_DeptMembers").click(function(){
            $("#btn_orgDetpAddPerson").show();
            $("#btn_orgAddGW").hide();
        });
        $("#tab_DeptGWInfo").click(function(){
            $("#btn_orgDetpAddPerson").hide();
            $("#btn_orgAddGW").show();
        });
        $("#tab_DeptExtendInfo").click(function(){
            $("#btn_orgDetpAddPerson").hide();
            $("#btn_orgAddGW").hide();
        })
    };
    //部门编辑
    var editDept = function(){
        var deptId = getSelectTreeNodeId("orgtree");
        //获取当前需要编辑的部门对象数据
        $.ajax({
            url:sysPath+"/org/data/Dept.json",
            dataType:"json",
            success:function(data){
                //弹出部门编辑侧边栏
                showDeptSidebar({
                    afterLoad:function(){
                        $("#org_deptName").html(data.Org.Dept.DeptInfo.BaseInfo.deptName);
                        $("#org_deptId").html(data.Org.Dept.DeptInfo.BaseInfo.deptId);
                        setNgModel("DeptBaseInfo",data);
                        setNgModel("DeptExtendInfo",data);
                        //人员列表
                        document.getElementById("T_DeptMembers").outerHTML = util.template("T_DeptMembers",data);
                        //岗位列表
                        document.getElementById("T_GWList").outerHTML = util.template("T_GWList",data);
                        //页签切换时控制操作按钮的显示隐藏
                        orgSidebarTools();
                        //部门保存
                        $("#btn_orgDetpSave").click(orgDetpSave);
                        //新增成员
                        $("#btn_orgDetpAddPerson").click(orgDetpAddPerson);
                        //新增岗位
                        $("#btn_orgAddGW").click(orgAddGW);
                    }
                });
            }
        });
    };
    //部门保存
    var orgDetpSave = function(){
        console.log(getNgModel("DeptBaseInfo"));
        //getNgModel("DeptExtendInfo")

    };
    //新增成员
    var orgDetpAddPerson = function(){

    };
    //新增岗位
    var orgAddGW = function(){

    };


    //新增部门
    var addDept = function(){
        var deptNode = $.fn.zTree.getZTreeObj("orgtree").getSelectedNodes();
        showDeptSidebar({
            afterLoad:function(){
                $("#pDeptName").val(deptNode[0].name);
                $("#pDeptId").val(deptNode[0].id);
                orgSidebarTools();
            }
        });
    };

    //新增人员
    var addPerson = function(){

        showPersonSidebar({
            afterLoad: function(){
                initZW();
            }
        });
    };
    //人员编辑
    var editPerson = function(userCode){
        //更新当前编辑人员scope
        /*$http.get('lib/core/org/data/Person.json').success(function(data) {
            //更新职务对象
            for(var i= 0,item;item=$scope.$parent.Org.Person.ZWList[i++];){
                data.PersonInfo.BaseInfo.ZW.id==item.id ? data.PersonInfo.BaseInfo.ZW=item :"";
            }
            $scope.$parent.Org.Person = $.extend($scope.$parent.Org.Person,data);
        });*/

        //获取当前需要编辑的人员对象数据
        $.ajax({
            //url:sysPath+"/org/data/Person.json",
            url:getServer()+"/sword/orgGetUserById",
            dataType:"json",
            data:{"user_code":userCode},
            success:function(data){
                
                showPersonSidebar({
                    afterLoad:function(){
                        $("#org_PersonName").html(data.Org.Person.PersonInfo.BaseInfo.userName);
                        $("#org_PersonDeptName").html(data.Org.Person.PersonInfo.DeptInfo.deptName);
                        setNgModel("PersonBaseInfo",data);
                        //职务初始化
                        initZW(data.Org.Person.PersonInfo.BaseInfo.ZW);
                        //性别与是否冻结
                        $("input[type='radio'][name='sex'][value='"+data.Org.Person.PersonInfo.BaseInfo.sex+"']").attr("checked", "checked");
                        $("input[type='radio'][name='locked'][value='"+data.Org.Person.PersonInfo.BaseInfo.locked+"']").attr("checked", "checked");
                        setNgModel("PersonExtendInfo",data);
                        //所属角色
                        document.getElementById("T_PersonRoles").outerHTML = util.template("T_PersonRoles",data);
                        //所属岗位
                        document.getElementById("T_PersonGW").outerHTML = util.template("T_PersonGW",data);

                    }
                });
            }
        });
    };

    //职务初始化
    var initZW = function(val){
        $.ajax({
            //url:sysPath+"/org/data/ZWList.json",
            url:getServer()+"sword/orgGetAllZw",
            dataType:"json",
            success:function(data){
                var $sel = $("#sle_PersonZW");
                //初始化人员操作界面的职务选择下拉
                for(var i= 0,item;item=data[i++];){
                    $sel.append('<option value="'+item.zwCode+'">'+item.zwName+'</option>');
                }
                //设置选中值
                val && $sel.val(val);
            }
        })
    };

    /*****************角色相关**************/
    //角色目录导入
    var importRoleDir = function(){
        var mapping = {
            "ServiceName":"orgImportRoleDir",
            "EntityClassName":"com.css.sword.org.entity.OrgRoleDir",
            "目录名称":"dirName","目录编号":"dirCode","父目录编号":"pDirCode","父目录名称":"pDirName"
        };
        importExcel({
            "title":"角色目录导入",
            "templeteURL":sysPath+"/org/views/importRoleDir.html",
            "mapping":mapping
        });
    };
    //角色导入
    var importRole = function(){
        var mapping = {
            "ServiceName":"orgImportRole",
            "EntityClassName":"com.css.sword.org.entity.OrgRole",
            "角色编号":"roleCode","角色名称":"roleName","管理人员编号":"managerCode","管理人员名称":"managerName",
            "所属目录编号":"dirCode","所属目录名称":"dirName","序号":"sort"
        };
        importExcel({
            "title":"角色导入",
            "templeteURL":sysPath+"/org/views/importRole.html",
            "mapping":mapping
        });
    };
    //编辑角色目录
    var editRoleDir = function(){
        var dir_code = getSelectTreeNodeId("roletree");
        $.ajax({
            //url:sysPath+"/org/data/RoleDir.json",
            url:getServer()+"/sword/orgGetRoleDir",
            data:{"dir_code":dir_code},
            success:function(data){
                data = {Org:{RoleDir:data}};
                showRoleDirSidebar({
                    afterLoad:function(){
                        $("#org_RoleDirName").html(data.Org.RoleDir.dirName);
                        setNgModel("tab_RoleDir",data);
                        //保存事件绑定
                        saveOrgRoleDirBtnBind("update");
                        //编辑时，角色编号字段不可编辑
                        $("#dirCode").attr("readonly",true);
                        //表单验证
                        validateRoleDir();
                    }
                });
            }
        });
    };
    //新增角色目录
    var addRoleDir = function(){
        showRoleDirSidebar({
            afterLoad:function(){
                var curNode = $.fn.zTree.getZTreeObj("roletree").getSelectedNodes()[0];//.getParentNode();
                $("#PDirName").val(curNode.name);
                $("#PDirCode").val(curNode.id);
                //保存事件绑定
                saveOrgRoleDirBtnBind("insert");
                //表单验证
                validateRoleDir({
                    rules:{
                        dirCode:{
                            required:true,
                            remote:{
                                type:"POST",                                        //请求方式
                                url: getServer()+"/sword/orgValidateRoleDirCode",   //请求的服务
                                data:{                                              //要传递的参数
                                    dir_code:function(){return $("#dirCode").val();}
                                }
                            }
                        }
                    },
                    messages: {
                        dirCode:{
                            remote:"角色目录编号已存在,请重新输入"
                        }
                    }
                });
            }
        });
    };

    /**
     * 角色目录保存
     */
    var saveOrgRoleDirBtnBind = function(saveType){
        $("#saveOrgRoleDirBtn").bind("click",function(){
            if($("#RoleDirForm").valid()){
                var entity = getNgModel("tab_RoleDir");
                //console.log(entity);
                $.ajax({
                    url:getServer()+"/sword/orgSaveRoleDir",
                    dataType:"json",
                    data:entity,
                    success:function(data){
                        //console.log(data);
                        if(data.status){
                            //刷新树
                            //$.fn.zTree.getZTreeObj("roletree").reAsyncChildNodes(null, "refresh");
                            var tree = $.fn.zTree.getZTreeObj("roletree");
                            var curNode = tree.getSelectedNodes()[0];
                            if(saveType=="insert"){
                                $.fn.zTree.getZTreeObj("roletree").addNodes(curNode,{name:entity.dirName,id:entity.dirCode});
                            }else{
                                curNode.name = entity.dirName;
                            }
                            tree.updateNode(curNode);
                        }
                        util.alert(data.message);
                    }
                })
            }
        })
    };

    var validateRoleDir = function(extend){
        //数据验证
        $("#RoleDirForm").validate($.extend(true,{
            rules:{
                dirName:{required:true}
            },
            messages: {}
        },extend));
    };


    /*****************************角色相关********************************/
    //新增角色
    var addRole = function(){
        showRoleSidebar({
            afterLoad:function(){
                saveOrgRoleBtnBind("insert");
                var dir_code = getSelectTreeNodeId("roletree");
                var dir_name = getSelectTreeNodeName("roletree");
                $("#dirName").val(dir_name);
                $("#dirCode").val(dir_code);
                //表单验证
                validateRole({
                    rules:{
                        roleCode:{
                            required:true,
                            remote:{
                                type:"POST",  //请求方式
                                url: getServer()+"/sword/orgValidateRoleCode", //请求的服务
                                data:{  //要传递的参数
                                    role_code:function(){return $("#roleCode").val();}
                                }
                            }
                        }
                    },
                    messages: {
                        roleCode:{
                            remote:"角色编号已存在,请重新输入"
                        }
                    }
                });
            }
        });
    };
    //编辑角色
    var editRole = function(roleCode){
        $.ajax({
            //url:sysPath+"/org/data/Role.json",
            url:getServer()+"/sword/orgGetRole",
            data:{"role_code":roleCode},
            success:function(data){
                data = {Org:{Role:data}};
                showRoleSidebar({
                    afterLoad:function(){
                        $("#org_RoleName").html(data.Org.Role.roleName);
                        setNgModel("tab_Role",data);
                        //保存按钮绑定事件
                        saveOrgRoleBtnBind("update");
                        //编辑时，角色编号字段不可编辑
                        $("#roleCode").attr("readonly",true);
                        //表单验证
                        validateRole();
                    }
                });
            }
        });
    };

    var validateRole = function(extend){
        //数据验证
        $("#RoleForm").validate($.extend(true,{
            rules:{
                roleName:{required:true}
            },
            messages: {}
        },extend));
    };

    /**
     * 角色保存
     */
    var saveOrgRoleBtnBind = function(type){
        $("#saveOrgRoleBtn").bind("click",function(){
            if($("#RoleForm").valid()){
                var entity = getNgModel("tab_Role");
                //console.log(entity);
                $.ajax({
                    url:getServer()+"/sword/orgSaveRole?saveType="+type,
                    dataType:"json",
                    data:entity,
                    success:function(data){
                        //console.log(data);
                        if(data.status){
                            //刷新表格
                            grid.getGrid("OrgRoleList").refresh();
                        }
                        util.alert(data.message);
                    }
                })
            }
        })
    };

    /*****************岗位相关**************/
    //岗位导入
    var importGW = function(){
        var mapping = {
            "ServiceName":"orgImportGw",
            "EntityClassName":"com.css.sword.org.entity.OrgGw",
            "岗位名称":"gwName","岗位编号":"gwCode","显示序号":"sort"
        };
        importExcel({
            "title":"岗位导入",
            "templeteURL":sysPath+"/org/views/importGW.html",
            "mapping":mapping
        });
    };
    //新增岗位
    var addGW = function(){
        showGWSidebar({
            afterLoad:function(){
                //保存事件绑定
                saveOrgGWBtnBind();
                //表单验证
                validateGw({
                    rules:{
                        gwCode:{
                            required:true,
                            remote:{
                                type:"POST",                                        //请求方式
                                url: getServer()+"/sword/orgValidateGwCode",        //请求的服务
                                data:{                                              //要传递的参数
                                    gw_code:function(){return $("#gwCode").val();}
                                }
                            }
                        }
                    },
                    messages: {
                        gwCode:{
                            remote:"岗位编号已存在,请重新输入"
                        }
                    }
                });
            }
        });
    };
    //编辑岗位
    var editGW = function(GWCode){
        $.ajax({
            //url:sysPath+"/org/data/GW.json",
            url:getServer()+"/sword/orgGetGwById",
            dataType:"json",
            data:{"gw_code":GWCode},
            success:function(data){
                data = {Org:{GW:data}};
                showGWSidebar({
                    afterLoad:function(){
                        $("#org_GWName").html(data.Org.GW.gwName);
                        setNgModel("tab_GW",data);
                        //保存按钮绑定事件
                        saveOrgGWBtnBind();
                        //编辑时，角色编号字段不可编辑
                        $("#gwCode").attr("readonly",true);
                        //表单验证
                        validateGw();
                    }
                });
            }
        });
    };

    var validateGw = function(extend){
        //数据验证
        $("#GWForm").validate($.extend(true,{
            rules:{
                gwName:{required:true}
            },
            messages: {}
        },extend));
    };

    /**
     * 岗位保存
     */
    var saveOrgGWBtnBind = function(){
        $("#saveOrgGWBtn").bind("click",function(){
            if($("#GWForm").valid()){
                var entity = getNgModel("tab_GW");
                $.ajax({
                    url:getServer()+"/sword/orgSaveGW",
                    dataType:"json",
                    data:entity,
                    success:function(data){
                        if(data.status){
                            //刷新表格
                            grid.getGrid("OrgGWList").refresh();
                        }
                        util.alert(data.message);
                    }
                })
            }
        })
    };

    /*****************职务相关**************/
    //职务导入
    var importZW = function(){
        var mapping = {
            "ServiceName":"orgImportZw",
            "EntityClassName":"com.css.sword.org.entity.OrgZw",
            "职务名称":"zwName","职务编号":"zwCode","显示序号":"sort"
        };
        importExcel({
            "title":"职务导入",
            "templeteURL":sysPath+"/org/views/importZW.html",
            "mapping":mapping
        });
    };
    //新增职务
    var addZW = function(){
        showZWSidebar({
            afterLoad:function(){
                //保存事件绑定
                saveOrgZWBtnBind();
                //表单验证
                validateZw({
                    rules:{
                        zwCode:{
                            required:true,
                            remote:{
                                type:"POST",                                        //请求方式
                                url: getServer()+"/sword/orgValidateZwCode",        //请求的服务
                                data:{                                              //要传递的参数
                                    zw_code:function(){return $("#zwCode").val();}
                                }
                            }
                        }
                    },
                    messages: {
                        zwCode:{
                            remote:"职务编号已存在,请重新输入"
                        }
                    }
                });
            }
        });
    };
    //编辑职务
    var editZW = function(zwCode){
        $.ajax({
            //url:sysPath+"/org/data/ZW.json",
            url:getServer()+"/sword/orgGetZwById",
            dataType:"json",
            data:{"zw_code":zwCode},
            success:function(data){
                data = {Org:{ZW:data}};
                showZWSidebar({
                    afterLoad:function(){
                        $("#org_ZWName").html(data.Org.ZW.zwName);
                        setNgModel("tab_ZW",data);
                        //保存按钮绑定事件
                        saveOrgZWBtnBind();
                        //编辑时，角色编号字段不可编辑
                        $("#zwCode").attr("readonly",true);
                        //表单验证
                        validateZw();
                    }
                });
            }
        });
    };

    var validateZw = function(extend){
        //数据验证
        $("#ZWForm").validate($.extend(true,{
            rules:{
                zwName:{required:true}
            },
            messages: {}
        },extend));
    };

    /**
     * 职务保存
     */
    var saveOrgZWBtnBind = function(){
        $("#saveOrgZWBtn").bind("click",function(){
            if($("#ZWForm").valid()){
                var entity = getNgModel("tab_ZW");
                $.ajax({
                    url:getServer()+"/sword/orgSaveZW",
                    dataType:"json",
                    data:entity,
                    success:function(data){
                        if(data.status){
                            //刷新表格
                            grid.getGrid("OrgZWList").refresh();
                        }
                        util.alert(data.message);
                    }
                })
            }
        })
    };


    /**
     * Excel导入前端公共接口
     * @param param
     */
    var importExcel = function(param){
        require(["UtilDir/dialog",
                "WebUploader",
                "text!"+param.templeteURL,
                "css!WebUploaderCss"
            ],
            function(Dialog,WebUploader,body){
                var dialog = Dialog({
                    id:"system_importExcelDialog",
                    title:param.title,
                    cache:false,
                    body:body
                });
                //附件上传控件初始化
                var uploader = WebUploader.create({
                    swf:getStaticPath()+'/modules/webuploader/Uploader.swf',
                    server: getServer()+"/sword/"+param.mapping.ServiceName,
                    accept:{
                        title:"excel",
                        //extensions: 'xsl,xslx',
                        mimeTypes:["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].join(",")
                    },
                    pick:{
                        id:'#ImportExcelPanel',
                        multiple:false
                    }
                });
                //设置上传按钮
                dialog.setFoot([{name:"开始上传",callback:function(){
                    uploader.upload();
                }}]);
                //设置样式，必须uploader初始化后才能设置
                var panel = $("#ImportExcelPanel");
                panel.children(":first").css({
                    "width": "100px",
                    "height": "25px",
                    "padding": "3px"
                });
                panel.children(":last").css({"background": "#00b7ee"});
                panel.find("label").hover(function() {
                    panel.children(":last").css({"background": "#00b7ee"});
                }, function() {
                    panel.children(":last").css({"background": "#00a2d4"});
                });
                //把附件增加到待上传列表中
                uploader.on( 'fileQueued', function(file) {
                    $("#importExcelInfo").show();
                    $("#importExcelFileName").html(file.name);
                });
                //附件上传数据发送之前触发
                uploader.on( 'uploadBeforeSend', function(object,data,headers) {
                    data["formData"] = JSON.stringify(param.mapping);
                    data["SwordControllerName"] = "ExcelImportController";
                    $("#importExcelStatus").html("开始导入，请耐心等待...");
                });
                //附件上传成功后触发
                uploader.on( 'uploadSuccess', function( file,res ) {
                    //console.log(res);
                    var response = JSON.parse(res);
                    $("#importExcelStatus").html(response.status=="success"?"导入成功,共"+response.count+"条":"导入失败");
                    //错误信息
                    var errorInfo = response.excelTransformInfo?"<strong>Excel转换错误信息：</strong><br/>"+decodeURI(response.excelTransformInfo):"";
                    errorInfo+= response.importInfo?"<strong>导入错误信息：</strong><br/>"+decodeURI(response.importInfo):"";
                    $("#importExcelErrorInfo").html(errorInfo);
                });
            }
        );
    };

    /**
     * 设置指定面板中的数据
     * @param id
     * @param data
     */
    var setNgModel = function(id,data){
        //得到指定id面板中所有需要绑定的文本框对象
        $("#"+id+" input[type='text'][ng-model]").each(function(index){
            var arr = $(this).attr("ng-model").split(".");
            var temp=data;
            for(var i= 0,item;item=arr[i++];){
                temp = temp[item];
            }
            $(this).val(temp);
        });
    };
    /**
     * 获取数据
     * @param id
     */
    var getNgModel = function(id){
        var obj = {};
        $("#"+id+" input[type='text'][ng-model]").each(function(index){
            var arr = $(this).attr("ng-model").split(".");
            obj[arr[arr.length-1]] = $(this).val();
        });
        return obj;
    };

    /**
     * 主页初始化
     */
    var orgMainInit = function(){
        //默认显示组织导入、人员导入
        toolbarDisplay(["btn_importOrg","btn_importPerson"]);
        createDeptTree($("#orgtree"));
        createRoleTree($("#roletree"));
        createConfigTree($("#orgConfigTree"));
    };

    return {
        orgMainInit:orgMainInit
    }
});