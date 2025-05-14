declare namespace NNodeType {
    interface TNodeType {
        name?:string;
        text?:any;
        data?:any;
        id?:string;
   }
   
   interface TLineType extends TNodeType{
       strokeStyle?:string;
       to?:any;
       from?:any;
   }
}

export default NNodeType;