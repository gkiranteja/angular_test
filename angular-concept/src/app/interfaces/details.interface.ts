import { Optional } from "@angular/core";

export interface reportData {
    index: object,
    purchased: boolean,
    data: object,
    fullScreen: boolean,
    orgData?: Array<object>,
    roleAccess: string,
    price:number;
}