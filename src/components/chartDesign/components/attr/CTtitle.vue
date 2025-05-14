<template>
	<div class="ct-container">
		<rvue-label class="bold" :label="$t('global.title')" />
		<RvueLangInput class="el-form-item input" :field="data.title" @change="handleChange" />
	</div>
</template>
//
<script>
	// 	import { create } from "../utils/create";

	// 	const name = "AttrTitle";

	// 	export default create({
	// 		name,
	// 		data() {
	// 			return {
	// 				maxLength: "100%",
	// 				titleShow: this.data.titleShow,
	// 			};
	// 		},
	// 		methods: {
	// 			checkTitleShow() {
	// 				this.$set(this.data, "titleShow", this.titleShow);
	// 			},
	// 			handleChange(form) {
	// 				this.data.title = this.$utils.deepClone(form);
	// 			},
	// 		},
	// 	});
	//
</script>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";
	@Component({
		components: {},
	})
	export default class CTtitle extends BaseAttr {
		private handleChange(title: object) {
			this.data.title = (<any>this).$utils.deepClone(title);
		}
	}
</script>
<style lang="scss" scoped>
	.checkBOx {
		padding: 8px 0;
	}
	.widget-config-label {
		margin-bottom: 8px;
		font-weight: 600;
		font-size: 14px;
		color: #565d2d;
	}
	.input {
		width: 225px;
		height: 36px;
		border-radius: 2px;
		::v-deep.el-input__inner {
			border-radius: 2px;
			border: 1px solid #dcdfe6;
		}
	}
</style>
