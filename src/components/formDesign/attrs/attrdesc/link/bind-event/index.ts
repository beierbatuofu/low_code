/**
 * @description 绑定链接元素的事件，入口
 * @author wangfupeng
 */

import bindTooltipEvent from "./tooltip-event";

/**
 * 绑定事件
 * @param editor 编辑器实例
 */
function bindEvent(editor: any) {
	// tooltip 事件
	bindTooltipEvent(editor);
}

export default bindEvent;
