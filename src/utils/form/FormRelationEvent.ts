import { RespData, RCall } from "@/utils/RCall";

import { FormRelationCache, FormRelationCacheInterface } from "./FormRelationCache";
import { FormRelationEnum } from "./FormRelationEnum";
import { FormRelationInterface } from "./TypeDefine";

interface FormRelationEventInterface {
	/**
	 * 根据fieldCode执行对应的事件
	 * @param fieldCode 字段说：我触发的，所以是我的fieldCode
	 */
	excuteEvent(fieldCode: string): void;
}

/**
 * 表单事件处理类
 */
class FormRelationEvent implements FormRelationEventInterface {
	/**
	 * 应用code
	 */
	private appCode: string;
	/**
	 * 表单code
	 */
	private formCode: string;
	/**
	 * 表单关系缓存
	 */
	private formRelationCache: FormRelationCacheInterface;

	/**
	 * 回调方法
	 */
	private callback: (resp: RespData, formRelations: Array<FormRelationInterface>) => void;

	/**
	 * 获取输入框值
	 */
	private elementValues: (fieldCodes: Array<string>) => { [key: string]: any };

	/**
	 *
	 * @param appCode 应用code
	 * @param formCode 表单code
	 * @param formRelations 匹配规则数据
	 * @param callback 回调方法
	 * @param elementValues 获取字段数据方法
	 */
	constructor(
		appCode: string,
		formCode: string,
		formRelations: Array<FormRelationInterface>,
		callback: (resp: RespData, formRelations: Array<FormRelationInterface>) => void,
		elementValues: (fieldCodes: Array<string>) => { [key: string]: any }
	) {
		this.appCode = appCode;
		this.formCode = formCode;
		this.formRelationCache = new FormRelationCache();
		this.callback = callback;
		this.elementValues = elementValues;
		this.loadRelationData(formRelations);
	}

	excuteEvent(fieldCode: string): void {
		const fieldCodeSet = new Set<string>();
		fieldCodeSet.add(fieldCode);
		this.forEachFormRelations(fieldCode, fieldCodeSet);
	}

	/**
	 * 根据fieldCode获取formRelations并遍历执行
	 * @param fieldCode 字段code
	 * @param fieldCodeSet 字段集合
	 */
	private forEachFormRelations(fieldCode: string, fieldCodeSet: Set<string>) {
		const formRelations = this.formRelationCache.get(fieldCode);
		console.log("--------------------------------------------------");
		console.log(fieldCode, fieldCodeSet);
		console.log("--------------------------------------------------");
		if (formRelations && formRelations.length > 0) {
			this.excutes(formRelations, fieldCodeSet);
		}
	}

	/**
	 * 执行
	 * @param fieldCode 字段code
	 * @param fieldCodeSet 字段code set集合
	 */
	private excutes(formRelations: Array<FormRelationInterface>, fieldCodeSet: Set<string>) {
		const param = this.getElementValues(formRelations);
		console.log("param", param);

		this.getDatas(param, formRelations)
			.then((resp) => {
				this.callback(resp, formRelations);
				formRelations.forEach((formRelation) => {
					const fieldCode = formRelation.fieldCode;
					if (fieldCodeSet.has(fieldCode)) {
						console.log(fieldCode, "检测到回环,事件被中断", fieldCodeSet);
						return;
					} else {
						const set = new Set<string>(fieldCodeSet);
						set.add(fieldCode);
						this.forEachFormRelations(fieldCode, set);
					}
				});
			})
			.catch((err) => {
				console.log("failed!");
			});
	}

	/**
	 * 获取输入框数据
	 * @param formRelations 规则数据
	 * @returns
	 */
	private getElementValues(formRelations: Array<FormRelationInterface>): { [key: string]: any } {
		const paramSet = new Set<string>();
		formRelations.forEach((formRelation) => {
			if (formRelation.matchRules) {
				formRelation.matchRules.forEach((rules) => {
					rules.forEach((rule) => {
						paramSet.add(rule.judgeValues[0]);
					});
				});
			}
		});
		return this.elementValues(Array.from(paramSet));
	}

	/**
	 * 获取数据
	 * @param formRelations 匹配规则
	 * @returns
	 */
	private getDatas(param: { [key: string]: any }, formRelations: Array<FormRelationInterface>): Promise<RespData> {
		console.log("--------------------------request data start---------------------------------");
		console.log(this.appCode, this.formCode, param, formRelations);
		console.log("--------------------------request data end-----------------------------------");
		return RCall.newIns().serviceHandle(true).post(`/codeZero/app/${this.appCode}/form/${this.formCode}/relation`, { relationList: formRelations, values: param });
	}

	/**
	 * 将表单关联规则数据加载到 @formRelationCache
	 * @param formRelations 表单关联规则数据
	 */
	private loadRelationData(formRelations: Array<FormRelationInterface>) {
		this.checkData(formRelations);
		console.log(formRelations, "formRelations");
		const start = new Date().getTime();
		formRelations.forEach((formRelation) => {
			formRelation.matchRules.forEach((rules) => {
				rules.forEach((rule) => {
					if (rule.dataType === 1) {
						// TODO:目前默认rule.dataType=1时，rule.judgeValues中只有一个元素，后续可能存在优化
						const fieldCode = rule.judgeValues[0];
						this.formRelationCache.putForAnd(fieldCode, formRelation);
					} else {
						// TODO:rule.dataType = 0处理
					}
				});
			});
		});
		console.log(this.formRelationCache, "this.formRelationCache");
		console.log(`load relation data in ${new Date().getTime() - start} milliseconds`);
	}

	/**
	 * 检查数据是否合法
	 * @param formRelations 表单关联规则数据
	 */
	private checkData(formRelations: Array<FormRelationInterface>) {
		const fieldCodeSet = new Set<string>();
		formRelations.forEach((formRelation) => {
			const fieldCode = formRelation.fieldCode;
			if (fieldCodeSet.has(fieldCode)) {
				throw FormRelationEnum.FIELD_ALREADY_EXISTS(`表单关联规则数据中${formRelation.fieldName}有重复`);
			} else {
				fieldCodeSet.add(fieldCode);
			}
		});
	}
}

export default FormRelationEvent;
