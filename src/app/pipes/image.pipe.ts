import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base = environment.apiUrl;

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(img: string, tipo: 'user'|'medicine'): string {

    
    if( img === null || img === '' ) {
      return '/assets/userNoImg.png'
    }else{
      let splitF = img.split('.');

      // console.log( `${ base }/images/users/${ splitF[0] }` )
      return  `${ base }/images/users/${ splitF[0] }`
    }
  }

}
