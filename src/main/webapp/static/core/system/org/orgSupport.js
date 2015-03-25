/**
 * Created by YiYing on 2015/1/14.
 */
define([
    "UtilDir/util",
    "OrgDir/deptSupport",
    "OrgDir/userSupport",
    "OrgDir/roleSupport",
    "OrgDir/roleDirSupport",
    "OrgDir/zwSupport",
    "OrgDir/gwSupport",
    "ZTree","css!ZTreeCss"],function(Util,Dept,User,Role,RoleDir,ZW,GW){
    /**
     * 创建部门树
     */
    var createDeptTree = function(element){
        $.ajax({
            //静态数据
            //"url":sysPath+"/org/data/OrgTree.json",
            //"url": getServer()+"/v1/org/dept",
            "url": getServer()+"/sword/org/dept/getAllDept",
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
            "url": getServer()+"/sword/org/roledir/getAllRoleDir",
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


    /******************************侧边栏**********************************/
    //弹出组织配置
    var showConfigSidebar = function(){
        Util.slidebar({
            url:getStaticPath()+"/core/system/org/views/orgConfig.html",
            close:true,
            width:"500px"
        });
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
    /******************************操作栏事件绑定**********************************/
    $("#btn_orgConfig").click(function(){ showConfigSidebar() });
    $("#btn_importOrg").click(function(){ Dept.importDept() });
    $("#btn_importPerson").click(function(){ User.importPerson() });
    $("#btn_importRoleDir").click(function(){ RoleDir.importRoleDir() });
    $("#btn_importRole").click(function(){ Role.importRole() });
    $("#btn_importGW").click(function(){ GW.importGW() });
    $("#btn_importZW").click(function(){ ZW.importZW() });
    $("#btn_editDept").click(function(){ Dept.editDept() });
    $("#btn_addDept").click(function(){ Dept.addDept() });
    $("#btn_addPerson").click(function(){ User.addPerson() });
    $("#btn_editRoleDir").click(function(){ RoleDir.editRoleDir() });
    $("#btn_addRoleDir").click(function(){ RoleDir.addRoleDir() });
    $("#btn_addRole").click(function(){ Role.addRole() });
    $("#btn_addGW").click(function(){ GW.addGW() });
    $("#btn_addZW").click(function(){ ZW.addZW() });




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