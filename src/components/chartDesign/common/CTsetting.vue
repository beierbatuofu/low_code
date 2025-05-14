<!--
 * @Author: your name
 * @Date: 2021-12-01 14:01:32
 * @LastEditTime: 2022-06-24 17:59:06
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \risen\src\components\chartDesign\common\CTsetting.vue
-->
<template>
	<div class="container mover">
		<div class="show-text">
			<div style="display: flex">
				<div class="title">{{ item.title[lang] }}</div>
				<span class="delete">{{ item.isDelete ? "(已删除)" : "" }}</span>
			</div>
		</div>

		<div @click="clickHandler"><i class="el-icon-setting" style="padding: 20px"></i></div>
		<div @click="handleDelete"><i class="el-icon-delete"></i></div>
		<CTsettingDialog :mode="mode" :data="data" :visible.sync="visible" :item="item" />
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import BaseAttr from "../core/BaseAttr";
	import CTsettingDialog from "./CTsettingDialog.vue";
	@Component({
		components: { CTsettingDialog },
	})
	export default class CTdata extends BaseAttr {
		private visible: Boolean = false;
		@Prop({ type: Object, default: () => {} }) item!: any;
		@Prop({ type: String, default: "" }) mode!: string;
		private handleDelete() {
			//删除data里面的对应值
			this.data[this.mode].forEach((element: any, index: number) => {
				if (element.code == this.item.code) {
					this.data[this.mode].splice(index, 1);
					return true;
				}
			});
			document.removeEventListener;
		}

		private clickHandler() {
			this.visible = true;
		}
	}
</script>
<style lang="scss" scoped>
	@import "./_style/Ctsetting.scss";
</style>
