/*
 * @Author: ben
 * @LastEditTime: 2022-07-04 17:03:21
 */
import Login from "./_components/index.tsx";
import { VNode } from "vue";
import { Vue, Component } from "vue-property-decorator";



const style:Record<string,any> = {
	width: "403px",
	position:"absolute",
	left:"50%",
	top:"50%",
	transform: "translate(-50%,-57%)"
}

const loginTit:Record<string,any> = {
	fontSize:"40px",
	color:"#ffffff",
	display:"flex",
	alignItems:"center",
	justifyContent:"center",
	marginBottom:"30px"

	
}
const logo :Record<string,any>= {
	display:"block"
}
const tit :Record<string,any>= {
	display:"block",
	marginLeft:"10px"
}

@Component({})
export default class LoginPage extends Vue {

    protected mounted(){
       
    }

	protected render(): VNode {
        const url = `${Vue.prototype.publicPath}img/icons/msapplication-icon-144x144.png`;
		return (
			<div class="loginStyle">
						
						<div class="bg-purple-light">
							<div style={style}>
								<div style={loginTit}>
									<img src={url} width="100" height="100" style={logo} />
									<span style={tit} >聆风</span>
								</div>
								<Login></Login>
							</div>
						</div>
				
			</div>
		);
	}
}
