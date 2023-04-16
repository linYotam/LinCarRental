import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberPipe'
})
export class NumberPipePipe implements PipeTransform {

  transform(val) {
    if (val) {
    val = this.format_number(val, '');
    }
    return val;
  }

  //Convert number to a formant with ',' after every 3 digits. for example -> 215745256 -> 215,745,256
  format_number(number, prefix) {
     // tslint:disable-next-line:prefer-const
     let thousand_separator = ',',
      // tslint:disable-next-line:prefer-const
      decimal_separator = '.',
      // tslint:disable-next-line:prefer-const
      regex = new RegExp('[^' + decimal_separator + '\\d]', 'g'),
      // tslint:disable-next-line:prefer-const
      number_string = number.replace(regex, '').toString(),
      // tslint:disable-next-line:prefer-const
      split = number_string.split(decimal_separator),
       // tslint:disable-next-line:prefer-const
      rest = split[0].length % 3,
      result = split[0].substr(0, rest),
       // tslint:disable-next-line:prefer-const
      thousands = split[0].substr(rest).match(/\d{3}/g);

    if (thousands) {
      const separator = rest ? thousand_separator : '';
      result += separator + thousands.join(thousand_separator);
    }
    result = split[1] !== undefined ? result + decimal_separator + split[1] : result;
    return prefix === undefined ? result : (result ? prefix + result : '');
  }
}
 