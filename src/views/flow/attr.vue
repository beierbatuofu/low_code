<template>
	<div class="flow-attr">
		<node-title class="attr-group" :nodeConf="nodeConf"></node-title>
		<template v-if="nodeConf.id !== 'start'">
			<node-dynameic :nodeConf="nodeConf" :isEdit="isEdit"></node-dynameic>
			<node-approver class="attr-group" :isEdit="isEdit" :nodeConf="nodeConf"></node-approver>
			<node-carbon-copy :isEdit="isEdit" :nodeConf="nodeConf"></node-carbon-copy>
			<rvue-tabs v-model="activeName" @tab-click="() => {}">
				<rvue-tab-pane :label="$t('flow.fieldPermissions')" name="field">
					<node-perm :nodeConf="nodeConf" @hook:mounted="watchMounted"></node-perm>
				</rvue-tab-pane>
				<rvue-tab-pane :label="$t('flow.btnsPermissions')" name="button"><node-btns-perm :nodeConf="nodeConf"></node-btns-perm></rvue-tab-pane>
			</rvue-tabs>
		</template>
	</div>
</template>
<script lang="ts">
	import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";
	import NodeTitle from "./_components/nodeTitle.vue";
	import NodeApprover from "./_components/nodeApprover.vue";
	import NodePerm from "./_components/nodePerm.vue";
	import dynameic from "./_components/dynamic.vue";
	import carbonCopy from "./_components/carbonCopy.vue";
	import btnsPerm from "./_components/btnsPerm.vue";

	@Component({
		components: {
			"node-title": NodeTitle,
			"node-approver": NodeApprover,
			"node-perm": NodePerm,
			"node-dynameic": dynameic,
			"node-carbon-copy": carbonCopy,
			"node-btns-perm": btnsPerm,
		},
	})
	export default class FlowAttr extends Vue {
		@Prop({ type: Array, default: () => [] }) data!: Record<string, any>[];
		@Prop({ type: Object, default: () => ({}) }) nodeConf!: Record<string, any>;
		@Prop({ type: Object, default: () => ({}) }) defineFlow!: Record<string, any>;
		@Inject() flowJSON!: Record<string, any>;

		private activeName: string = "field";

		private get isEdit() {
			return !!this.defineFlow.doStarted;
		}

		private get configList() {
			return this.flowJSON.configList;
		}

		private watchMounted() {
			console.log("mounted");
		}
	}
</script>
<style lang="scss" scoped>
	.attr-group {
		margin-bottom: 10px;
	}
	.flow-attr {
		padding: 0 15px;
		height: calc(100vh - 32px);
		overflow-y: auto;
	}
	::v-deep {
		.title {
			color: #666;
			padding: 5px 0;
			font-size: 14px;
			font-weight: bold;
			// &::before {
			// 	content: "";
			// 	display: inline-block;
			// 	width: px;
			// 	height: 16px;
			// 	background: $color;
			// 	vertical-align: middle;
			// 	margin-right: 3px;
			// }
		}
	}
</style>
