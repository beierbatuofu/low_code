<template>
	<div class="widget-config-group el-form-item">
		<rvue-label :tip="t('widgetConfig.attrTitleTip')" :label="t('formDesign.tabTitle')" />
		<!--使用draggable组件-->
		<draggable v-model="data.children" handle=".move-tab" animation="300">
			<transition-group>
				<template v-for="(item, index) in data.children">
					<div :key="item.id" style="display: flex; align-items: center">
						<tab-name style="flex: 1" :title="item.title" @change="(t) => getNewTitle(t, index)"></tab-name>
						<div class="move-tab el-icon-s-operation"></div>
						<div class="el-icon-delete del-tab" @click="handleDelete(index)"></div>
					</div>
				</template>
			</transition-group>
		</draggable>

		<el-button @click="addHandler">{{ t("formDesign.addDic") }}</el-button>
	</div>
</template>

<script>
	import { create } from "../utils/create";
	import draggable from "vuedraggable";
	import TabName from "../components/tabName";
	import RfieldCore from "../../rfield/core/RfieldCore.ts";
	const name = "AttrTab";

	const methods = {
		getNewTitle(title, index) {
			//	this.$set(this.data.tab,index, title);
			this.data.children[index].title = title;
		},
		addHandler() {
			if (this.data.children.length >= 10) {
				return this.$Rmessage({
					type: "warning",
					message: "标签页最多创建十个",
				});
			}
			let setOption = RfieldCore.ins().fieldConsMap["tab"].fieldDef.setOption;
			this.data.children.push(setOption());
		},
		handleDelete(index) {
			if (this.data.children.length <= 2) {
				return this.$Rmessage({
					type: "warning",
					message: "标签页不能少于两个",
				});
			}
			this.data.children.splice(index, 1);
		},
	};

	export default create({
		name,
		methods,
		components: {
			draggable,
			"tab-name": TabName,
		},
	});
</script>

<style scoped lang="scss">
	.move-tab,
	.del-tab {
		padding: 5px;
	}

	.move-tab {
		cursor: move;
	}
</style>
