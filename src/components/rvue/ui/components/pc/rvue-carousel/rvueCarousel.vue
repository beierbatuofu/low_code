<template>
    <el-carousel ref="elCarousel"
                 :height="height"
                 :initial-index="initialIndex"
                 :trigger="trigger"
                 :autoplay="autoplay"
                 :interval="interval"
                 :indicator-position="indicatorPosition"
                 :arrow="arrow"
                 :type="type"
                 :loop="loop"
                 :direction="direction"
                 @change="handleChange"
    >
        <el-carousel-item :name="name"  :label="label">
            <slot></slot>
        </el-carousel-item>
    </el-carousel>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
declare type TTrigger = "click";
declare type TIndicatorPosition = "outside" | "none";
declare type TArrow = "always" | "hover" | "never";
declare type TType = "card";
declare type TDirection= "horizontal" | "vertical";

export interface TRvueCarousel extends Vue{
    setActiveItem:(index : number)=>any;
    prev:(index:number)=>any;
    next:(index:number)=>any;
}

@Component({})
class RvueCarousel extends Vue implements TRvueCarousel {
	public static install: (param: Vue) => any;
	public static compName = "rvue-carousel";
    @Prop({ type: String }) height!: string;
    @Prop({ type: Number, default: 0 }) initialIndex!: number;
    @Prop({ type: String }) trigger!: TTrigger;
    @Prop({ type: Boolean, default: true }) autoplay!: boolean;
    @Prop({ type: Number, default: 3000 }) interval!: number;
    @Prop({ type: String }) indicatorPosition!: TIndicatorPosition;
    @Prop({ type: String, default: "hover" }) arrow!: TArrow;
    @Prop({ type: String }) type!: TType;
    @Prop({ type: Boolean, default: true }) loop!: boolean;
    @Prop({ type: String, default: "horizontal" }) direction!: TDirection;

    @Prop({ type: String }) name!:string;
    @Prop({ type: String }) label!:string;

    public setActiveItem(index:number){
        return (<TRvueCarousel>this.$refs.elCarousel).setActiveItem(index);
    }
    public prev(index:number){
        return (<TRvueCarousel>this.$refs.elCarousel).setActiveItem(index-1);
    }
    public next(index:number){
        return (<TRvueCarousel>this.$refs.elCarousel).setActiveItem(index+1);
    }
    private handleChange(idx:number){
        this.$emit("change",idx);
    }
}
RvueCarousel.install = function (Vue: any) {
		Vue.component(RvueCarousel.compName, RvueCarousel);
	};
	export default RvueCarousel;
</script>