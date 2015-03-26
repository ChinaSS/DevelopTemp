/**
 * Created by YiYing on 2015/3/25.
 */
define(["UtilDir/util","UtilDir/grid","OrgDir/util"],function(Util,Grid,OrgUtil){
    /*****************************角色相关********************************/
    //角色导入
    var importRole = function(){
        var mapping = {
            "ServiceName":"org/role/importRole",
            "EntityClassName":"com.css.sword.org.entity.OrgRole",
            "角色编号":"roleCode","角色名称":"roleName","管理人员编号":"managerCode","管理人员名称":"managerName",
            "所属目录编号":"dirCode","所属目录名称":"dirName","序号":"sort"
        };
        OrgUtil.importExcel({
            "title":"角色导入",
            "templeteURL":OrgUtil.sysPath+"/org/views/importRole.html",
            "mapping":mapping
        });
    };
    //新增角色
    var addRole = function(){
        showRoleSidebar({
            afterLoad:function(){
                saveOrgRoleBtnBind("insert");
                var dir_code = OrgUtil.getSelectTreeNodeId("roletree");
                var dir_name = OrgUtil.getSelectTreeNodeName("roletree");
                $("#dirName").val(dir_name);
                $("#dirCode").val(dir_code);
                //表单验证
                validateRole({
                    rules:{
                        roleCode:{
                            required:true,
                            remote:{
                                type:"POST",  //请求方式
                                url: getServer()+"/sword/org/role/validateRoleCode", //请求的服务
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
            url:getServer()+"/sword/org/role/getRoleById",
            data:{"role_code":roleCode},
            success:function(data){
                data = {Org:{Role:data}};
                showRoleSidebar({
                    afterLoad:function(){
                        $("#org_RoleName").html(data.Org.Role.roleName);
                        OrgUtil.setNgModel("tab_Role",data);
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
    var saveOrgRoleBtnBind = function(){
        $("#saveOrgRoleBtn").bind("click",function(){
            if($("#RoleForm").valid()){
                var entity = OrgUtil.getNgModel("tab_Role");
                //console.log(entity);
                $.ajax({
                    url:getServer()+"/sword/org/role/saveRole",
                    dataType:"json",
                    data:entity,
                    success:function(data){
                        //console.log(data);
                        if(data.status){
                            //刷新表格
                            Grid.getGrid("OrgRoleList").refresh();
                        }
                        Util.alert(data.message);
                    }
                })
            }
        })
    };

    //弹出角色侧边栏
    var showRoleSidebar = function(param){
        Util.slidebar($.extend({
            url:getStaticPath()+"/core/system/org/views/orgRole.html",
            cache:false,
            close:true,
            width:"500px"
        },param));
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
                "value": getServer() + "/sword/org/role/"+(id?"getRoleByPidPage":"getAllRolePage")+"?dir_code="+id
            }
        };
        Grid.init($.extend(config,OrgUtil.gridDefaultConfig));
    };

    return {
        importRole:importRole,
        addRole:addRole,
        showRoleList:showRoleList
    }
});
