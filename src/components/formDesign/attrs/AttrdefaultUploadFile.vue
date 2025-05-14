<template>
	<div class="widget-config-group el-form-item default-upload">
		<rvue-label :label="t('global.defaultValue')" :tip="t('widgetConfig.attrDefaultValue')" />
		<el-select v-model="valueOption" style="margin-bottom: 10px">
			<el-option :label="t('global.' + item)" :value="item" v-for="(item, index) in options" :key="index"></el-option>
		</el-select>
		<div class="tags" v-if="tags.length">
			<el-tag v-for="(item, index) in tags" :key="index" closable :disable-transitions="false" @close="handleClose(item)">
				{{ item.name }}
			</el-tag>
		</div>
		<!-- <el-button style="width:100%" v-if="value === 'custom'" @click="orgVisible = true">{{t('global.setting')}}</el-button> -->

		<Upload
			mode="default"
			:value="value"
			:action="action"
			:multiple="data.multiple"
			:limit="10"
			:headers="uploadData"
			:size="10"
			class="default-upload"
			:formCode="formCode"
			@change="changeValue"
		></Upload>

		<!-- <el-button v-if="value === 'relation'" @click="visible = true">{{t('global.setFilterCriteria')}}</el-button> -->

		<!-- <RvueDepartmentMembers
                :defaultTags.sync="tags"
                :dialogVisible.sync="orgVisible"
                @closeDialog="bindGetTags"
                :parentComp="data.type"
             
	    	/> -->
	</div>
</template>
<script>
	import { create } from "../utils/create";
	import { setEnum } from "../utils/index";
	import Upload from "@/components/rvue/custom/packages/upload/upload";

	const defaultLang = {
		zh: "自定义",
		en: "custom",
	};

	const name = "AttrUpload";

	const defaultRelation = () => ({
		zh: "自定义",
		en: "custom",
	});

	const OPTS = ["custom"];
	const ENUM = setEnum(OPTS);

	const watch = {
		tags: function (arr) {
			console.log(arr);
			this.$set(this.data, "defVal", arr);
		},
	};

	const methods = {
		setRelation(relation) {
			this.data.relation = relation;
			this.visible = false;
		},
		bindGetTags(tags, select) {
			this.tags = select;
		},
		handleClose(item) {
			let { id } = item;
			this.tags.splice(
				this.tags.findIndex((ite) => ite.id == id),
				1
			);
		},
		changeValue(e) {
			// if (this.$utils.isJsonString(tags)) {
			// 	tags.length && (this.tags = JSON.parse(tags));
			// } else {
			// 	tags.length && (this.tags = tags);
			// }
			//只允许上传单个
			if (this.data.multiple && this.data.defVal.length > 0) {
				this.$message({
					message: "只能上传1个文件",
					type: "success",
				});
				return;
			}
			this.data.defVal.push(e);
			this.tags = this.data.defVal;
		},
	};

	export default create({
		name,
		methods,
		watch,
		components: {
			Upload,
		},
		data() {
			return {
				options: OPTS,
				visible: false,
				valueOption: "custom",
				orgVisible: false,
				tags: [],
				action: "",
				uploadData: { token: window.localStorage.getItem("token") },
				formCode: this.$route.params.id,
			};
		},
		computed: {
			value: {
				get: function () {
					let aValue;
					if (this.$utils.isJsonString(this.data.defVal)) {
						aValue = JSON.parse(this.data.defVal);
					} else {
						aValue = this.data.defVal;
					}

					return aValue;
				},
				set: function (n) {
					console.log(n);
					this.data.defVal = n;
				},
			},
		},
		created() {
			let tags = this.data.defVal;
			if (this.$utils.isJsonString(tags)) {
				tags.length && (this.tags = JSON.parse(tags));
			} else {
				tags.length && (this.tags = tags);
			}
		},
	});
</script>
<style lang="scss">
	.default-upload {
		.el-upload,
		.upload-box .uploadBtn {
			width: 100% !important;
		}
	}
</style>
