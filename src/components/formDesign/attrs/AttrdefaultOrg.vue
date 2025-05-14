<template>
	<div class="widget-config-group el-form-item">
		<rvue-label :label="t('global.defaultValue')" :tip="t('widgetConfig.attrDefaultValue')" />

		<rvue-select v-model="value" style="margin-bottom: 10px">
			<rvue-option :label="t('global.' + item)" :value="item" v-for="(item, index) in options" :key="index"></rvue-option>
			<!-- <el-option :label="t('global.associateExistingData')" value="关联已有数据"></el-option> -->
			<!-- <el-option label="通过公式计算" value="通过公式计算"></el-option> -->
		</rvue-select>
		<div class="tags" v-if="tags.length">
			<el-tag v-for="(item, index) in tags" :key="index" closable :disable-transitions="false" @close="handleClose(item)">
				{{ item.name }}
			</el-tag>
		</div>
		<el-button style="width: 100%" v-if="value === 'custom'" @click="orgVisible = true">{{ t("global.setting") }}</el-button>
		<el-button style="width: 100%" v-if="value === 'relation'" @click="visible = true">{{ t("formDesign.setFilterCriteria") }}</el-button>
		<!-- <el-button v-if="value === '通过公式计算'">{{t('global.byFormulaCalculation')}}</el-button> -->

		<RvueDepartmentMembers :defaultTags.sync="tags" :dialogVisible.sync="orgVisible" @closeDialog="bindGetTags" :parentComp="data.type" :hide="hide" :multiple="multiple" />

    <AttrLinkdataDialogs v-if="value == 'relation'" :parentObj="parentObj" :visible="visible" :data="data" :configList="configList" @close="visible = false" @ok="setRelation" />
	</div>
</template>
<script>
	import { create } from "../utils/create";
	import { setEnum } from "../utils/index";

	const name = "AttrDefaultOrg";
	const OPTS = ["custom"];
	const ENUM = setEnum(OPTS);
	const orgs = "defVal";

	const oSelect = {
		dept: ["custom",'relation'],
		user: ["custom",'relation'],
		userRadio: ["currentuser", "custom",'relation'],
		deptRadio: ["custom",'relation'],
	};

	const methods = {
		setRelation(relation) {
			this.data.rely.relation = relation;
			this.visible = false;
		},
		bindGetTags(tags) {
			this.tags = tags;
			this.$set(this.data, "defVal", tags);
		},
		handleClose(item) {
			let { id } = item;
			this.tags.splice(
				this.tags.findIndex((ite) => ite.id == id),
				1
			);
		},
	};

	const computed = {
		hide() {
			let type = this.data.type;
			if (type.indexOf("user") !== -1) return [0, 1];
			if (type.indexOf("dept") !== -1) return [1, 2];
			return -1;
		},
		options() {
			return oSelect[this.data.type];
		},
		multiple() {
			let type = this.data.type.toLocaleLowerCase();

			if (type.indexOf("radio") !== -1) return false;
			return true;
		},
		value: {
			get() {
				return this.data.rely?.type ||  "custom";
			},
			set(n) {
				this.data.defVal = [];
        this.data.rely.relation = {};
				this.data.rely.type = n;
			},
		},
	};

	export default create({
		name,
		methods,
		computed,
		data() {
			return {
				visible: false,
				orgVisible: false,
				tags: [],
			};
		},
    mounted() {
      	if (!this.data.rely.type) this.$set(this.data.rely, "type", "custom");
      // 数据联动未设置成功 ，在不选中该字段后，则恢复自定义选项
       if(Object.keys(this.data.rely.relation).length == 0) this.$set(this.data.rely, "type", "custom"); 
    },
		created() {
			let tags = this.data.defVal;
			tags && tags.length && (this.tags = tags);
		},
		watch: {
			data: {
				handler: function (n) {
					this.tags = typeof n.defVal == "string" ? [] : n.defVal;
				},
				deep: true,
			},
		},
	});
</script>
