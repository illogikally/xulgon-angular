import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sirv'
})
export class SirvPipe implements PipeTransform {
  transform(url: string | undefined | null, size: 40 | 100 | 200 | 400 | 600 | 900): string {
    if (!url) return '';
    const name = url.split('/').slice(-1)[0];
    const query = `?scale.option=fill&w=${size}&h=${size}`;
    return `https://xulgon.sirv.com/${name}${query}`;
  }
}
