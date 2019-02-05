import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RequestService {
    headers: any;
    timeout: number = 50000;
    constructor(private http: HttpClient) {
    }
    parseHeaders(options: any = {}, header: any = {}) {
        if (options['headers']) {
            for (var key in options['headers']) {
                header[key] = options['headers'][key];
            }
        }
        return header;
    }
    prepareBasicAuth(options: any = {}, header: any = {}) {
        header['Authorization'] = "Basic " + btoa("webadmin:tr1@nzadm1npa55");
        return header;
    }
    get(url: string, options: object) {
        let header: any = {};
        header = this.parseHeaders(options, header);
        // header = this.prepareBasicAuth(options, header)
        this.headers = new HttpHeaders(header);
        options['headers'] = this.headers;
        return this.http.get(url, options);
    }
    delete(url: string, options: object) {
        let header: any = {};
        header = this.parseHeaders(options, header);
        header = this.prepareBasicAuth(options, header)
        this.headers = new HttpHeaders(header);
        options['headers'] = this.headers;
        return this.http.delete(url, options);
    }
    post(url: string, data: object, options: object, basic = true) {
        let header: any = {};
        header = this.parseHeaders(options, header);
        if(basic)
            header = this.prepareBasicAuth(options, header);
        this.headers = new HttpHeaders(header);
        options['headers'] = this.headers;
        return this.http.post(url, data, options);
    }
    put(url: string, data: object, options: object) {
        let header: any = {};
        header = this.parseHeaders(options, header);
        header = this.prepareBasicAuth(options, header)
        this.headers = new HttpHeaders(header);
        options['headers'] = this.headers;
        return this.http.put(url, data, options);
    }
}