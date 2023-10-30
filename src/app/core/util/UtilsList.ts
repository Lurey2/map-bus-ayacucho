export class UtilsList {
    
    static PushIndex(list: any[], index : number , indexChange :number) {
        
        let newList = [];
        if (index < indexChange) {
            newList =  list.slice(0 , index );
            const firstList = list.slice(index + 1 , indexChange + 1);
            firstList.push(list[index])
            const secondList = list.slice(indexChange  + 1 , list.length);
            newList = newList.concat(firstList , secondList);
        } else  if(index > indexChange){
            newList =  list.slice(0 , indexChange );
            newList.push(list[index])
            const firstList = list.slice(indexChange , index);
            const secondList = list.slice(index +1   , list.length);
            newList = newList.concat(firstList , secondList);
        }
        return  newList;
    }
}