/*
 * @Author: ben
 * @LastEditTime: 2021-06-08 14:57:12
 */
import Vue from "vue";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";

export default (value:any)=>{
	const requireComponent = value;
	requireComponent.keys().forEach((fileName: any) => {
		// 获取组件配置
		const componentConfig = requireComponent(fileName);
		// 获取组件的 PascalCase 命名
		const componentName = upperFirst(
			camelCase(
				// 获取和目录深度无关的文件名
				fileName
					.split("/")
					.pop()
					.replace(/\.\w+$/, "")
			)
		);
		
     
		// 全局注册组件
		Vue.component(
			componentName,
			// 如果这个组件选项是通过 `export default` 导出的，
			// 那么就会优先使用 `.default`，
			// 否则回退到使用模块的根。
			componentConfig.default || componentConfig
		);

		
			

	});

}

