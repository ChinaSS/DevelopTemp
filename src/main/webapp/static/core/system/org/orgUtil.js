/**
 * Created by YiYing on 2015/2/10.
 */
define(["UtilDir/psnSelect"], function(PsnSelect){
    var orgUrl = "",
        psnUrl = "";
    function loadData($elem,data){
        var code=[],text=[];
        for (var i = 0; i < data.length; i++) {
            code.push(data[i].code);
            text.push(data[i].text);
        }
        $elem.data("code",code.join(","));
        $elem.val(text.join(","));
    }

    function getData($elem){
        var code = $elem.data("code"),
            text = $elem.val(),
            dataArray=[];
        if (code&&text) {
            code = code.split(",");
            text = text.split(",");
            for (var i = 0; i < code.length; i++) {
                dataArray.push({
                    code : code[i],
                    text : text[i]
                });
            }
        }
        return dataArray;
    }

    function clearData($elem){
        $elem.val("");
        $elem.data("code","");
    }
    /**
     * 人员选择接口
     * @param param
     * @constructor
     */
    var CS_SelectPsn = function(param){
        var $psnInput = $("#"+param.id),
            callback = param.callback;
        $psnInput.data("code","");
        var _param = {
            id : "psnSelect_"+param.id,
            type : param.type,
            org : {
                url: orgUrl,
                data : param.orgData,
                tag : param.orgTag
            },
            psn : {
                url: psnUrl,
                data: param.psnCode
            },
            key : param.key,
            callback : function(data){
                loadData($psnInput,data);
                callback?callback(data):null;
            }
        };
        var psnSelect = PsnSelect(_param);
        $psnInput.on("click",function(){
            if (!psnSelect) {
                return false;
            }else{
                psnSelect.load([],getData($(this)));
            }
            psnSelect.show();
        });
    };

    /**
     * 部门选择接口
     * @param param
     * @constructor
     */
    var CS_SelectDept = function(param){

    };
    return {
        CS_SelectPsn : CS_SelectPsn,
        CS_SelectDept : CS_SelectDept
    }
});