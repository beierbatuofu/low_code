<template>
    <el-transfer ref="elTransfer"
                 v-model="inputValue"
                 :data="data"
                 :filterable="filterable"
                 :filter-placeholder="filterPlaceholder"
                 :filter-method="filterMethod"
                 :target-order="targetOrder"
                 :titles="titles"
                 :button-texts="buttonTexts"
                 :render-content="renderContent"
                 :props="props"
                 :left-default-checked="leftDefaultChecked"
                 :right-default-checked="rightDefaultChecked"
                 @change="handleChange"
                 @left-check-change="handleLeftCheckChange"
                 @right-check-change="handleReftCheckChange"
    >
        <slot></slot>
    </el-transfer>
</template>
<script lang="ts">
import { Component, Vue, Prop, Model } from "vue-property-decorator";
declare type TTargetOrder = "original " | "push " | "unshift";

export interface TRvueTransfer extends Vue {
    clearQuery:(left:string|null,right:string|null)=>any;
}

@Component({})
class RvueTransfer extends Vue implements TRvueTransfer {
		public static install: (param: Vue) => any;
		public static compName = "rvue-transfer";
        @Prop({ type: Boolean, default: false }) filterable!: boolean;
        @Prop({ type: Array, default: [] }) data!: [];
        @Prop({ type: String, default: "请输入搜索内容" }) filterPlaceholder!: string;
        @Prop({ type: Function, default: ()=>{} }) filterMethod!: ()=>{};
        @Prop({ type: String, default: "original" }) targetOrder!: TTargetOrder;
        @Prop({ type: Array, default: ['列表 1', '列表 2'] }) titles!: [];
        @Prop({ type: Array, default: [] }) buttonTexts!: [];
        @Prop({ type: Function, default: ()=>{} }) renderContent!: ()=>{};
        @Prop({ type: Object }) props!: [];
        @Prop({ type: Array, default: [] }) leftDefaultChecked!: [];
        @Prop({ type: Array, default: [] }) rightDefaultChecked!: [];

        @Model("change",{type:Array})value!:[];

        public clearQuery(left:string|null,right:string|null){
            return (<TRvueTransfer>this.$refs.elTransfer).clearQuery(left,right)
        }

        private get inputValue() {
			return this.value;
		}

		private set inputValue(n) {
			this.$emit("change", n);
		}

        private handleChange(val:any){
            this.$emit("change",val);
        }

        private handleLeftCheckChange(evt:any){
            this.$emit("LeftCheckChange",evt)
        }

        private handleReftCheckChange(evt:any){
            this.$emit("ReftCheckChange",evt)
        }
}

RvueTransfer.install = function (Vue: any) {
		Vue.component(RvueTransfer.compName, RvueTransfer);
	};

	export default RvueTransfer;
</script>