<template>
	<div v-if="!parentType" class="widget-config-group" style="position: relative; z-index: 1">
		<rvue-label :label="t('global.textReminder')" :tip="t('widgetConfig.attrFieldTip')" />
		<div ref="tip-edit"></div>
	</div>
</template>
<script>
	import REditor from "./Editor";
	import { addImgHref } from "@/utils/global";
	import * as CONF from "./config";
	import { create } from "../../utils/create";

	const name = "AttrFieldTip";

	const KEY = "desc";

	export default create({
		name,
		mounted() {
			if (!this.parentType) {
				let editor = REditor(this.$refs["tip-edit"], CONF);
				this.data.hasOwnProperty(KEY) && editor.setHTML(this.data[KEY]);
				editor.onChange(() => {
					let sDesc = addImgHref(editor.getHTML());
					this.$set(this.data, KEY, sDesc);
				});
			}
		},
	});
</script>
