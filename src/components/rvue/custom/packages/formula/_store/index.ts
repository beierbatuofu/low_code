interface FormulaEditState {
    fieldList:any[];
    formula:string;
    defaultData:TJson;

}
export const lang = localStorage.getItem('lang') || 'zh';

//module namespace
export const namespace =  "modules/formualEdit"

// store type
export const SET_FIELDLIST = 'SET_FIELDLIST';
export const SET_FORMULA = 'SET_FORMULA';
export const SET_DEFAULTDATA = 'SET_DEFAULTDATA';

// store state
const state:FormulaEditState = {
    fieldList:[],
    formula:'',
    defaultData:{}

}

// store mutations
const mutations = {
    [SET_FIELDLIST](state:FormulaEditState,val:any){
            state.fieldList = val;
    },
    [SET_FORMULA](state:FormulaEditState,val:any){
        state.formula = val;
    },
    [SET_DEFAULTDATA](state:FormulaEditState,val:any){
        state.defaultData = val
    }
}

// store actions
const actions = {
    setFieldList({commit}:any,val:any){
         commit(SET_FIELDLIST,val);
    },
    setFormula({commit}:any,val:any){
         commit(SET_FORMULA,val);
    },
    setDefaultData({commit}:any,val:any){
         commit(SET_DEFAULTDATA,val);
    }
}

// 模块注册方法
export default {
        //注册module
        register(_this:any){
            if( _this.$store.state.hasOwnProperty(namespace)) return;
            _this.$store.registerModule(
                namespace,
                {
                    namespaced:true,
                    state,
                    mutations,
                    actions
                }
            )
        },
        //销毁module
        unregister(_this:any){
             _this.$store.unregisterModule(namespace)
        }

}



