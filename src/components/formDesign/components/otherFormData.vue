<script lang="tsx">
	import { Component, Watch, Vue, Prop, Emit } from "vue-property-decorator";
	import { queryRecursiveTree, getFormFields } from "@/api/form.js";
	import MatchRules from "@/components/matchRules/";

	const filUserType = ["user", "userRadio", "dept", "deptRadio"];
	const filInpType = ["input", "select", "radio", "textarea", "datetime", "selectMulti", "checkbox", "sn"];

	@Component({
		components: {
			"match-rules": MatchRules,
		},
	})
	
	export default class OtherFormData extends Vue {
		@Prop({ type: Object, default: () => ({}) }) defOpts!: TJson;
		@Prop({ type: Object, default: () => ({}) }) curField!: Record<string, any>;
		private forms: Record<string, any> = [];
		private formValue = "";
		private fields = [];
		private fieldValue = "";
		private whitelist = ["input", "number", "datetime", "radio", "select"];
		private visible = false;
		private matchRules: Record<string, any> = [];
		private timestamp: number = 1;
		private newFields=[];
		private newFieldsList=["separator","creater","create_time","update_time","table","tab","address"]
		private oldList:TJson = [];
		private hasTargetField: boolean = false;
		private btnTrue:boolean=false;

		@Watch("visible", {
			immediate: true,
		})
		visibleChange(flag: boolean) {
			this.oldList=this.$utils.deepClone(this.matchRules)
		}



		private handleOpen() {
			console.log(this.matchRules,'打开');
			this.timestamp++
			if(this.btnTrue){
				this.matchRules=this.verification(this.matchRules);
			}else{
				//this.matchRules=this.matchRules.length==this.oldList.length?this.matchRules:this.oldList;
				this.matchRules
			}
		}

		//关闭dialog
		private handleClose() {
			this.matchRules = this.$utils.deepClone(this.oldList);
			this.$emit("close");
		}

		private emit(v:any){
			const { appCode } = this.$route.params;
			this.$emit("change", {
				appCode: appCode,
				formCode: this.formValue,
				fieldId: this.fieldValue,
				matchRules: v,
			});
		}

		//點擊確定
		private emitChange() {
			//this.matchRules = this.verification(this.matchRules);
			let bool: boolean = false;
			this.matchRules.forEach((ite1:any)=>{
				
				ite1.forEach((ite2:any)=>{
					console.log(ite2.judgeValues[0],'ite2');
					if((ite2.judgeValues[0]==undefined||!ite2.method||ite2.judgeValues[0]=="")&&
						ite2.method != "empty" &&
						ite2.method != "not_empty"){
							bool=true;
						}
					if(ite2.type == "number"&&ite2.method == "between"&&(isNaN(ite2.judgeValues[0]["1"])||isNaN(ite2.judgeValues[0]["0"])) ){
							bool=true
						}
					 if(ite2.type=="datetime"&&ite2.method == "between"&&ite2.judgeValues[0]==""){
							bool=true
						}
					})
				})
				if (bool) {
					this.visible = true;
					return this.$Rmessage({
					message: this.$t("linkDataDialog.judgeValuesError"),
					type: "warning",
				});
				}
				this.emit(this.matchRules)	
				this.btnTrue=true;
		}

		//验证macthRules是否有空选项
		private verification(rules: any) {
			let aRules: any = [];
			rules.forEach((group: any) => {
				let aGroup: any = [];
				group.forEach((item: any) => {
					if (item.dataType == 1 && !this.hasTargetField) {
						this.hasTargetField = true;
					}

					if (item.method && item.targetFieldCode && item.judgeValues.length) {
						if (filInpType.includes(item.type)) {
							if (item.judgeValues[0].trim() !== "") {
								aGroup.push(item);
							}
						} else if (filUserType.includes(item.type)) {
							if (item.judgeValues.length != 0) {
								aGroup.push(item);
							}
						} else if (item.type == "number") {
							if (item.method == "between") {
								if (!isNaN(item.judgeValues[0]["0"]) && !isNaN(item.judgeValues[0]["1"])) {
									aGroup.push(item);
								}
							} else if(item.type=="date"){
							if(item.method=="between"){
								if(item.judgeValues.length!=0){
									aGroup.push(item);
								}
							}
						}
							else {
								if (item.dataType == "0" && String(item.judgeValues[0]) && !isNaN(item.judgeValues[0])) {
									aGroup.push(item);
								} else if (item.dataType == "1" && item.judgeValues[0]) {
									aGroup.push(item);
								}
							}
						}
					} else if (item.method && item.targetFieldCode && ["not_empty", "empty"].includes(item.method)) {
						aGroup.push(item);
					}
				});
				aGroup.length && aRules.push(aGroup);
			});

			return aRules;
		}

		private handleFormChange(v: string) {
			this.formValue = v;
			this.fieldValue = "";
			let matchRulesVain:any = [];
			this.fields = [];
			this.emit(matchRulesVain)
			this.getFields(v);
		}

		private handleFieldChange(v: string) {
			this.fieldValue = v;
			const { appCode } = this.$route.params;
			this.matchRules = [];
			let matchRulesVain:any = [];
			this.emit(matchRulesVain)
		}

		private getFields(formCode: string) {
			const { appCode } = this.$route.params;
			return Promise.resolve(
				getFormFields(appCode, formCode, false).then((resp: TResponse & { structure: Record<string, any> }) => {
					//console.log(resp.data.structure, "resp.data.structure666666");
					if (resp.data.structure) {
						this.fields = resp.data.structure.configList
							.filter((item: TJson) => this.whitelist.includes(item.type))
							.map((item: TJson) => ({ title: item.title, fieldId: item.fieldId, ...item }));
							console.log(this.fields,'this.fields');
						this.newFields=resp.data.structure.configList
							.filter((item: TJson) => !this.newFieldsList.includes(item.type))
							.map((item: TJson) => ({ title: item.title, fieldId: item.fieldId, ...item }));
					}
				})
			);
		}

		private getFormCode(tree: Record<string, any>[], formMap: Record<string, any>) {
			for (let i = 0; i < tree.length; i++) {
				const id = tree[i].id;
				if (tree[i].childList.length) {
					this.getFormCode(tree[i].childList, formMap);
				} else {
					this.forms.push(formMap[id]);
				}
			}
		}

		protected created() {
			const { appCode } = this.$route.params;
			this.defOpts.matchRules && (this.matchRules = this.defOpts.matchRules);
			queryRecursiveTree(appCode).then((resp: TResponse) => {
				// this.forms = Object.values(resp.data.formMap);
				// 对象的遍历是无序的
				let idRecursiveTree = resp.data.idRecursiveTree;

				this.getFormCode(idRecursiveTree, resp.data.formMap);
				if (Object.keys(this.defOpts).length) {
					this.formValue = this.defOpts.formCode;
					
					if (this.forms.findIndex((item: Record<string, any>) => item.code == this.formValue) >= 0) {
						this.getFields(this.formValue).then(() => {
							this.fieldValue = this.defOpts.fieldId;
						});
					}
				}
			});
		}

		private formSelect(lang: string) {
			const props = {
				value: this.forms.findIndex((item: Record<string, any>) => item?.code == this.formValue) > -1 ? this.formValue : "",
				placeholder: "请选择表单",
			};
			const { id: formCode } = this.$route.params;
			props.placeholder = this.fieldValue && !props.value ? "该表单已被删除" : props.placeholder;
			return (
				<rvue-select props={props} class={{ error: this.formValue && !props.value }} on-Change={this.handleFormChange} style={{ marginRight: "2px", borderColor: "red" }}>
					{this.forms.map((item: TJson) => {
						if (item?.type && item.type != "S" && item.type != "P" && item.code !== formCode) {
							let compProps = { value: item.code, label: item.multiLanguage[lang] };
							return <rvue-option key={item.code} props={compProps}></rvue-option>;
						}
					})}
				</rvue-select>
			);
		}

		private fieldSelect(lang: string) {
			let props = {
				value: this.fields.findIndex((item: Record<string, any>) => item.fieldId == this.fieldValue) > -1 ? this.fieldValue : "",
				placeholder: "请选择字段",
			};
			props.placeholder = this.fieldValue && !props.value ? "该字段已被删除" : props.placeholder;

			return (
				<rvue-select props={props} class={{ error: this.fieldValue && !props.value }} on-Change={this.handleFieldChange} style={{ marginLeft: "2px" }}>
					{this.fields.map((item: TJson) => {
						let compProps = { value: item.fieldId, label: item.title[lang] };
						return <rvue-option key={item.fieldId} props={compProps}></rvue-option>;
					})}
				</rvue-select>
			);
		}

		private dialogComp() {
			
			return (
				<rvue-dialog
					props={{
						title: "设置过滤条件",
						visible: this.visible,
						width: "800px",
					}}
					on={{
						close: () => {
							this.visible = false;
							this.handleClose()
						},
					}}
				>
					<div class="titleLine"></div>
					<match-rules
						key={this.timestamp}
						props={{ modeFlag: false,
								 configlist: this.newFields, 
								 //configlist:this.fields,
								 matchRules: this.matchRules, 
								 isDataTypeComp: false,
								 filters:["separator", "tab", "table"]
								}}
						on={{
							change: (rules: any) => {
								this.matchRules = rules;
							},
						}}
					></match-rules>
					<div style="text-align:center">
						<rvue-button
							on={{
								click: () => {
									this.visible = false;
									this.handleClose()
								},
							}}
						>
							取消
						</rvue-button>
						<rvue-button
							on={{
								click: () => {
									this.visible = false;
									this.emitChange();
								},
							}}
							type="primary"
						>
							确定
						</rvue-button>
					</div>
				</rvue-dialog>
			);
		}

		protected render() {
			const lang = localStorage.getItem("lang") || "zh";
			const formSelect = this.formSelect(lang);
			const fieldSelect = this.fieldSelect(lang);
			return (
				<div>
					<div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
						{formSelect}
						{fieldSelect}
					</div>

					{!!this.fields.length && !!this.fieldValue && (
						<rvue-button
							on={{
								click: () => {
									(this.visible = true), this.handleOpen();
								},
							}}
							style="width:100%;margin-top:10px"
						>
							设置过滤条件
						</rvue-button>
					)}
					{this.dialogComp()}
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	::v-deep {
		.error {
			input {
				outline: 1px solid red;
				&::placeholder {
					color: red;
				}
			}
		}
		.titleLine {
			height: 30px;
			width: 5px;
			background: #6087fd;
			position: absolute;
			top: 7%;
			left: 3%;
			transform: translateY(-50%);
		}
	}
</style>
