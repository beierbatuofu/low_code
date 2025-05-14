<template>
    <el-link :type="type" :underline="underline" :disabled="disabled" :href="href" :icon="icon">
        <slot></slot>
    </el-link>
</template>
<script lang="ts">
    import { Vue, Component, Prop} from "vue-property-decorator";
    declare type TType="primary"| "success" | "warning" | "danger" | "info";

    @Component({})
    class RvueLink extends Vue{
        public static install: (param: Vue) => any;
		public static compName = "rvue-link";
        @Prop({ type: String, default:"default"}) type!:TType;
        @Prop({ type: Boolean, default: true }) underline!: boolean;
        @Prop({ type: Boolean, default: false }) disabled!: boolean;
        @Prop({ type: String }) href!: string;
        @Prop({ type: String }) icon!: string;
    }
    RvueLink.install = function (Vue: any) {
		Vue.component(RvueLink.compName, RvueLink);
	};
	export default RvueLink;
</script>