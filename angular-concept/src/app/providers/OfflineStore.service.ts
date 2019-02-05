import { Injectable } from '@angular/core';

@Injectable()
export class OfflineStoreService {
    public paths: object = {};
    public Breadcrumb: Array<string> = [];

    constructor() { }

    public store(key, value) {
        this.paths[key] = value
    }

    public fetch(key) {
        return this.paths[key];
    }

}
