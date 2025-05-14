<template>
	<el-menu-item :index="index"
                  :route="route"
                  :disabled="disabled"
    ></el-menu-item>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({})
class rvueMenuItem extends Vue {
	public static install: (param: Vue) => any;
	public static compName = "rvue-Menu-item";
    @Prop({ type: String }) index!: string;
    @Prop({ type: Object }) route!: object;
    @Prop({ type: Boolean, default: false }) disabled!: boolean;
}
rvueMenuItem.install = function (Vue: any) {
	Vue.component(rvueMenuItem.compName, rvueMenuItem);
};

export default rvueMenuItem;
</script>