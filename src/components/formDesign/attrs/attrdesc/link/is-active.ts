/**
 * @description 检查选区是否在链接中，即菜单是否应该 active
 * @author wangfupeng
 */

function isActive(editor: any): boolean {
	const $selectionELem = editor.selection.getSelectionContainerElem();
	if (!$selectionELem?.length) {
		return false;
	}
	if ($selectionELem.getNodeName() === "A") {
		return true;
	} else {
		return false;
	}
}

export default isActive;
