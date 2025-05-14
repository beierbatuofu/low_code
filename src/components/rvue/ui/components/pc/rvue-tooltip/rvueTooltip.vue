<template>
    <el-tooltip :effect="effect"
                :content="content" 
                :placement="placement"
                :disabled="disabled"
                :offset="offset"
                :transition="transition"
                :visible-arrow="visibleArrow"
                :open-delay="openDelay"
                :manual="manual"
                :popper-class="popperClass"
                :enterable="enterable"
                :hide-after="hideAfter"
                :tabindex="tabindex"
                v-model="status"
    >
    <slot></slot>
    </el-tooltip>
</template>
<script lang="ts">
import { Component, Vue, Prop, Model } from "vue-property-decorator";
declare type TPlacement= "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" |  "left" | "left-start" | "left-end" | "right" | "right-start" | "right-end" 
declare type TEffect= "light" | "dark";

@Component({})
class RvueTooltip extends Vue {
	public static install: (param: Vue) => any;
	public static compName = "rvue-tooltip";
    @Model("change", { type: Boolean, default: false }) value!: Boolean;
    @Prop({ type: String, default: "dark"}) effect!:TEffect;//默认提供的主题
    @Prop({ type: String }) content!:string;//显示的内容
    @Prop({ type: String, default: "bottom"}) placement!:TPlacement;//Tooltip 的出现位置
    @Prop({ type: Boolean, default: false}) disabled!:boolean;//Tooltip 是否可用
    @Prop({ type: Number, default: 0}) offset!:number;//出现位置的偏移量
    @Prop({ type: String, default: "el-fade-in-linear"}) transition!:string;//定义渐变动画
    @Prop({ type: Boolean, default: true}) visibleArrow!:boolean;//是否显示 Tooltip 箭头
    @Prop({ type: Number, default: 0}) openDelay!:number; //延迟出现，单位毫秒
    @Prop({ type: Boolean, default: false}) manual!:boolean;//手动控制模式
    @Prop({ type: String }) popperClass!:string;//为 Tooltip 的 popper 添加类名
    @Prop({ type: Boolean, default: true}) enterable!:boolean;//鼠标是否可进入到 tooltip 中
    @Prop({ type: Number, default: 350}) hideAfter!:number;//Tooltip 出现后自动隐藏延时，单位毫秒，为 0 则不会自动隐藏
    @Prop({ type: Number, default: 0}) tabindex!:number;//Tooltip 组件的 tabindex

    private get status(){
        return (<any>this).value;
    }
    private set status(n:boolean){
        this.$emit("change",n)
    }
}
RvueTooltip.install = function (Vue: any) {
		Vue.component(RvueTooltip.compName, RvueTooltip);
	};
	export default RvueTooltip;
</script>