import { VNode } from "vue";
import { Vue, Component, Watch } from "vue-property-decorator";
import DingTalk from "./dingTalk";
import "./less/loginRollBack.scss";

@Component
export default class Login extends Vue {
	private type = "dingtalk";

	private handleChange(tab: any, event: any) {
		console.log("type", this.type);
	}


 

	protected render(): VNode {
		return (
			<div class="login-group">
				<el-tabs v-model={this.type} stretch={true} on-tab-click={this.handleChange}>
					<el-tab-pane disabled label="账号密码" name="usernamePassword">
						账号密码
					</el-tab-pane>
					<el-tab-pane label="钉钉登录" name="dingtalk">
						<DingTalk></DingTalk>
					</el-tab-pane>
					<el-tab-pane disabled label="微信登录" name="wechat">
						微信登录
					</el-tab-pane>
				</el-tabs>
			</div>
		);
	}
}
