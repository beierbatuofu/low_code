<!--
 * @Author: ben
 * @LastEditTime: 2021-08-18 15:41:38
-->
<script>
	const props = {
		label: {
			type: String,
			default: "",
		},
		tip: {
			type: String,
			default: "",
		},
		required: {
			type: Boolean,
			default: false,
		},
		inline: {
			type: Boolean,
			default: false,
		},
	};

	const methods = {
		createEl(h) {
			let VNodes = [];
			let slots = this.$slots;
			let tipVNode = h("rvue-tip", {
				props: { content: this.tip },
				style: { marginLeft: "2px" },
			});

			if (slots.hasOwnProperty("custom")) return [slots["custom"]];
			Object.keys(slots).forEach((key) => VNodes.push(slots[key]));
			return [this.label, tipVNode, ...VNodes];
		},
	};

	export default {
		props,
		methods,
		render(h) {
			let strClass = this.required ? "widget-config-label widget-config-required" : "widget-config-label";
			let strStyle = this.inline
				? {
						display: "inline-block",
						"margin-right": "10px",
				  }
				: {};

			return h("div", { class: strClass, style: strStyle }, this.createEl(h));
		},
	};
</script>
<style lang="scss">
	.widget-config-label {
		display: inline-block;

		font-size: 14px;
		color: #606266;
	}
	.widget-config-required::before {
		content: "*";
		color: #f56c6c;
		margin-right: 4px;
	}
</style>
