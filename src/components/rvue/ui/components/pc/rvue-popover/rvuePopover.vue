<template>
    <el-popover v-model="status"
                :trigger="trigger"
                :title="title"
                :content="content"
                :width="width"
                :placement="placement"
                :disabled="disabled"
                :offset="offset"
                :transition="transition"
                :visible-arrow="visibleArrow"
                :open-delay="openDelay"
                :close-delay="closeDelay"
                :tabindex="tabindex"
                @show="handleShow"
                @after-show="handleAfterEnter"
                @hide="hide"
                @after-leave="handleAfterLeave"
    >
        <slot></slot>
    </el-popover>
</template>
<script lang="ts">
import { Component, Vue, Prop, Model } from "vue-property-decorator";
declare type TPlacement= "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" |  "left" | "left-start" | "left-end" | "right" | "right-start" | "right-end" 
declare type TTrigger= "click" | "focus" | "hover" | "manual";

@Component({})
class RvuePopover extends Vue {
	public static install: (param: Vue) => any;
	public static compName = "rvue-popover";
    @Model("change",{type:Boolean,default: false}) value!:Boolean;

    @Prop({ type: String, default: "click" }) trigger!: TTrigger;
    @Prop({ type: String }) title!: string;
    @Prop({ type: String }) content!: string;
    @Prop({ type: [String, Number] }) width!: number | string;
    @Prop({ type: String, default: "bottom" }) placement!: TPlacement;
    @Prop({ type: Boolean, default: false }) disabled!:boolean;
    @Prop({ type: Number, default: 0 }) offset!: number;
    @Prop({ type: String, default: "fade-in-linear" }) transition!: string;
    @Prop({ type: Boolean, default: true }) visibleArrow!: boolean;
    @Prop({ type: Number }) openDelay!: Number;
    @Prop({ type: Number, default: 200 }) closeDelay!: Number;
    @Prop({ type: Number, default: 0 }) tabindex!: Number;

    private get status(){
        return (<any>this).value
    }

    private set status(n:boolean){
        this.$emit("status",n)
    }

    private handleShow(n:any){
        this.$emit("show",n)
    }
    private handleAfterEnter(n:any){
        this.$emit('afterEnter',n)
    }

    private handleAfterLeave(n:any){
        this.$emit("afterLeave",n)
    }

    private hide(n:any){
        this.$emit("hide",n)
    }
}
RvuePopover.install = function (Vue: any) {
		Vue.component(RvuePopover.compName, RvuePopover);
	};
	export default RvuePopover;
</script>