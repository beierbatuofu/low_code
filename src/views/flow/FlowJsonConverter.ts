/**
 * 前端树状流程json结构 => 后端平铺流程json结构
 */
export default class FlowJsonConverter {

    // json转换
    // {
    // 	"struct" : {
    // 	  "node_1639451205908_4411": [
    // 	    "node_1639450705889_65128"
    // 	  ],
    // 	  "branch_1639446697837_85493": [
    // 	    "condition_1639451197884_62617",
    // 	    "condition_1639451197884_19526"
    // 	  ],
    // 	  ...
    // 	},
    // 	"prop" : {
    // 	  "start": {
    // 	    "comp": "node",
    // 	    "data": {},
    // 	    "type": "node",
    // 	    "title": {
    // 	      "en": "",
    // 	      "zh": "开始节点"
    // 	    }
    // 	  },
    // 	  ...
    // 	}
    // }
    public static convert(input : Array<any>) : any {
        var ret : TJson = {
            "struct" : {},
            "prop" : {}
        };

        FlowJsonConverter.analyze(input, "", ret);

        return ret;
    } 

    private static analyze(children : Array<any>, parentNext : string, ret : TJson) {
        var next = "";
        for(var i = 0; i < children.length; i++) {
            let item = children[i];

            // 设置prop
            ret.prop[item.id] = {};
            ret.prop[item.id].title = item.title;
            ret.prop[item.id].data = item.data;
            // ret.prop[item.id].comp = item.comp;
            ret.prop[item.id].type = item.type;
            ret.prop[item.id].status = item.status;

            // 忽略end节点
            if(item.id == "end") {
                continue;
            }

            if(item.type == "branch") {
                // 设置struct
                ret.struct[item.id] = [];
                item.children.forEach((element : any) => {
                    ret.struct[item.id].push(element.id);
                });

                // 设置next
                if(i == (children.length - 1)) {
                    // 最后一个节点
                    next = parentNext;
                } else {
                    // 数组下一个元素
                    next = children[i + 1].id;
                }

            } else if(item.type == "condition") {
                // 设置struct
                if(item.children instanceof Array
                    && item.children.length > 0) {
                    ret.struct[item.id] = [item.children[0].id];
                } else {
                    ret.struct[item.id] = [parentNext];
                }

                // 设置next
                next = parentNext;
            } else if(item.type == "node") {
                // 设置struct
                if(i == (children.length - 1)) {
                    // 最后一个节点
                    ret.struct[item.id] = [parentNext];
                } else {
                    // 数组下一个元素
                    ret.struct[item.id] = [children[i + 1].id];
                }

                // 设置next
                // 无children，不需要
            }
            

            // 递归
            if(item.children instanceof Array
                && item.children.length > 0) {
                FlowJsonConverter.analyze(item.children, next, ret);
            }

        }

    } 
}