<template>
    <el-menu-item-group :title="title">
		<rvue-menu-item></rvue-menu-item>
	</el-menu-item-group>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import rvueMenuItem from "./rvueMenuItem.vue";
@Component({
	components: {
			"rvue-menu-item": rvueMenuItem,
		},
})
class rvueMenuItemGroup extends Vue {
	public static install: (param: Vue) => any;
	public static compName = "rvue-Menu-item-group";
    @Prop({ type: String}) title!: string; 
}
rvueMenuItemGroup.install = function (Vue: any) {
	Vue.component(rvueMenuItemGroup.compName, rvueMenuItemGroup);
};

export default rvueMenuItemGroup;
</script>