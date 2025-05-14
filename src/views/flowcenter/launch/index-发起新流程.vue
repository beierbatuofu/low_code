<template>
	<div class="flex-launch">
		<div class="group" v-for="(item, index) in list" :key="index">
			<div class="title">
				{{ item.appName }}
			</div>
			<div class="item" v-for="(child, i) in item.fromList" :key="i">
				<div class="name">{{ child.fromName }}</div>
				<div class="bottom" @click.stop="openDialog(child)">{{ $t("flow.startFlow") }}<i class="el-icon-arrow-right"></i></div>
			</div>
		</div>
		<rvue-dialog :title="dialogTitle" :visible.sync="dialogVisible" :destroy-on-close="true" width="80%">
			<div>
				<rvue-form-box :option="structure" ref="rvueForm" mode="review" />

				<div class="approve-box">
					<div class="t">{{ $t("flow.approvalComments") }}:</div>
					<el-input type="textarea" v-model="message"></el-input>
				</div>
				<div slot="footer" class="dialog-footer" style="text-align: center">
					<el-button size="mini" type="primary" @click.stop="bindSubmit">{{ $t("flow.submit") }}</el-button>
					<el-button size="mini" @click.stop="bindSave('save')">{{ $t("crud.saveBtn") }}</el-button>
				</div>
			</div>
		</rvue-dialog>
	</div>
</template>

<script lang="ts" src="./index.ts"></script>
<style lang="scss">
	@import "./_static/scss/index.scss";
</style>
