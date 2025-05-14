<template>
	<div :class="allReadonly ? 'upload-box upload-readonly' : 'upload-box'">
		<div v-if="!tableProp || isTableDetail">
			<el-upload
				v-if="!allReadonly"
				ref="comUpload"
				:accept="accept"
				:action="action"
				:multiple="!multiple"
				list-type="picture"
				:limit="limit"
				:data="data"
				:on-change="onChange"
				:headers="headers"
				:http-request="httpRequest"
				:auto-upload="true"
				:show-file-list="false"
			>
				<el-button size="small" type="primary" class="uploadBtn" :style="{ width: Number(width) - 25 + 'px' }" :class="tableProp ? 'uploadBtn-intable' : ''">
					<i class="el-icon-upload"></i>附件
				</el-button>

				<!-- <div slot="file" slot-scope="{ }">
				
			</div> -->
			</el-upload>

			<div v-if="mode == 'design'" class="notTableProp" :style="{ 'border-bottom': allReadonly ? '1px solid #dcdfe6' : 'none' }">
				<div v-for="(file, index) in forShowImgList" :key="index" class="flex show-file-list list-item" style="background: #f1f1f1">
					<div v-if="judgeImg(file)" class="el-upload-list__item-thumbnail thumbnail_" :class="tableProp ? 'thumbnail-intable' : ''">
						<img @click.stop="handlePicturePreview(file)" class="thumbnail" :src="file.url" alt="" />
					</div>

					<div v-else class="el-upload-list__item-thumbnail fileLogo" @click.stop="handleOption(file)">
						<template v-if="tableProp">
							<el-tooltip class="item" effect="dark" :content="file.name" placement="top-start">
								<el-popover placement="bottom" width="200" trigger="click">
									<div style="justify-content: center; display: flex">
										<i class="download-icon download" @click="downloadFile(file)"></i>
										<i v-if="!allReadonly" class="el-icon-delete fileRemove" @click="handleRemove(file)"></i>
									</div>
									<div slot="reference">..{{ suffix(file) }}</div>
								</el-popover>
							</el-tooltip>
						</template>
						<template v-else>
							<div>{{ suffix(file) }}</div>
						</template>
					</div>

					<div class="fileMessage">
						<el-tooltip class="item" effect="dark" :content="file.name" placement="top-start">
							<p class="fileNameBox">
								<span>{{ file.name }}</span>
							</p>
						</el-tooltip>

						<p>{{ formatFileSize(file.size) }}</p>
					</div>

					<i class="download-icon download" @click="downloadFile(file)"></i>
					<i v-if="!allReadonly" class="el-icon-delete fileRemove" @click="handleRemove(file)"></i>
				</div>
			</div>
			<rvue-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" @close="dialogClose">
				<img v-if="isImg" width="100%" :src="dialogImageUrl" class="dialogImg" />
				<div v-else>
					<p style="text-align: center">{{ $t("global.viewErr") }}</p>
				</div>
			</rvue-dialog>
		</div>

		<div v-else class="table">
			<el-dropdown placement="bottom" trigger="click">
				<div class="el-dropdown-link">
					<i class="el-icon-upload" v-if="!allReadonly"></i>

					<div v-if="forShowImgList.length == 0 && !allReadonly" style="line-height: 28px">请上传</div>

					<div class="table-upload-show" v-for="(item, index) in forShowImgList" :key="index" @click="preview">
						<el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
							<span v-if="!item.loading">{{ extName(item.name) }}</span>
						</el-tooltip>
					</div>
				</div>
				<el-dropdown-menu slot="dropdown" class="upload-box" :append-to-body="true">
					<el-upload
						v-if="!allReadonly"
						ref="comUpload"
						:accept="accept"
						:action="action"
						:multiple="!multiple"
						list-type="picture"
						:limit="limit"
						:data="data"
						:on-change="onChange"
						:headers="headers"
						:http-request="httpRequest"
						:auto-upload="true"
						:show-file-list="false"
						style="display: flex; justify-content: center; margin-top: 5px"
					>
						<el-button size="small" type="primary" :style="{ width: Number(width) + 'px' }"> <i class="el-icon-upload"></i>附件 </el-button>
					</el-upload>
					<div style="max-height: 150px; overflow: scroll" v-if="showImgList.length" :style="{ maxHeight: showImgList.length <= 2 ? '100px' : '150px' }">
						<div v-if="mode == 'design'" name="list" tag="div" style="padding: 0 5px; width: 220px">
							<div v-for="(file, index) in showImgList" :key="index" class="flex show-file-list list-item">
								<template v-if="!file.loading">
									<div v-if="judgeImg(file)" class="el-upload-list__item-thumbnail thumbnail_" :class="tableProp ? 'thumbnail-intable' : ''">
										<img @click.stop="handlePicturePreview(file)" class="thumbnail" :src="file.url" alt="" />
									</div>

									<div v-else class="el-upload-list__item-thumbnail fileLogo" @click.stop="handleOption(file)">
										<template v-if="tableProp">
											<el-tooltip class="item" effect="dark" :content="file.name" placement="top-start">
												<el-popover placement="bottom" width="200" trigger="click">
													<div style="justify-content: center; display: flex">
														<i class="download-icon download" @click="downloadFile(file)"></i>
														<i v-if="!allReadonly" class="el-icon-delete fileRemove" @click="handleRemove(file)"></i>
													</div>

													<div slot="reference">{{ suffix(file) }}</div>
												</el-popover>
											</el-tooltip>
										</template>
										<template v-else>
											<div>{{ suffix(file) }}</div>
										</template>
									</div>

									<div class="fileMessage">
										<el-tooltip class="item" effect="dark" :content="file.name" placement="top-start">
											<p class="fileNameBox">
												<span>{{ file.name }}</span>
											</p>
										</el-tooltip>

										<p>{{ formatFileSize(file.size) }}</p>
									</div>

									<i class="download-icon download" @click="downloadFile(file)"></i>
									<i v-if="!allReadonly" class="el-icon-delete fileRemove" @click="handleRemove(file)"></i>
								</template>
								<template v-else>
									<p style="text-align: center; width: 100%">
										<i class="el-icon-loading"></i>
									</p>
								</template>
							</div>
						</div>
					</div>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Model, Prop, Watch, Emit, PropSync } from "vue-property-decorator";
	import { RCall } from "@/utils/RCall";
	import { deteleObject } from "@/utils/global";
	import Xhrs from "./core.ts";
	import UpLoading from "./_components/uploading";

	@Component
	export default class ComUpload extends Vue {
		@Prop({ type: Object, default: () => {} }) private form!: {};
		@Prop({ type: String, default: "" }) private fieldId!: "";
		@Prop({ type: Object, default: {} }) private headers!: {};
		@Prop({ type: Boolean, default: false }) allReadonly!: boolean;
		@Prop({
			type: String,
			default: ".doc,.docx,.pdf,image/*,video/*,audio/*,.*,.zip,.rar,.xls,.xlsx,.ppt,.pptx,.txt,.rp,.xmind",
		})
		private accept!: false;
		@Prop({ type: String, default: "" }) private action!: "";
		@Prop({ type: String, default: "" }) private prop!: "";
		@Prop({ type: Boolean, default: false }) private multiple!: false;
		@Prop({ type: Boolean, default: true }) private bCanPreview!: true; //是否允许预览
		@Prop({ type: Number }) private limit!: 10;
		@Prop({ type: Number, default: 204800 }) private size!: 204800;
		@Prop({ type: String, default: "" }) private paramsData!: "";
		@Prop({ type: String, default: "" }) private objectName!: "";
		@PropSync("imgList", { type: [Array, String], default: () => [] }) showImgList!: any;
		@Prop({ type: String, default: "design" }) mode!: string; //是默认还是设计
		@Prop({ type: [Number, String] }) private width!: any;
		@Prop({ type: String, default: "" }) tableProp!: string;
		@Prop({ type: Number, default: 0 }) columnIndex!: number;
		@Prop({ type: Boolean, default: false }) isTableDetail!: boolean; //是否是表格展开
		@Prop({ type: Number, default: 0 }) timestamp!: number;
		@Prop({ type: Boolean, default: true }) closeForm!: boolean;

		private file: any = {};
		private data: Object = {};
		private dialogImageUrl: String = "";
		private dialogVisible: Boolean = false;
		private blobFile: Object = {};
		private isImg: Boolean = false; //是否是图片格式
		private isUpload = false;

		private maxSize = 30000000;

		private extName(fileName: string) {
			try {
				return fileName.split(".").pop() || fileName;
			} catch (error) {}
		}

		@Watch("paramsData")
		onChangeParamsData() {
			this.data = this.paramsData ? JSON.parse(this.paramsData) : {};
		}
		//只做展示的列表
		private get forShowImgList() {
			let list = [];

			return this.tableProp && !this.isTableDetail ? this.showImgList.slice(-4) : this.showImgList;
		}
		//操作的列表
		// private get showImgList() {
		// 	return this.value;
		// }
		// private set showImgList(n) {
		// 	this.$emit("changeValue", n);
		// }

		private get placement() {
			let tableEl: any = document.querySelector(`div[fieldId='${this.tableProp}']`);
			let winHeight = window.innerHeight;

			if (tableEl && tableEl.offsetTop > winHeight / 2) return "top";
			return "bottom";
		}

		mounted() {
			this.data = this.paramsData ? JSON.parse(this.paramsData) : {};
		}

		private xhrs: any[] = [];

		private httpRequest(e: any) {
			if (e.file.size >= this.maxSize) {
				return;
			}
			const loading = UpLoading({
				onClosed: () => Xhrs.ins().abort(),
				btnText: <string>this.$t("global.cancelUpload"), 
				message: <string>this.$t("global.uploading"),
			});
			//上传文件
			let url: string = `/codeZero/oss/get-upload-url/${this.$route.params.formCode}`;
			let timestamp = this.timestamp;
			RCall.newIns()
				.request({ url: url, method: "post" })
				.then(async (resp) => {
					let xhr: any = new XMLHttpRequest();
					Xhrs.ins().add({
						xhr,
						objectName: resp.data.objectName,
					});
					xhr.open("put", resp.data.url, true); // 第三个参数为async?，异步/同步
					xhr.setRequestHeader("Content-Type", "application/octet-stream");
					// xhr.overrideMimeType("application/octet-stream");
					xhr.send(this.blobFile);

					xhr.onreadystatechange = () => {
						if (xhr.readyState === 4) {
							if (xhr.status === 200) {
								let { uid } = e.file;
								this.showImgList.forEach((item: TJson) => {
									if (item.uid == uid) {
										item["objectName"] = resp.data.objectName;
									}
								});

								let params = this.showImgList.map((item: TJson) => ({ size: item.size, objectName: item.objectName, name: item.name }));

								// let nowTimeStamp: HTMLElement | null = document.getElementById("formTimeStamp")?.value || "";
								// if (Number(nowTimeStamp) !== timestamp) return;
								Xhrs.ins().del(resp.data.objectName);
								if (Xhrs.ins().getList().length == 0) {
									loading.close();
								}
								if (this.tableProp) {
									this.$set((<any>this).form[this.tableProp]["data"][this.columnIndex], this.prop, params);
								} else {
									this.$set(this.form, this.fieldId, params);
								}
							} else { 
								this.$Rmessage({
									type: "error",
									message: `${e.file.name}上传失败`,
								});
								this.showImgList = this.showImgList.filter((item: Record<string, any>) => item.objectName);
							}
						}
					};
				});
		}
		private handleRemove(file: any) {
			let curfile = this.showImgList.find((item: TJson) => item.objectName == file.objectName);

			(<any>this).$refs.comUpload.handleRemove(file);
			let delFileIndex = this.showImgList.findIndex((item: TJson) => item.objectName == curfile.objectName);
			this.showImgList.splice(delFileIndex, 1);
			console.log(curfile, "delfile");
			this.$emit("delfile", curfile);
			//	this.executeDelete(curfile);
			let params = this.showImgList.map((item: TJson) => ({ size: item.size, objectName: item.objectName, name: item.name }));

			if (this.tableProp) {
				this.$set((<any>this).form[this.tableProp]["data"][this.columnIndex], this.prop, params);
			} else {
				this.$set(this.form, this.prop, params);
			}
			this.$emit("change");
		}
		private handleOption(file: any) {
			if (this.tableProp) {
				//表格内点击弹出
				// this.downloadFile(file);
			} else {
				this.handlePicturePreview(file);
			}
		}

		private handlePicturePreview(file: any) {
			//禁止预览
			if (this.bCanPreview) {
				return;
			}
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
			let imgTypes: String = "bmp,jpg,png,tif,gif,pcx,tga,exif,fpx,svg,psd,cdr,pcd,dxf,ufo,eps,ai,raw,WMF,webp,avif";
			this.isImg = imgTypes.indexOf(this.suffix(file)) < 0 ? false : true;
		}
		private dialogClose() {
			this.dialogVisible = false;
			let zz: any = document.getElementsByClassName("v-modal")[0];
			zz.style.display = "none";
		}
		/**
		 * 下载文件
		 **/
		private downloadFile(file: Record<string, string>) {
			if (!file.objectName) return this.$Rmessage({ type: "warning", message: "该文件还在上传中，请稍后下载" });
			let url_: string = `/codeZero/oss/get-download-url/${this.$route.params.formCode}/${file.objectName}?fileName=${encodeURIComponent(file.name)}`;
			RCall.newIns()
				.request({ url: url_, method: "post" })
				.then((resp) => {
					//获取下载链接
					let downloadUrl: string = resp.data.url;

					//下载方法
					RCall.newIns().saveAs(downloadUrl, file.name);
				});
		}

		private onChange(event: any, file: any, fileList: any) {

			if(this.showImgList.length>=10){
				return this.$Rmessage({type:"warning",message:"已到达上传附件个数的最大限制10个"})
			}
			if (event.size >= this.maxSize) {
				return this.$Rmessage({ type: "warning", message: "最大只能上传30MB文件" });
			}
			
			this.blobFile = event.raw; //获取文件流
			this.file = file;

			if (this.multiple) {
				//仅允许上传单个文件
				this.showImgList = [
					{
						loading: true,
						...event,
					},
				];

				if (Array.isArray(this.file) && deteleObject([...this.showImgList, event]).length > 1) {
					// this.handleRemove(this.file[0]);
					let aTemp = deteleObject([...this.showImgList, event]);
					aTemp.splice(0, 1);
					this.showImgList = aTemp;
				}
			} else {
				this.showImgList.push({
					loading: true,
					...event,
				});

				//只是显示3条 真正的还是全部
				// if (Array.isArray(this.file) && deteleObject([...this.showImgList, event]).length > 3 && this.isInTable) {
				// 	let aTemp = deteleObject([...this.showImgList, event]);
				// 	aTemp.splice(0, 1);
				// 	this.showImgList = aTemp;
				// 	// (<any>this).$refs.comUpload.handleRemove(this.showImgList.length - 1);

				// 	return;
				// }
	//----------1.21 需求确认 超过十个附件 提示上限-------------
				// if (Array.isArray(this.file) && deteleObject([...this.showImgList, event]).length > 10) {
				// 	//最多允许上传10个文件，超出删除第一个
				// 	let aTemp = deteleObject([...this.showImgList, event]);
				// 	aTemp.splice(0, 1);
				// 	this.showImgList = aTemp;
				// 	// this.handleRemove(this.showImgList[0]);
				// }
			}
			this.$emit("change", event);
		}

		private executeDelete(file: any) {
			//执行删除
			let url: string = `/codeZero/oss/remove/${this.$route.params.formCode}/${file.objectName}`;
			RCall.newIns()
				.request({ url: url, method: "post" })
				.then((resp) => {
					console.log(resp);
				});
		}
		/**
		 * 上传文件之前的钩子，用于做校验文件
		 * @file {File} 文件本身
		 * 若返回 false 或者返回 Promise 且被 reject，则停止上传
		 **/
		private beforeUpload(file: any) {
			// console.log('beforeUploadfile==>', file)

			return new Promise((resolve: any, reject: any) => {
				if (file.size === 0) {
					// 如果检测不到文件大小，报错
					console.log("文件错误，请上传正确的文件");
					reject();
				}
				// 判断文件是否超过限制大小
				if (file.size / 1024 / 1024 > this.size) {
					console.log(`文件大小超过限制，最大不超过${this.size}MB`);
					reject();
				} else {
					resolve();
				}
			});
		}
		private judgeImg(file: any) {
			let imgTypes: String = "bmp,jpg,png,tif,gif,pcx,tga,exif,fpx,svg,psd,cdr,pcd,dxf,ufo,eps,ai,raw,WMF,webp,avif";
			return !this.bCanPreview ? (imgTypes.indexOf(this.suffix(file)) < 0 ? false : true) : false;
		}
		private suffix(file: any) {
			try {
				// file.name = file.name.toLowerCase();
				 return file.name.substring(file.name.lastIndexOf(".") + 1);
			} catch (error) {}
		}
		/**
		 * 处理文件尺寸
		 */
		private formatFileSize(fileSize: any) {
			fileSize = Number(fileSize);
			if (fileSize < 1024) {
				return `${fileSize}B`;
			} else if (fileSize < 1024 * 1024) {
				let temp: any = fileSize / 1024;
				temp = temp.toFixed(2);
				return `${temp}KB`;
			} else if (fileSize < 1024 * 1024 * 1024) {
				let temp: any = fileSize / (1024 * 1024);
				temp = temp.toFixed(2);
				return `${temp}MB`;
			} else {
				let temp: any = fileSize / (1024 * 1024 * 1024);
				temp = temp.toFixed(2);
				return `${temp}GB`;
			}
		}

		private preview(e: Event) {
			e.stopPropagation();
			console.log("预览");
		}
	}
</script>
<style lang="scss" scoped>
	@import "./_style/index.scss";
</style>
