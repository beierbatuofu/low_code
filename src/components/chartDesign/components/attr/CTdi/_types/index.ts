declare namespace NFormulaEdit {

	interface TField{
        dictData:string|null;
        formCode:null|string;
        id: string;
        isDeleted: null
        label:string;
        prop: string;
        description?:string;
        type?:string;
        timestamp?:number;
        title?:any;
    }

    interface TFieldConfig {
        title:string;
        list:TField[]
    }

    
    interface TCodeMirrorCurosor {
        line:number;
        ch:number;
        sticky?:string;
    }

    interface TMarkTextOpts {
        className?: string;
        inclusiveLeft?: boolean;
        inclusiveRight?: boolean;
        selectLeft?: boolean;
        selectRight?: boolean;
        atomic?: boolean;
        collapsed?: boolean;
        clearOnEnter?: boolean;
        clearWhenEmpty?: boolean;
        replacedWith?: any;
        handleMouseEvents?: boolean;
        readOnly?: boolean;
        addToHistory?: boolean;
        startStyle?: string;
        endStyle?: string;
        css?: string;
        attributes?: any;
        shared?: boolean;
        
    }

    interface TCodeMirrorChangeObj {
        from:TCodeMirrorCurosor;
        to:TCodeMirrorCurosor;
        text:string;
        removed?:string[];
        key?:string;
    }
    
    class TCodeMirror{
            state:any;
            on:(event:string,cb:(instance:any,changeObj:any,event?:any)=>void)=>void;
            lineCount:()=>any;
            getCursor:()=>TCodeMirrorCurosor;
            replaceRange:(replacement: string, from: TCodeMirrorCurosor,  origin?:string)=>void;
            markText:(from:TCodeMirrorCurosor,to:TCodeMirrorCurosor,options?:TMarkTextOpts)=>void;
            setCursor:(line:number,ch?:number, options?:object)=>void
            focus:()=>void;
            getValue:()=>string;
            getAllMarks:()=>any;
            setValue:(content:string)=>void;
            setOption:(option:string,value:any)=>void;
            getLine:(n:number)=>string;
            Pos:(line:number,ch?:number , sticky?:string)=>void;
            getTokenAt:(pos:TCodeMirrorCurosor)=>any;
     }


    interface TFormulaOpts {
        label:string;
        value:string|number;
    }

    interface TFormulaList {
            title:string;
            name:string|number;
            children:Array<TFormulaOpts>
    }
}


export default NFormulaEdit