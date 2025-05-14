<!--
 * @Author: ben
 * @LastEditTime: 2021-07-19 13:12:05
-->
<script lang="tsx">
	import { VNode } from "vue";
	import { Vue, Component } from "vue-property-decorator";

	@Component({})
	class App extends Vue {
		protected render(): VNode {
			return (
				<div id="app">
					<router-view></router-view>
				</div>

				// <div id="app">
				//     <div id="nav">
				//         <router-link to="/">Home</router-link> |
				//         <router-link to="/about">About</router-link>
				//     </div>
				//     <router-view/>
				//     {/* 这里虽然代码打包校验过不去，但是代码可以执行 */}
				//     {/*
				//         解决方法一：
				//             <Demo props={{fieldA: "dsadsa"}}></Demo>
				//         解决方法二：
				//             在src/shims-tsx.d.ts中增加：
				//             declare module "vue/types/options" {

				//                 interface ComponentOptions<V extends Vue> {

				//                 [propName: string]: any;

				//                 }

				//             }
				//         参考链接：https://zhuanlan.zhihu.com/p/168223071
				//     */}
				//     <div>{this.returnedValue}</div>
				//     <div>{JSON.stringify(this.man)}</div>
				//     <button onClick={() => {
				//         this.man = {
				//             name: "尹成刚",
				//             age: "27",
				//             sex: "男"
				//         };
				//     }}>value back</button>
				//     {/* 等同于on:myEvent */}
				//     <Demo onMyEvent={(param: string) => {
				//         alert(param)
				//     }} v-model={this.man} fieldA={this.fieldA}></Demo>
				// </div>
			);
		}
	}

	export default App;
</script>
