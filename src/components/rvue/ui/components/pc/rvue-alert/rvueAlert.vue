<template>
	<el-alert :title="title" 
              :type="type" 
              :description="description" 
              :closable="closable" 
              :center="center" 
              :close-text="closeText" 
              :show-icon="showIcon" 
              :effect="effect"
              @close="handleClose"
    >
		<slot></slot>
	</el-alert>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
declare type TType= "success" | "warning" | "error"
declare type TEffect= "light" | "dark";

@Component({})
class RvueAlert extends Vue {
	public static install: (param: Vue) => any;
	public static compName = "rvue-alert";
    @Prop({type: String }) title!: string;
    @Prop({type: String, default: "info" }) type!: TType;
    @Prop({type: String }) description!: string;
    @Prop({type: Boolean, default: true }) closable!: boolean;
    @Prop({type: Boolean, default: true }) center!: boolean;
    @Prop({type: String }) closeText!: string;
    @Prop({type: Boolean, default: false }) showIcon!: boolean;
    @Prop({type: String, default: "light" }) effect!: TEffect;

    private handleClose(evt:any){
        this.$emit("close",evt)
    }
}
 RvueAlert.install = function (Vue: any) {
		Vue.component(RvueAlert.compName, RvueAlert);
	};
	export default RvueAlert;
</script>