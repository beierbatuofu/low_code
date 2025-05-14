/**
 * @param dataType 0-自定义表单，1-关联表单
 * @param targetFieldCode 目标表单字段code 
 * @param targetFieldName 目标字段名
 * @param judgeValues dataType为0时：该字段是手动输入的值，为1时：该字段为当前表字段的code
 * @param method 匹配方式： eq： 等于，ne：不等于，like：包含，nlike：不包含
 */
interface RuleInterface {
    /**
     * 0-自定义，1-关联表单
     */
    dataType: 0 | 1; 
    /**
     * 目标表单字段code 
     */
    targetFieldCode: string; 
    /**
     * 目标字段名
     */
    targetFieldName: string; 
    /**
     * dataType为0时：该字段是手动输入的值，为1时：该字段为当前表字段的code
     */
    judgeValues: Array<string>; 
    /**
     * 匹配方式： eq： 等于，ne：不等于，like：包含，nlike：不包含
     */
    method: "eq" | "ne" | "like" | "nlike"; 
}

/**
 * @param targetAppCode 目标表单appCode
 * @param targetFormCode 目标表单code
 * @param targetField 目标表单字段code
 * @param fieldCode 当前字段code
 * @param matchRules 匹配规则
 */
interface FormRelationInterface {
    /**
     * 目标appCode
     */
    targetAppCode: string;
    /**
     * 目标表单code
     */
    targetFormCode: string;
    /**
     * 目标表单字段code
     */
    targetField: string;
    /**
     * 当前字段code
     */
    fieldCode: string;
    /**
     * 当前字段code
     */
    fieldName: string;
    /**
     * 匹配规则
     */
    matchRules: Array<Array<RuleInterface>>
}

/**
 * 表单关系
 */
class FormRelation implements FormRelationInterface{

    targetAppCode: string;
    targetFormCode: string;
    targetField: string ;
    fieldCode: string;
    fieldName: string;
    matchRules: RuleInterface[][];

    /**
     * 表单关系-构造方法
     * @param targetAppCode 目标appCode
     * @param targetFormCode 目标表单code
     * @param targetField 目标表单字段code
     * @param fieldCode 目标表单字段code
     * @param matchRules 匹配规则
     */
    constructor(
        targetAppCode: string,
        targetFormCode: string,
        targetField: string,
        fieldCode: string,
        fieldName: string,
        matchRules: RuleInterface[][]
        ) {
        this.targetAppCode = targetAppCode;
        this.targetFormCode = targetFormCode;
        this.targetField = targetField;
        this.fieldCode = fieldCode;
        this.fieldName = fieldName;
        this.matchRules = matchRules;
    }
}

export { RuleInterface, FormRelationInterface, FormRelation }