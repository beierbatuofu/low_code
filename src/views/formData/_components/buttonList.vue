<template>
	<div class="button-list">
		<el-button
			:type="btn.type == 'delete' ? 'danger' : 'primary'"
			size="mini"
			:id="btn.type"
			v-for="(btn, index) in btnList"
			:key="index"
			:icon="btn.type == 'add' ? 'el-icon-plus' : ''"
			@click="allBtnList(btn.type)"
		>
			{{ $t(`global.${btn.type}`) }}
		</el-button>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop, Model, Inject } from "vue-property-decorator";
	@Component
	export default class ButtonList extends Vue {
		@Prop({ type: Array, default: () => [] }) btnList!: TJson[];

		private allBtnList(val: any) {
			// console.log(val + "按钮");
			if (val == "add") {
				this.$emit("add");
				let tenantId = this.$route.params.tenantId;
				let appCode = this.$route.params.appCode;
				let formCode = this.$route.params.id;
				// console.log(tenantId, appCode, formCode);
			}
			if (val == "delete") {
				this.$emit("delete");
			}
			if (val == "deleteAll") {
				this.$emit("deleteAll");
			}
      if(val == "imports"){
        this.$emit("imports");
      }
		}
	}
</script>
<style lang="scss" scoped>
	.button-list {
		// margin-bottom: 16px;
		margin: 0 5px;
		padding: 10px 10px 5px;
		@include GlobalAvatar(null, null, 2px, #fff);
		vertical-align: top;
		button {
			margin-bottom: 5px;
		}
	}

	#delete {
		color: #fff !important;
		background-color: #f56c6c !important;
		border-color: #f56c6c !important;
	}
	#delete:hover {
		background: #f78989 !important;
		border-color: #f78989 !important;
		color: #fff !important;
	}
</style>
