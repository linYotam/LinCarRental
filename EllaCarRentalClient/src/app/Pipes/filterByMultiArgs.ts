import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByMultiArgs'
})
export class FiltermultiPipe implements PipeTransform {

  //Not in use...
  transform(myobjects: Array<object>, filter: boolean, args?: Array<object>, deeperKey?: string): any {
      if (args && Array.isArray(myobjects ) && filter && typeof args === 'object' ) {
        let returnobjects = myobjects;
          args.forEach(filterobj => {
            const filterkey = Object.keys(filterobj)[0];
            const filtervalue = filterobj[filterkey];
            myobjects.forEach(function (objectToFilter) {
              if (deeperKey) {
                if (objectToFilter[deeperKey][filterkey] !== filtervalue && filtervalue !== '') {
                  returnobjects = returnobjects.filter(obj => obj !== objectToFilter);
                }
              } else {
                if (objectToFilter[filterkey] !== filtervalue && filtervalue !== '') {
                  returnobjects = returnobjects.filter(obj => obj !== objectToFilter);
                }
              }
            });
          });
          return returnobjects;
      } else {
        return myobjects;
      }
    }
  }
 