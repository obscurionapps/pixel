import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageConstant, methodConstant } from '../common/constants';

@Injectable({
    providedIn: 'root'
})
export class ScriptService {
    private scriptUrl_dev = 'https://script.google.com/macros/s/AKfycbzw013KfE6SBQzLsIgJn4Ip3FRaWirgkJIgzy8RSdXJza_ezxrQO_pExfpp_McbUy0g/exec';
    private scriptUrl_prod = 'https://script.google.com/macros/s/AKfycbyhIiXfsdouYXhbZjf8Hq-vFg90H4ldAYTtUlQadrh18wPR0uhlEGXDONRoHOX1zVdzeA/exec';
    constructor(private http: HttpClient) { }
    getData() {
        return this.http.get(this.scriptUrl_prod);
    }
    post(method: string, payload: any) {
        const body = new URLSearchParams();
        if (method !== methodConstant.Authentication) {
            body.set('access_token', localStorage.getItem(LocalStorageConstant.AccessToken) ?? '');
        }
        body.set('method', method);
        body.set('payload', JSON.stringify({ payload }));
        return this.http.post(this.scriptUrl_prod, body.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }
}