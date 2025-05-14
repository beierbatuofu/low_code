import { VuexModule, Module, getModule, Mutation, Action } from "vuex-module-decorators";
import store from "@/store";

export interface DesignState {
    dimension:any;
    xIds:string[];
    yIds:string[];
}



@Module({ dynamic: true, store, name: "design" })
class Design extends VuexModule implements DesignState {
    public dimension = {}

    public xIds = [];
    public yIds = [];

    @Mutation
    public SET_DIMENSION(opts:any){
        this.dimension = opts;
    }

    @Mutation
    public SET_IDS(opts:any){
        this.xIds = opts.xids;
        this.yIds = opts.yids;
      
    }

}

export const DesignModule = getModule(Design);
