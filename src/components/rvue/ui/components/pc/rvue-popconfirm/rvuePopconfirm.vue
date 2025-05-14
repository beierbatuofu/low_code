<template>
	<el-popconfirm :title="title"
                   :confirm-button-text="confirmButtonText"
                   :cancel-button-text="cancelButtonText"
                   :confirm-button-type="confirmButtonType"
                   :cancel-button-type="cancelButtonType"
                   :icon="icon"
                   :icon-color="iconColor"
                   :hide-color="hideColor"
                   @confirm="handleConfirm"
                   @cancel="handleCancel"
    >
		<slot></slot>
	</el-popconfirm>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({})
class RvuePopconfirm extends Vue {
	public static install: (param: Vue) => any;
	public static compName = "rvue-popover";
    @Prop({type: String }) title!:string;
    @Prop({type: String }) confirmButtonText!:string;
    @Prop({type: String }) cancelButtonText!:string;
    @Prop({type: String, default: "Primary" }) confirmButtonType!:string;
    @Prop({type: String, default: "Text" }) cancelButtonType!:string;
    @Prop({type: String, default: "el-icon-question" }) icon!:string;
    @Prop({type: String, default: "#f90" }) iconColor!:string;
    @Prop({type: Boolean, default: false }) hideColor!:boolean;

    private handleConfirm(evt:any){
        this.$emit("confirm",evt)
    }

    private handleCancel(evt:any){
        this.$emit("cancel",evt)
    }
}
RvuePopconfirm.install = function (Vue: any) {
	Vue.component(RvuePopconfirm.compName, RvuePopconfirm);
};
export default RvuePopconfirm;
</script>