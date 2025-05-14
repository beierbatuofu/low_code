import {theme} from '@/styles/variables.scss'

export default (function(){

    class Theme {
       
        public init(color:string,callback:Promise<any>){
             return callback.then((res:TResponse)=>{
                this.handleStyle(res.data,this.toRGB(color));
            })
        }

        private toRGB(color:string){
            let arr = [];
            for(let i = 1;i<color.length-1;i++){
                 if(i%2 != 0 ){
                     arr.push(parseInt('0x'+color.slice(i,i+2)))
                 }
            }
            return arr+'';
        }

        private handleStyle(CssString:string,newColor:string){
            let oldColor:string = this.toRGB(theme);
            let id:string = 'theme';
            let cssText:string = CssString;
            let styleId = document.getElementById(id);
            let newCssText = cssText.replace(new RegExp(oldColor,'g',),newColor).replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
        
            if(!styleId){           
                styleId = document.createElement('style');
                styleId.setAttribute('id', id);
                styleId.setAttribute('type', 'text/css');
                document.getElementsByTagName("head")[0].append(styleId);
            }
            styleId.innerText = newCssText;
        
        }
    }

    return new Theme()

})();

