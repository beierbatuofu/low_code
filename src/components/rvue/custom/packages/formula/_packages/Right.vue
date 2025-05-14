<!--
 * @Author: ben
 * @LastEditTime: 2022-05-07 10:15:11
-->
<script lang="ts">
	import { Component, Watch, Vue, Prop, Model } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";
	import { FormulaList } from "../_core/config.ts";

	@Component({})
	export default class Left extends Vue {
		@Model("change", { type: Object }) readonly formulaJson!: TJson;

		private formulaList = FormulaList;
		private actives = ["1"];

		private bindClick(item: NFormulaEdit.TFormulaOpts) {
			this.$emit("change", {
				...item,
				timestamp: new Date().getTime(),
			});
		}

		private handleMouseOver(item: NFormulaEdit.TFormulaOpts) {
			this.$emit("updateRule", item);
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
							mouseover: this.handleMouseOver.bind(this, ite),
						},
						class: "formula-key",
					};
					let VNode = h("li", prop, [ite.label]);
					liVNodes.push(VNode);
				});
				VNodes.push(
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
