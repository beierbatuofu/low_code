import { FormRelationInterface } from "./TypeDefine";

/**
 * FormRelationJson方法定义
 */
interface FormRelationCacheInterface {
    /**
     * 添加key-value
     * @param key 键
     * @param value 值
     */
    putForAnd(key: string, value: FormRelationInterface): void;
    /**
     * 获取value
     * @param key 键
     */
    get(key: string): Array<FormRelationInterface>;
}

/**
 * 存储relation的类
 */
class FormRelationCache implements FormRelationCacheInterface {

    /**
     * 关系json缓存
     * key：作为条件的字段的fieldCode
     * value：被这个字段作为条件修改的字段数据
     */
    private relationCache: { [key: string]: Array<FormRelationInterface> } = {};

    putForAnd(key: string, value: FormRelationInterface): void {
        if(!this.relationCache[key]){
            this.relationCache[key] = [];
        }

        // 检查是否有重复元素，以fieldCode为判断
        let pushFlag = true;

        for (let index = 0; index < this.relationCache[key].length; index++) {
            const element = this.relationCache[key][index];
            if(element.fieldCode === value.fieldCode) {
                pushFlag = false;
                break;
            }
        }

        pushFlag && this.relationCache[key].push(value);
    }

    get(key: string): Array<FormRelationInterface> {
        return this.relationCache[key];
    }

    
}

export { FormRelationCache, FormRelationCacheInterface } ;