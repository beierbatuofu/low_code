<template>
	<div class="widget-config-group" style="position: relative; z-index: 1">
		<rvue-label :label="$t('global.textDescription')" />
		<div ref="tip-edit"></div>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import REditor from "@/components/formDesign/attrs/attrdesc/Editor";
import { addImgHref } from "@/utils/global";
import * as CONF from "@/components/formDesign/attrs/attrdesc/config";
import { create } from "@/components/formDesign/utils/create";

const name = "AttrFieldTip";

const KEY: any = "reportConfig";

export default create({
	data() {
		return {
			html: "",
		};
	},
	name,
	mounted() {
		let editor = REditor(this.$refs["tip-edit"], CONF);
		if (this.data[KEY] != null) {
			this.data.hasOwnProperty(KEY) && editor.setHTML(this.data[KEY]["desc"]);
			editor.onChange(() => {
				let sDesc = addImgHref(editor.getHTML());

				let d: any = {};
				d["desc"] = sDesc;
				this.$set(this.data, KEY, d);
				
				// if (sDesc.length < 500) {
				// 	this.html = addImgHref(editor.getHTML());
				// 	let d: any = {};
				// 	d["desc"] = this.html;
				// 	this.$set(this.data, KEY, d);
				// } else {
				// 	//editor.clear();
				// 	editor.setHTML(this.html);
				// }
			});
		} else {
			this.data[KEY] = { desc: "" };
			editor.onChange(() => {
				let sDesc = addImgHref(editor.getHTML());
				this.$set(this.data, KEY["desc"], sDesc);
			});
		}
	},
});
</script>
