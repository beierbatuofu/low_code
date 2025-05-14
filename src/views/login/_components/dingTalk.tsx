import { VNode } from "vue";
import { Vue, Component,Watch } from "vue-property-decorator";
import DDLogin from "./js/ddLogin.js";
import {LoginModule} from '@/store/modules/login'

@Component
export default class DingTalk extends Vue {

    private appId:string = '';

    @Watch('$route',{immediate:true})
    onChangeRoute(){
        let {tenantId} = this.$route.params;
        if(!tenantId || tenantId == 'undefined') return this.$router.push({
            path:'/tenants',
            replace:true
        })    
    }
    
    private get redirectUri(){
        let origin = window.location.origin;
        let {tenantId} = this.$route.params;
        if(/8080$/.test(origin)) return encodeURIComponent(`http://localhost:8080/#/${tenantId}/qr/dingtalk`);
        return encodeURIComponent(`${origin}/#/${tenantId}/qr/dingtalk`);
    }

    private createDDIframe(){
        return new Promise((resolve,reject)=>{
            // const app_id = encodeURIComponent(process.env.VUE_APP_APP_ID);
            const app_id = encodeURIComponent(this.appId);
            const redirect_uri = this.redirectUri;
     
            DDLogin({
                id: "ddLogin", //这里需要你在自己的页面定义一个HTML标签并设置id，例如<div id="login_container"></div>或<span id="login_container"></span>
                goto: encodeURIComponent(
                    `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${app_id}&response_type=code&scope=snsapi_login&state=gfzfes&redirect_uri=${redirect_uri}`
                ), //请参考注释里的方式
                style: "border:none;background-color:#FFFFFF;",
                width: "365",
                height: "400",
                success:resolve,
                error:reject
            });
        })
       
    }

    private listenMessage(event:TJson){
       
       // const app_id = encodeURIComponent(process.env.VUE_APP_APP_ID);
        const app_id = encodeURIComponent(this.appId);
        const redirect_uri = this.redirectUri;
        const origin= event.origin;   
       
        if (origin == "https://login.dingtalk.com") {
            //判断是否来自ddLogin扫码事件。
            const loginTmpCode = event.data; 
            //拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
            window.location.href =
                `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${app_id}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${redirect_uri}&loginTmpCode=` +
                loginTmpCode;
        }
    }

	protected mounted() {
      
      
        this.$route.params.tenantId !== 'undefined' && LoginModule.postTenants(this.$route.params.tenantId).then(()=>{
            this.appId = LoginModule.tenantInfo.loginAppKey || "";
            this.createDDIframe();
            let win:TJson = window;
            win.attachEvent?win.attachEvent("onmessage", this.listenMessage):win.addEventListener("message", this.listenMessage, false);
      
        });
       
  
       
	}

	protected render(): VNode {
		const style = {
			width:'365px',
			margin:'0 auto',
			overflow:"hidden",
			height:"320px",
			background:"#fff"
		}
		return <div id="ddLogin" style={style}></div>
		
		
	}
}
