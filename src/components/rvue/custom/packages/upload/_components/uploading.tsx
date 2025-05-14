import {  Vue } from "vue-property-decorator";

const shareStyle:Record<string,any> = {
	position: "fixed",
	top: "0px",
	left: "0px",
	bottom: "0px",
	right: "0px",
	zIndex: 99991,
	background: "rgba(0,0,0,0.4)",
};

const conStyle:Record<string,any> = {
    position:"absolute",
    top:"50%",
    right:0,
    left:0,
    zIndex:99992,
    textAlign:'center'
}

const iconStyle:Record<string,any> = {
    fontSize:'40px',
    color:'#6087FD'
}

const msgStyle:Record<string,any> = {
    fontSize:"16px",
    color:'#ffffff',
    padding:"15px 0px"
}

const btnStyle:Record<string,any> = {
    width:'250px',
    height:'40px',
    background:'transparent',
    border:"1px solid rgb(245, 108, 108)",
    color:'rgb(245, 108, 108)',
    fontSize:"20px",
    display:"inline-block",
    lineHeight:"40px"
}

let instance: Record<string, any> | null = null;

const loading = Vue.extend({
	data() {
		return {
			message: "loading",
			btnText: "close",
			visible: false,
			onClosed: () => {},
		};
	},
	methods: {
    close() {

			this.visible = false;
            instance?.parentNode?.removeChild(instance);
			this.onClosed();
            instance = null;
		},
	},
	render() {
		if (!this.visible) return <div></div> 
		return (
			<div style={shareStyle}>
				<div style={conStyle}>
					<i class="el-icon-loading" style={iconStyle}></i>
					<p style={msgStyle}>{this.message}</p>
					<div style={btnStyle}  on-click={this.close}>
						{this.btnText}
					</div>
                    <p style={{fontSize:'14px'}}><span style={{display:"inline-block",width:'250px',textAlign:'left',color:'#c8c9cc',paddingTop:"10px"}}>只会取消未上传成功的附件，已上传成功的附件不会被取消</span></p>
				</div>
			</div>
		);
	},
});

interface TUpload {
	message: string;
	onClosed: () => void ;
	btnText: string;
}



const UpLoading = function (options: Partial<TUpload> = {}) {
	if (!instance) {
		instance = new loading({
			data: options,
		}).$mount();
		document.body.appendChild(instance.$el);
	}
	instance.visible = true;
	if ( options.hasOwnProperty('onClosed')) {
		instance.onClosed = options.onClosed;
	}
	return instance;
};

export default UpLoading;
