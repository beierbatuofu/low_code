<template>
	<div class="avue-dept">
		<rvue-select v-model="presentText" :placeholder="t('global.pleaseChoose')" :disabled="disabled" :display="display" @focus="dialogVisible = true"> </rvue-select>
		<RvueDepartmentMembers :defaultTags.sync="tags" :dialogVisible.sync="dialogVisible" @closeDialog="bindGetTags" :hide="hide" />
	</div>
</template>
<script>
	import lang from "../core/lang";
	export default {
		mixins: [lang],
		name: "RvueDept",
		props: ["value", "hide", "label", "display", "disabled", "required", "item"],
		data() {
			return {
				tags: [],
				dialogVisible: false,
				text: "",
			};
		},
		watch: {
			value: {
				handler(val) {
					this.text = val;
				},
				deep: true,
				immediate: true,
			},
			text: {
				handler(val) {
					this.$emit("input", val);
				},
				deep: true,
			},
		},
		computed: {
			presentText() {
				// let arr = JSON.parse(this.text || "[]");
				let arr = this.text;
				if (!arr) return "";
				arr = Array.isArray(arr) ? arr : JSON.parse(arr);
				let temp = [];
				arr.forEach((item) => {
					temp.push(item.name);
				});
				return String(temp);
			},
		},
		methods: {
			bindGetTags(tags) {
				let assigneeList = [];
				if (tags !== null) {
					this.tags = tags;
				}
				this.dialogVisible = false;
				this.tags.forEach((item) => {
					let { type, dtUserId, name, id } = item;
					assigneeList.push({
						type,
						dtUserId,
						name,
						id,
					});
				});
				this.text = JSON.stringify(assigneeList);
			},
		},
	};
</script>
<style lang="scss"></style>
