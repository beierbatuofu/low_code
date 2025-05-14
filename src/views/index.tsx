import { VNode } from "vue";
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";

interface Man {
	name: string;
	age: string;
	sex: string;
}

@Component({
	filters: {
		time(value: string) {
			return value;
		},
	},
})
export default class Demo extends Vue {
	@Prop(String) fieldA!: string;

	@Prop(String) fieldB?: string;

	@Model("modelChange")
	public readonly value!: Man; // 这里定义的value 是从父组件传下来的值

	buttonClick = () => {
		// this.$on('emit-todo', function(param: string) {
		//     alert('it\'s emit eve!' + param)
		// })
		this.emitFunction("Oh, no!");
	};

	@Emit("myEvent")
	emitFunction(param: string) {
		alert("you got me! emit.");
	}

	@Emit("modelChange")
	changeValue(param: Man) {
		console.log(param);
	}

	emitEve(param: string) {
		alert("it's emit eve!" + param);
	}

	// beforeCreate:function(){
	//     console.log('1-beforeCreate 初始化之后');
	// },
	// created:function(){
	//     console.log('2-created 创建完成');
	// },
	// beforeMount:function(){
	//     console.log('3-beforeMount 挂载之前');
	// },
	// mounted:function(){
	//     console.log('4-mounted 被创建');
	// },
	// beforeUpdate:function(){
	//     console.log('5-beforeUpdate 数据更新前');
	// },
	// updated:function(){
	//     console.log('6-updated 被更新后');
	// },
	// activated:function(){
	//     console.log('7-activated');
	// },
	// deactivated:function(){
	//     console.log('8-deactivated');
	// },
	// beforeDestroy:function(){
	//     console.log('9-beforeDestroy 销毁之前');
	// },
	// destroyed:function(){
	//     console.log('10-destroyed 销毁之后')
	// }
	options: any = {};
	protected render(): VNode {
		return (
			<div>
				{/* <div>{this.fieldA}</div>
                <Test></Test>
                <button onClick={() => {this.buttonClick()}}>Please click me to test!</button>
                <button onClick={() => {this.changeValue({name: "王伟", age: "18", sex: "男"})}}>Change Model value</button> */}
				<rvue-form-design
					style={{ height: "100vh" }}
					options={this.options}
					aside-left-width={300}
					aside-right-width={380}
					storage
					showGithubStar={false}
					submit="handleSubmit"
				></rvue-form-design>
			</div>
		);
	}
}
