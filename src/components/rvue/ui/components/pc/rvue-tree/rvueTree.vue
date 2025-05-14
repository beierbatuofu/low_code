<template>
	<el-tree
		ref="elTree"
		:allow-drop="allowDrop"
		:allow-drag="allowDrag"
		:draggable="draggable"
		:lazy="lazy"
		:icon-class="iconClass"
		:indent="indent"
		:accordion="accordion"
		:filter-node-method="filterNodeMethod"
		:current-node-key="currentNodeKey"
		:default-checked-keys="defaultCheckedKeys"
		:check-strictly="checkStrictly"
		:show-checkbox="showCheckbox"
		:default-expanded-keys="defaultExpandedKeys"
		:auto-expand-parent="autoExpandParent"
		:check-on-click-node="checkOnClickNode"
		:expand-on-click-node="expandOnClickNode"
		:default-expand-all="defaultExpandAll"
		:highlight-current="highlightCurrent"
		:render-content="renderContent"
		:load="load"
		:render-after-expand="renderAfterExpand"
		:data="data"
		:empty-text="emptyText"
		:node-key="nodeKey"
		:props="props"
		@node-click="nodeClick"
		@node-contextmenu="nodeContextmenu"
		@check-change="checkChange"
		@check="check"
		@current-change="currentChange"
		@node-expand="nodeExpand"
		@node-collapse="nodeCollapse"
		@node-drag-start="nodeDragStart"
		@node-drag-enter="nodeDragEnter"
		@node-drag-leave="nodeDragLeave"
		@node-drag-over="nodeDragOver"
		@node-drag-end="nodeDragEnd"
		@node-drop="nodeDrop"
	>
		<span slot-scope="{ node, data }">
			<slot :slot-scope="{ node, data }"></slot>
		</span>
	</el-tree>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop, Model } from "vue-property-decorator";
	import { VNode } from "vue";

	export interface TRvueRree extends Vue {
		filter: (para: any) => void;
		updateKeyChildren: (key: any, data: any) => void;
		getCheckedNodes: (leafOnly: boolean, includeHalfChecked: boolean) => any;
		setCheckedNodes: (nodes: any[]) => any;
		getCheckedKeys: (leafOnly: boolean) => any;
		setCheckedKeys: (keys: any[], leafOnly: boolean) => any;
		setChecked: (data: any, checked: boolean, deep: boolean) => any;
		getHalfCheckedNodes: () => any;
		getHalfCheckedKeys: () => any;
		getCurrentKey: () => any;
		getCurrentNode: () => any;
		setCurrentKey: (key: string) => void;
		setCurrentNode: (node: object) => void;
		getNode: (data: any) => any;
		remove: (data: any) => any;
		append: (data: object, parentNode: any) => void;
		insertBefore: (data: object, refNode: any) => void;
		insertAfter: (data: object, refNode: any) => void;
	}

	@Component({})
	class RvueTree extends Vue implements TRvueRree {
		public static install: (param: Vue) => any;
		public static compName = "rvue-tree";

		@Prop({ type: Array }) data!: any[];
		@Prop({ type: String }) emptyText!: string;
		@Prop({ type: String }) nodeKey!: string;
		@Prop({ type: Object }) props!: Object;
		@Prop({ type: Boolean, default: true }) renderAfterExpand!: Boolean;
		@Prop({ type: Function }) load!: () => void;
		@Prop({ type: Function }) renderContent!: () => void;
		@Prop({ type: Boolean, default: false }) highlightCurrent!: Boolean;
		@Prop({ type: Boolean, default: false }) defaultExpandAll!: Boolean;
		@Prop({ type: Boolean, default: true }) expandOnClickNode!: Boolean;
		@Prop({ type: Boolean, default: false }) checkOnClickNode!: Boolean;
		@Prop({ type: Boolean, default: true }) autoExpandParent!: Boolean;
		@Prop({ type: Array }) defaultExpandedKeys!: any[];
		@Prop({ type: Boolean, default: false }) showCheckbox!: Boolean;
		@Prop({ type: Boolean, default: false }) checkStrictly!: Boolean;
		@Prop({ type: Array }) defaultCheckedKeys!: any[];
		@Prop({ type: [String, Number] }) currentNodeKey!: string | number;
		@Prop({ type: Function }) filterNodeMethod!: (value: string, data: Object, node: Object) => void;
		@Prop({ type: Boolean, default: false }) accordion!: boolean;
		@Prop({ type: Number, default: 16 }) indent!: number;
		@Prop({ type: String }) iconClass!: string;
		@Prop({ type: Boolean, default: false }) lazy!: boolean;
		@Prop({ type: Boolean, default: false }) draggable!: boolean;
		@Prop({ type: Function }) allowDrag!: (node: VNode) => void;
		@Prop({ type: Function }) allowDrop!: (draggingNode: VNode, dropNode: VNode, type: string) => void;

		public filter(param: any) {
			return (<TRvueRree>this.$refs.elTree).filter(param);
		}

		public updateKeyChildren(key: string | number, data: any[] = []) {
			return (<TRvueRree>this.$refs.elTree).updateKeyChildren(key, data);
		}

		public getCheckedNodes(leafOnly: boolean, includeHalfChecked: boolean) {
			return (<TRvueRree>this.$refs.elTree).getCheckedNodes(leafOnly, includeHalfChecked);
		}

		public setCheckedNodes(nodes: any[]) {
			return (<TRvueRree>this.$refs.elTree).setCheckedNodes(nodes);
		}

		public getCheckedKeys(leafOnly: boolean) {
			return (<TRvueRree>this.$refs.elTree).getCheckedKeys(leafOnly);
		}

		public setCheckedKeys(keys: any[], leafOnly: boolean) {
			return (<TRvueRree>this.$refs.elTree).setCheckedKeys(keys, leafOnly);
		}

		public setChecked(data: any, checked: boolean, deep: boolean) {
			return (<TRvueRree>this.$refs.elTree).setChecked(data, checked, deep);
		}

		public getHalfCheckedNodes() {
			return (<TRvueRree>this.$refs.elTree).getHalfCheckedNodes();
		}

		public getHalfCheckedKeys() {
			return (<TRvueRree>this.$refs.elTree).getHalfCheckedKeys();
		}

		public getCurrentKey() {
			return (<TRvueRree>this.$refs.elTree).getCurrentKey();
		}

		public getCurrentNode() {
			return (<TRvueRree>this.$refs.elTree).getCurrentNode();
		}

		public setCurrentKey(key: string) {
			return (<TRvueRree>this.$refs.elTree).setCurrentKey(key);
		}

		public setCurrentNode(node: Object) {
			return (<TRvueRree>this.$refs.elTree).setCurrentNode(node);
		}

		public getNode(data: any) {
			return (<TRvueRree>this.$refs.elTree).getNode(data);
		}

		public remove(data: any) {
			return (<TRvueRree>this.$refs.elTree).remove(data);
		}

		public append(data: object, parentNode: any) {
			return (<TRvueRree>this.$refs.elTree).append(data, parentNode);
		}

		public insertBefore(data: object, refNode: any) {
			return (<TRvueRree>this.$refs.elTree).insertBefore(data, refNode);
		}

		public insertAfter(data: object, refNode: any) {
			return (<TRvueRree>this.$refs.elTree).insertAfter(data, refNode);
		}

		private nodeClick(...args: any[]) {
			this.$emit("node-click", ...args);
		}

		private nodeContextmenu(...args: any[]) {
			this.$emit("node-contextmenu", ...args);
		}

		private checkChange(...args: any[]) {
			this.$emit("check-change", ...args);
		}

		private check(...args: any[]) {
			this.$emit("check", ...args);
		}

		private currentChange(...args: any[]) {
			this.$emit("current-change", ...args);
		}

		private nodeExpand(...args: any[]) {
			this.$emit("node-expand", ...args);
		}

		private nodeCollapse(...args: any[]) {
			this.$emit("node-collapse", ...args);
		}

		private nodeDragStart(...args: any[]) {
			this.$emit("node-drag-start", ...args);
		}

		private nodeDragEnter(...args: any[]) {
			this.$emit("node-drag-enter", ...args);
		}

		private nodeDragLeave(...args: any[]) {
			this.$emit("node-drag-leave", ...args);
		}

		private nodeDragOver(...args: any[]) {
			this.$emit("node-drag-over", ...args);
		}

		private nodeDragEnd(...args: any[]) {
			this.$emit("node-drag-end", ...args);
		}

		private nodeDrop(...args: any[]) {
			this.$emit("node-drop", ...args);
		}
	}
	RvueTree.install = function (Vue: any) {
		Vue.component(RvueTree.compName, RvueTree);
	};
	export default RvueTree;
</script>
<style lang="scss"></style>
