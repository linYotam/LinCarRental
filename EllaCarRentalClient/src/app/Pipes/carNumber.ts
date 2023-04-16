import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'CarNumber'
})
export class CarNumberPipe implements PipeTransform {

  //Convert car number string to this format: XX-XXX-XX OR XXX-XX-XXX
  transform(carNumber: string): string {
   return carNumber.length === 7 ?
   carNumber.replace(/(\d{2})(\d{3})(\d{2})/, '$1-$2-$3') :
    carNumber.replace(/(\d{3})(\d{2})(\d{3})/, '$1-$2-$3');
  }
}
 