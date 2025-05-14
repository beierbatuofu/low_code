<template>
    <el-pagination :layout="layout"
                   :small="small"
                   :total="total"
                   :background="background"
                   :page-size="syncPageSize"
                   :page-count="pageCount"
                   :pager-count="pagerCount"
                   :current-page="currentPage"
                   :page-sizes="pageSizes"
                   :popper-class="popperClass"
                   :prev-text="prevText"
                   :next-text="nextText"
                   :disabled="disabled"
                   :hide-on-single-page="hideOnSinglePage"
                   @size-change="sizeChange"
                   @current-change="currentChange"
                   @prev-click="prevClick"
                   @next-click="nextClick"
    >
    </el-pagination>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
@Component({})
class RvuePagination extends Vue {
	public static install: (param: Vue) => any;
	public static compName = "rvue-pagination";
    @PropSync("pageSize", { type: String, default: 'prev, pager, next, jumper, total' }) syncPageSize!: string;
    @Prop({ type:Boolean, default: false}) small!:boolean;
    @Prop({ type:Boolean, default: false}) background!:boolean;
    @Prop({ type:Number, default: 10 }) pageSize!:number;
    @Prop({ type:Number }) total!:number;
    @Prop({ type:Number }) pageCount!:number;
    @Prop({ type:Number, default: 5}) pagerCount!:number;
    @Prop({ type:[Number], default: [5, 10, 20, 50]}) pageSizes!:[number];
    @Prop({ type:String }) popperClass!:string;
    @Prop({ type:String }) prevText!:string;
    @Prop({ type:String }) nextText!:string;
    @Prop({ type:Boolean, default: false }) disabled!:boolean;
    @Prop({ type:Boolean }) hideOnSinglePage!:boolean;

    private sizeChange(n:number){
        this.$emit("sizeChange",n)
    }

    private currentChange(n:number){
        this.$emit("currentChange",n)
    }

    private prevClick(n:number){
        this.$emit("prevClick",n)
    }

    private nextClick(n:number){
        this.$emit("nextClick",n)
    }

    
}
RvuePagination.install = function (Vue: any) {
	Vue.component(RvuePagination.compName, RvuePagination);
};
export default RvuePagination;
</script>