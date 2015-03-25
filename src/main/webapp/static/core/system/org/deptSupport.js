/**
 * Created by YiYing on 2015/3/25.
 */
define(["UtilDir/util","OrgDir/util","UtilDir/grid"],function(Util,OrgUtil,Grid){

    //部门导入
    var importDept = function(){
        var mapping = {
            "ServiceName":"org/dept/importDept",
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
        OrgUtil.importExcel({
            "title":"组织导入",
            "templeteURL":OrgUtil.sysPath+"/org/views/importDept.html",
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
        var deptId = OrgUtil.getSelectTreeNodeId("orgtree");
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

    //弹出部门侧边栏
    var showDeptSidebar = function(param){
        Util.slidebar($.extend({
            url:getStaticPath()+"/core/system/org/views/orgDept.html",
            cache:false,
            close:true,
            width:"800px"
        },param));
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
                "value": getServer() +"/sword/org/dept/getAllDeptPage"
            }
        };
        Grid.init($.extend(config,comConfig));
    };

    return {
        importDept:importDept,
        editDept:editDept,
        addDept:addDept
    }
});