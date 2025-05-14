// import zh from './languages/zh';
// import en from './languages/en';


import zh from '@/lang/languages/zh';
import en from '@/lang/languages/en';
let desginLang = zh;

export const locale = {
    zh,
    en
  };

export const t = function(path) {
    let value = '';
    const array = path.split('.');
    let current = desginLang;
    for (let i = 0, j = array.length; i < j; i++) {
      const property = array[i];
      value = current[property]; 
      if (i === j - 1) return value;
      if (!value) return '';
      current = value;
    }
    return '';
};

export const use = (l = "zh")=>{
   
   desginLang = locale[l];
}
  
export default {
    use
}