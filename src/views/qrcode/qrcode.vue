<template>
	<div style="text-align: center; margin: 20% 0; font-size: 24px" v-loading="loading" element-loading-text="后台正在处理中，请稍后..."></div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop, Model, Provide } from "vue-property-decorator";
	import Logins from "@/core/Logins.ts";

	@Component({})
	export default class extends Vue {
		//获取临时token
		protected created() {
			localStorage.clear();
			console.log("guest");
			Logins.init(this, "guest");
		}
	}
</script>
