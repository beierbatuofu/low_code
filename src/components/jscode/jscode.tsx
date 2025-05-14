import { Component, Vue, Prop } from "vue-property-decorator";
import jsmap , { TJsmap } from "./jsmap";
const Babel = require('/public/script/babel.min.js');
const $ =  require("/public/script/jquery.min.js");


@Component({})
export default class Jscode extends Vue {
    @Prop() option!:any
    @Prop({ type: String, default: "" }) source!:keyof TJsmap;

    private exports:Record<string,($:()=>any)=>void> = {}

    public run(){
        //this.exprots = {};
        if(!this.option.hasOwnProperty('jscode')) return;
        const { code } = Babel.transform(this.option.jscode, {
                 presets: ["es2015"],
         });

         new Function('exports',code)(this.exports);   
            Object.keys(this.exports).forEach((key:string)=>{
                 if(key == 'didMount'){
                     try{
                        if(!jsmap.hasOwnProperty(this.source)) return;
                        this.exports[key].call(jsmap[this.source].int({
                            comp:this
                        }),$)
                     }catch(err){
                        console.log(err)
                     }
                    
                 }
            })
        
    }

    protected created(){
            this.run();
    }

    protected render(){ return <div></div>}
}