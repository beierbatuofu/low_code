<template>
	<div class="condition">
		<div class="line status"></div>
		<div class="condition-box" @click="handleSelect" v-bind="{ 'condition-id': item.id }">
			<slot name="cond" :data="item.data"></slot>
			<div class="condition-content">
				<h5 v-if="!flowConf.preview">分支条件</h5>
				<span class="el-icon-delete" v-if="!flowConf.readonly" @click="handleDel"></span>
			</div>
		</div>
		<div class="line bottom-line status">
			<node-menu :parentData="item" :branchData="branchData" :data="item.children" :item="item" v-if="!flowConf.readonly" @newNode="handelNewNode"></node-menu>
		</div>
	</div>
</template>
<script lang="ts">
	import { Component, Watch, Vue, Prop, Inject } from "vue-property-decorator";
	import menu from "../node/menu.vue";
	@Component({
		components: {
			"node-menu": menu,
		},
	})
	export default class Condition extends Vue {
		@Prop({ type: Object, default: () => ({}) }) item!: Record<string, any>;
		@Prop({ type: Array, default: () => [] }) data!: Record<string, any>[];
		@Prop({ type: Object, default: () => ({}) }) childItem!: Record<string, any>;
		@Prop({ type: Array, default: () => [] }) parentList!: Record<string, any>[];
		@Prop({ type: Object, default: () => ({}) }) branchData!: Record<string, any>;

		@Inject() flowConf!: TJson;

		private get matchRules() {
			return this.item.data?.matchRules || [];
		}

		private handleSelect($event: Event) {
			this.$emit("select", this.item);
			$event.stopPropagation();
		}

		private handelNewNode(conf: Record<string, any>) {
			this.$emit("newNode", conf);
		}

		private handleDel($event: Event) {
			this.$Rconfirm(`是否删除该条件?`, "", {
				distinguishCancelAndClose: true,
				confirmButtonText: "确定",
				cancelButtonText: "取消",
			})
				.then(() => {
					if (this.data.length > 2) {
						let id = this.item.id;
						let idx = this.data.findIndex((item: Record<string, any>) => item.id == id);
						idx > -1 && this.data.splice(idx, 1);
					} else {
						let id = this.childItem.id;
						console.log(this.parentList);

						let idx = this.parentList.findIndex((item: Record<string, any>) => item.id == id);
						this.parentList.splice(idx, 1);
					}
				})
				.catch(() => {});

			$event.stopPropagation();
		}

		private get label() {
			let lang = localStorage.getItem("lang") || "zh";
			try {
				return this.item.title[lang];
			} catch (err) {
				return "";
			}
		}
	}
</script>
<style lang="scss" scoped>
	.condition {
		position: relative;
		display: inline-flex;
		flex-direction: column;
		padding: 0px 30px 0;
		height: 100%;
		flex-grow: 1;

		&-box {
			width: 180px;
			border-radius: 4px;
			background: #fff;

			position: relative;
		}
		&-content {
			position: relative;
			user-select: none;
			h5 {
				padding: 8px 0px;
				font-size: 14px;
				text-align: center;
				flex: 1;
			}

			& > span {
				position: absolute;
				right: 5px;
				top: 50%;
				transform: translateY(-50%);
				&:last-child {
					color: #999;
					cursor: pointer;
					&:hover {
						color: #666;
					}
				}
			}
		}
	}
	.bottom-line {
		flex-grow: 1;
	}
</style>
