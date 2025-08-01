import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageConstant, methodConstant } from '../common/constants';

@Injectable({
    providedIn: 'root'
})
export class ScriptService {
    private scriptUrl = 'https://script.google.com/macros/s/AKfycbzgj06Tt9sSeEgM43CJHIMJunaHaTcZ-Iz0K2iwyOytl74QFjN7CJovsIh7AHmhgXfw/exec';

    constructor(private http: HttpClient) { }
    getData() {
        return this.http.get(this.scriptUrl);
    }
    post(method: string, payload: any) {
        const body = new URLSearchParams();
        if (method !== methodConstant.Authentication) {
            body.set('access_token', localStorage.getItem(LocalStorageConstant.AccessToken) ?? '');
        }
        body.set('method', method);
        body.set('payload', JSON.stringify({ payload }));
        return this.http.post(this.scriptUrl, body.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }
}

