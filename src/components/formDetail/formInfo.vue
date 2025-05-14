<template>
	<div class="form-info-wrap">
		<div class="form-info" :style="{ right: conf.formType == 'F' ? '0' : '-30px' }">
			<div class="group flotL">
				 <div class="left"> <!--v-if="flowInfo.creatorAvatar" -->
					<rvue-avatar class="pic" :src="flowInfo.creatorAvatar ? flowInfo.creatorAvatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"> </rvue-avatar>
				</div>
				<div class="right" v-if="flowInfo.creatorName">
					<p>{{ $t("tableDesign.propuser") }}</p>
					<p>{{ flowInfo.creatorName }}</p>
				</div>
			</div>
			<div class="group flotR" v-if="flowInfo.createTime">
				<div class="left">
					<img class="pic" :src="`${publicPath}img/status_icon/time.svg`" />
				</div>
				<div class="right">
					<p>{{ $t("tableDesign.submitDate") }}</p>
					<p>{{ flowInfo.createTime }}</p>
				</div>
			</div>
			<div class="group" v-if="conf.formType == 'F'">
				<div class="left">
					<span class="pic" style="border-radius: 50%; background-color: #6087fd">
						<img style="width: 22px; height: 22px; margin: 7px" :src="`${publicPath}img/status_icon/share.svg`" />
					</span>
				</div>
				<div class="right">
					<p>{{ $t("tableDesign.status") }}</p>

					<p>{{ $t(`tableDesign.status_${flowInfo.processStatus}`) }}</p>
				</div>
			</div>
			<div class="group" v-if="conf.formType == 'F'">
				<div class="left">
					<img style="border-radius: 50%; background-color: #f0aa00" class="pic" :src="`${publicPath}img/status_icon/tag.svg`" />
				</div>
				<div class="right">
					<p>{{ $t("tableDesign.currentNode") }}</p>
					<p>{{ getNodeName(flowInfo.currentNodeStructure) }}</p>
				</div>
			</div>

			<div class="group" v-if="conf.formType == 'C'">
				<div class="left">
					<img class="pic" :src="`${publicPath}img/status_icon/time.svg`" />
				</div>
				<div class="right">
					<p>{{ $t("tableDesign.update_time") }}</p>
					<p>{{ conf.formData.update_time }}</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Inject } from "vue-property-decorator";

	@Component
	export default class FormInfo extends Vue {
		@Prop({ type: Object, default: () => ({}) }) flowInfo!: TJson;

		@Inject() readonly conf!: TJson;

		private getNodeName(strNode: string) {
			try {
				let node = JSON.parse(strNode);
				let lang = localStorage.getItem("lang") || "zh";
				return node.title[lang];
			} catch (err) {
				return "";
			}
		}
	}
</script>
<style lang="scss" scoped>
	.form-info-wrap {
		@include PositionRelative(100%, 20px);
	}
	.form-info {
		// display: grid;
		// grid-template-columns: repeat(auto-fill, 33%);
		// grid-row-gap: 10px;
		// grid-column-gap: 10px;
		// padding: 5px 0;
		display: flex;
		// @include PositionAbsoulte(0px, null, null, -30px);
		box-shadow: 0 2px 8px -2px rgb(0 0 0 / 20%);
	}
	.group {
		width: 100%;
		height: 70px;
		background: #fff;
		margin-left: 10px;
	}
	@media screen and (max-width: 768px) {
		.flotL {
			float: left;
		}
		// .flotR{
		// 	float:right;
		// }
		.group {
			display: inline-block;
			width: 45%;
			height: 70px;
			background: #fff;
			margin-left: 12px;
		}
		.form-info-wrap {
			//height: 150px;
			position: relative;
			z-index: 1000;
		}
		.form-info {
			display: block;
			background: #fff;
			@include PositionAbsoulte(0px, null, null, 0px);
		}
		.left {
			@include PositionRelative(70px, 70px);
		}
	}
	.left {
		float: left;
		@include PositionRelative(50px, 70px);
		.pic {
			width: 36px;
			height: 36px;
			@include PositionAbsoulte(50%, null, null, 50%);
			transform: translate(-50%, -50%);
		}
	}
	.right {
		@include JustityAndFlexWrap(flex, center, null, null);
		flex-direction: column;
		height: 70px;
		p {
			display: block;
			padding: 2px 3px;
			&:first-child {
				font-size: 12px;
				color: #b7bbc6;
			}

			& + p {
				font-size: 13px;
				color: #010101;
			}
			// width: 100%;
		}
	}
</style>
