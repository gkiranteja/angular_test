import { Injectable } from '@angular/core';
import { RequestService } from './request.service';

@Injectable()
export class Base64 {
    public paths: object = {};

    constructor(private request: RequestService) { }

    encode(url) {
        this.request.get('file:///' + url, { responseType: 'blob' }).subscribe(
            (data: Blob) => {
                var reader = new FileReader();
                reader.onloadend = function () {
                    return reader.result;
                }
                reader.readAsDataURL(data);
            },
            (err) => {
                console.log('Error in encoding image');
            }
        );
    }

}
