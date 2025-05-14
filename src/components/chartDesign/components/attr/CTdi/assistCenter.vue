<!--
 * @Author: ben
 * @LastEditTime: 2021-07-27 17:13:05
-->
<script lang="ts">
	import { Component, Watch, Vue, Prop, Model } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";
	import { FormulaList } from "./_core/config.ts";
	import NFormulaEdit from "./_types";

	@Component({})
	export default class AssistCenter extends Vue {
		@Model("change", { type: Object }) readonly formulaJson!: TJson;

		private formulaList = FormulaList;
		private actives = ["1"];

		private bindClick(item: NFormulaEdit.TFormulaOpts) {
			this.$emit("change", {
				...item,
				timestamp: new Date().getTime(),
			});
		}

		private createContainer(h: CreateElement) {
			let VNodes: VNode[] = [];
			this.formulaList.forEach((item: NFormulaEdit.TFormulaList) => {
				let { children } = item;
				let liVNodes: VNode[] = [];
				children.forEach((ite: NFormulaEdit.TFormulaOpts) => {
					let prop = {
						on: {
							click: this.bindClick.bind(this, ite),
						},
						class: "formula-key",
					};
					let VNode = h("li", prop, [ite.label]);
					liVNodes.push(VNode);
				});
				VNodes.push(
					h(
						"div",
						{
							class: "assist-center",
						},
						[
							h("rvue-input", {
								class: "search-box",
								props: {
									placeholder: "搜索函数",
								},
							}),

							h(
								"el-collapse",
								{
									class: "field-list",
									props: {
										value: this.actives,
									},
								},
								[
									h(
										"el-collapse-item",
										{
											props: {
												name: item.name,
												title: this.$t(`formula.${item.title}`),
											},
										},
										liVNodes
									),
								]
							),
						]
					)
				);
			});

			return VNodes;
		}

		protected render(h: CreateElement) {
			const children = this.createContainer(h);
			return h(
				"div",
				{
					class: "right",
				},
				children
			);
		}
	}
</script>
