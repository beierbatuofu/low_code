import E from "wangeditor";
import i18next from "i18next";

/**
 * @description:
 * @param {Object} dom
 * @param {Object} options
 * @return {*}
 */
import Link from "./link/index";

interface TREditor {
	EDITOR: Record<string, any>;
	INIT: () => void;
}

export default (dom: any, config: TJson = {}): any => {
	//私有属性

	const INIT = Symbol("INIT");

	class REditor {
		private config: Record<string, any>;
		private EDITOR: Record<string, any>;
		constructor(dom: any, config: TJson) {
			if (typeof dom !== "object" && dom.nodeType !== 1 && typeof dom.nodeName !== "string") {
				throw new Error("TypeError: dom is null");
			}

			//自定义插入链接
			E.registerMenu("menuKey", Link);

			this.EDITOR = new E(dom);
			this.config = config;
			(<any>this)[INIT]();
		}

		private mergeConfig() {
			(<any>this).EDITOR.config = Object.assign((<any>this).EDITOR.config, (<any>this).config);
		}

		[INIT]() {
			this.mergeConfig();
			(<any>this).EDITOR.i18next = i18next;
			(<any>this).EDITOR.create();
		}

		/**
		 * @description: 获取editor json 数据结构
		 * @return {*}
		 */
		public getJSON(): any {
			return (<any>this).EDITOR.txt.getJSON();
		}

		public getHTML(): any {
			return (<any>this).EDITOR.txt.html();
		}

		public getText(): any {
			return (<any>this).EDITOR.txt.text();
		}
		
		public clear() {
			(<any>this).EDITOR.txt.clear();
		}

		public setHTML(html: string) {
			(<any>this).EDITOR.txt.html(html);
		}
		/**
		 * @description: editor 回显
		 * @param {TJson} array
		 */
		public setJSON(array: TJson[]) {
			(<any>this).EDITOR.txt.setJSON(array);
		}

		public onChange(cb: () => void) {
			(<any>this).EDITOR.config.onchange = function () {
				cb();
			};
		}
	}

	return new REditor(dom, config);
};
