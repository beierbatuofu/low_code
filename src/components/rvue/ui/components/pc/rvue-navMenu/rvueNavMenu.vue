<template>
    <el-menu :default-active="defaultActive"
             :mode="mode" 
             :collapse="collapse"
             :background-color="backgroundColor"
             :text-color="textColor"
             :active-text-color="activeTextColor"
             :default-openeds="defaultOpeneds"
             :unique-opened="uniqueOpened"
             :menu-trigger="menuTrigger"
             :router="router"
             :collapse-transition="collapseTransition"
    >
        <rvue-sub-menu></rvue-sub-menu>
    </el-menu>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import rvueSubMenu from "./rvueSubMenu.vue";
declare type TMode= "horizontal" | "vertival";
declare type TTrigger= "hover" | "click";
@Component({
    components: {
			"rvue-sub-menu": rvueSubMenu,
		},
})
class rvueNavMenu extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-navMenu";
        @Prop({ type: String, default: "vertival"}) mode!:TMode;
        @Prop({ type: Boolean, default: false}) collapse!:boolean;
        @Prop({ type: String, default: "#ffffff"}) backgroundColor!:string;
        @Prop({ type: String, default: "#303133"}) textColor!:string;
        @Prop({ type: String, default: "#6087FD"}) activeTextColor!:string;
        @Prop({ type: String }) defaultActive!:string;
        @Prop({ type: String }) defaultOpeneds!:string;
        @Prop({ type: Boolean, default: false }) uniqueOpened!:boolean;
        @Prop({ type: String, default: "hover" }) menuTrigger!:TTrigger;
        @Prop({ type: Boolean, default: false }) router!:boolean;
        @Prop({ type: Boolean, default: true }) collapseTransition!:boolean;

        private handleSelect(index:any,indexPath:any){
            this.$emit("select",index,indexPath);
        }

        private handleOpen(index:any,indexPath:any){
            this.$emit("open",index,indexPath);
        }

        private handleClose(index:any,indexPath:any){
            this.$emit("close",index,indexPath);
        }

}
rvueNavMenu.install = function (Vue: any) {
		Vue.component(rvueNavMenu.compName, rvueNavMenu);
	};

	export default rvueNavMenu;
</script>