/*
 * @Author: ben
 * @LastEditTime: 2021-06-25 13:27:09
 */
import zh from './zh';
import en from './en';

let currLang:{[key:string]:any} = zh;

export const locale:any = {
    zh,
    en
  };

export const t = function(path:string) {
    let value = '';
    const array = path.split('.');
    let current:any = currLang;
    for (let i = 0, j = array.length; i < j; i++) {
      const property = array[i];
      value = current[property]; 
      if (i === j - 1) return value;
      if (!value) return '';
      current = value;
    }
    return '';
};

export const use = (l = "zh")=>currLang = locale[l];
  
export default {
    use
}