<template>
	<div>
		<div v-for="(item, index) in data" :key="index" :class="{ [item.type]: item.id !== 'end' }">
			<template v-if="index == 0 && isBranch">
				<div class="branch-line lt"></div>
				<div class="branch-line lb"></div>
			</template>
			<template v-if="index == data.length - 1 && isBranch">
				<div class="branch-line rt"></div>
				<div class="branch-line rb"></div>
			</template>
			<template v-if="index > 0 && index < data.length - 1 && isBranch">
				<div class="branch-line top"></div>
				<div class="branch-line bottom"></div>
			</template>

			<flow-node :branchData="branchData" :parentData="childItem" v-if="item.type == 'node' && item.id != 'end'" :item="item" :data="data" @select="handleSelect" @newNode="handelNewNode">
				<template slot="node" slot-scope="scope">
					<slot name="node" :data="scope.data"></slot>
				</template>
			</flow-node>
			<flow-condition
				@newNode="handelNewNode"
				:branchData="branchData"
				v-if="item.type == 'condition'"
				@select="handleSelect"
				:parentData="childItem"
				:parentList="parentList"
				:childItem="childItem"
				:item="item"
				:data="data"
			>
				<template slot="cond" slot-scope="scope">
					<slot name="cond" :data="scope.data"></slot>
				</template>
			</flow-condition>
			<div class="flow-end" v-if="item.id == 'end'"><div>结束</div></div>

			<div v-if="item.type == 'branch' && item.children.length && !flowConf.readonly" class="branch-add" @click="handleAddCond(item.children)"><i class="el-icon-plus"></i></div>

			<flow-branch
				@select="handleSelect"
				@newNode="handelNewNode"
				v-if="item.children && item.children.length"
				:isBranch="item.type == 'branch'"
				:branchData="getBranchInfo(item)"
				:parentList="data"
				:childItem="item"
				:data="item.children"
				:class="item.type + '-group'"
			>
				<template slot="cond" slot-scope="scope">
					<slot name="cond" :data="scope.data"></slot>
				</template>
				<template slot="node" slot-scope="scope">
					<slot name="node" :data="scope.data"></slot>
				</template>
			</flow-branch>
			<div v-if="item.type == 'branch' && item.children.length" class="branch-bottom">
				<div class="line">
					<node-menu :branchData="branchData" :parentData="childItem" :data="data" :item="item" v-if="!flowConf.readonly" @newNode="handelNewNode"></node-menu>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Watch, Vue, Prop, Inject } from "vue-property-decorator";
	import node from "../node/node.vue";
	import condition from "../condition/condition.vue";
	import FlowCore from "../../_core/FlowCore";
	import menu from "../node/menu.vue";

	@Component({
		name: "flow-branch",
		components: {
			"flow-node": node,
			"flow-condition": condition,
			"node-menu": menu,
		},
	})
	export default class Branch extends Vue {
		@Prop({ type: Array, default: () => [] }) data!: Record<string, any>[];
		@Prop({ type: Boolean, default: false }) isBranch!: boolean;
		@Prop({ type: Object, default: () => {} }) parentData!: Record<string, any>;
		@Prop({ type: Object, default: () => ({}) }) childItem!: Record<string, any>;
		@Prop({ type: Array, default: () => [] }) parentList!: Record<string, any>[];
		@Prop({ type: Object, default: () => ({}) }) branchData!: Record<string, any>;

		@Inject() flowConf!: TJson;

		private getBranchInfo(node: Record<string, any>) {
			if (node.type == "branch") {
				return node;
			}
			return this.branchData;
		}

		private handelNewNode(conf: Record<string, any>) {
			this.$emit("newNode", conf);
		}

		private handleSelect(nodeConf: Record<string, any>) {
			this.$emit("select", nodeConf);
		}

		private handleAddCond(list: Record<string, any>[]) {
			let newChild: Record<string, any> = FlowCore.define.Branch.ins().newCondition();
			list.push(newChild);
		}
	}
</script>
<style lang="scss" scoped>
	.flow {
		&-end {
			display: inline-flex;
			font-weight: 500;
			user-select: none;

			& > div {
				height: 50px;
				width: 50px;
				background: #fff;
				border-radius: 25px;
				text-align: center;
				line-height: 50px;
			}
		}
	}
	.node {
		position: relative;
		padding: 0 30px 0;
		width: 100%;
		display: inline-flex;
	}
	.condition {
		z-index: 2;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		&-group {
			min-height: auto !important;
			padding: 0 !important;
		}
	}
	.branch {
		z-index: 2;
		position: relative;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;

		align-items: center;

		&-bottom {
			position: relative;
			max-width: 100vw;
			height: 120px;
		}
		&-add {
			width: 20px;
			height: 20px;
			border-radius: 10px;
			background: #4c81ff;
			box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
			position: absolute;
			z-index: 21;
			top: -10px;
			left: 50%;
			transform: translate(-50%, 0%);
			text-align: center;
			line-height: 20px;
			.el-icon-plus {
				color: #fff;
				cursor: pointer;
			}
		}
	}

	.branch-line {
		position: absolute;
		width: 50%;
		height: 1px;
		background: #919191;
	}

	.top {
		top: 0;
		width: 100%;
	}
	.bottom {
		bottom: 0;
		width: 100%;
	}
	.lt {
		top: 0px;
		right: 0px;
	}
	.rt {
		top: 0px;
		left: 0px;
	}

	.lb {
		bottom: 0px;
		right: 0;
	}
	.rb {
		bottom: 0px;
		left: 0;
	}

	.branch-group {
		display: flex;
		flex-direction: row;
		justify-content: center;
		position: relative;
	}
</style>
