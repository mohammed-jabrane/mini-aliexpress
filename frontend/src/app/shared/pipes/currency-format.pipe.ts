import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
})
export class CurrencyFormatPipe implements PipeTransform {
  private currencyPipe = new CurrencyPipe('en-US');

  transform(
    value: number | string | null | undefined,
    currencyCode = 'USD',
    display: 'code' | 'symbol' | 'symbol-narrow' | string | boolean = 'symbol',
    digitsInfo = '1.2-2',
    locale?: string,
  ): string | null {
    return this.currencyPipe.transform(value, currencyCode, display, digitsInfo, locale);
  }
}
