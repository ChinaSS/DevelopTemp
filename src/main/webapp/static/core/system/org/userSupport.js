/**
 * Created by YiYing on 2015/3/25.
 */
define(["UtilDir/util","OrgDir/util","UtilDir/grid"],function(Util,OrgUtil,Grid){

    //人员导入
    var importPerson = function(){
        var mapping = {
            "ServiceName":"org/user/importUser",
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
        OrgUtil.importExcel({
            "title":"人员导入",
            "templeteURL":OrgUtil.sysPath+"/org/views/importPerson.html",
            "mapping":mapping
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
            //url:getServer()+"/sword/org/user/getUserById",
            dataType:"json",
            data:{"user_code":userCode},
            success:function(data){

                showPersonSidebar({
                    afterLoad:function(){
                        $("#org_PersonName").html(data.Org.Person.PersonInfo.BaseInfo.userName);
                        $("#org_PersonDeptName").html(data.Org.Person.PersonInfo.DeptInfo.deptName);
                        OrgUtil.setNgModel("PersonBaseInfo",data);
                        //职务初始化
                        initZW(data.Org.Person.PersonInfo.BaseInfo.ZW);
                        //性别与是否冻结
                        $("input[type='radio'][name='sex'][value='"+data.Org.Person.PersonInfo.BaseInfo.sex+"']").attr("checked", "checked");
                        $("input[type='radio'][name='locked'][value='"+data.Org.Person.PersonInfo.BaseInfo.locked+"']").attr("checked", "checked");
                        OrgUtil.setNgModel("PersonExtendInfo",data);
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
            url:getServer()+"sword/org/zw/getAllZw",
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

    //弹出人员侧边栏
    var showPersonSidebar = function(param){
        Util.slidebar($.extend({
            url:getStaticPath()+"/core/system/org/views/orgPerson.html",
            cache:false,
            close:true,
            width:"800px"
        },param));
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
                "value": getServer() + "/sword/org/user/"+ (id?"getUserByDeptIdPage":"getAllUserPage") +"?dept_id="+id
            }
        };
        Grid.init($.extend(config,OrgUtil.gridDefaultConfig));
    };

    return {
        importPerson:importPerson,
        addPerson:addPerson,
        showPersonList:showPersonList
    }
});