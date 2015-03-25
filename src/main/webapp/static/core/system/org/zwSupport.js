define(["UtilDir/util","UtilDir/grid","OrgDir/util"],function(Util,Grid,OrgUtil){
    /*****************职务相关**************/
    //职务导入
    var importZW = function(){
        var mapping = {
            "ServiceName":"org/zw/importZw",
            "EntityClassName":"com.css.sword.org.entity.OrgZw",
            "职务名称":"zwName","职务编号":"zwCode","显示序号":"sort"
        };
        OrgUtil.importExcel({
            "title":"职务导入",
            "templeteURL":OrgUtil.sysPath+"/org/views/importZW.html",
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
                                url: getServer()+"/sword/org/zw/validateZwCode",           //请求的服务
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
            url:getServer()+"/sword/org/zw/getZwById",
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
                var entity = OrgUtil.getNgModel("tab_ZW");
                $.ajax({
                    url:getServer()+"/sword/org/zw/saveZW",
                    dataType:"json",
                    data:entity,
                    success:function(data){
                        if(data.status){
                            //刷新表格
                            Grid.getGrid("OrgZWList").refresh();
                        }
                        Util.alert(data.message);
                    }
                })
            }
        })
    };

    //弹出职务侧边栏
    var showZWSidebar = function(param){
        Util.slidebar($.extend({
            url:getStaticPath()+"/core/system/org/views/orgZW.html",
            //id:"EditZWPanel",
            cache:false,
            close:true,
            width:"500px"
        },param));
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
                "value": getServer() + "/sword/org/zw/getAllZwPage"
            }
        };
        Grid.init($.extend(config,comConfig));
    };

    return {
        importZW:importZW,
        addZW:addZW
    }
});