<template>
    <el-submenu :index="index"
                :popper-class="popperClass"
                :show-timeout="showTimeout"
                :hide-timeout="hideTimeout"
                :disabled="disabled"
    >
        <template :slot="slot"></template>
        <rvue-menu-item-group></rvue-menu-item-group>
    </el-submenu>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import rvueMenuItemGroup from "./rvueMenuItemGroup.vue";
@Component({
    components: {
			"rvue-menu-item-group": rvueMenuItemGroup,
		},
})
class rvueSubMenu extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-subMenu";
        @Prop({ type:String||null}) index!:string | null;
        @Prop({ type:String }) popperClass!:string;
        @Prop({ type:Number, default: 300 }) showTimeout!:number;
        @Prop({ type:Number, default: 300 }) hideTimeout!:number;
        @Prop({ type:Boolean, default: false }) disabled!:boolean;
        @Prop({ type:String }) slot!:string;
}

rvueSubMenu.install = function (Vue: any) {
		Vue.component(rvueSubMenu.compName, rvueSubMenu);
	};

	export default rvueSubMenu;
</script>