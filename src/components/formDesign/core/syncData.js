/*
 * @Author: ben
 * @LastEditTime: 2021-06-10 10:52:54
 */

export default (key)=>({
    value:{
        get(){
             return this.data[key];
        },
        set(n){
           this.$set(this.data,key,n)
          
           
        }
   }
})