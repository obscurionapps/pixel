import { LocalStorageConstant } from '../common/constants';
import { PartsMatrix } from '../models/partsMatrix';
import { Injectable } from '@angular/core';
import { PartSpecDetail } from '../models/PartSpecDetail';
export class CommonUtilities {
    @Injectable({
        providedIn: 'root'
    })
    partsMatrixData: PartsMatrix[] = [];
    partspecDetail: PartSpecDetail[] = [];
    getPartsMatrixDetailFromLocalStorage(): PartsMatrix[] {
        if (localStorage.getItem(LocalStorageConstant.partMatrixDetail) && localStorage.getItem(LocalStorageConstant.partMatrixDetail) != undefined) {
            if (localStorage.getItem(LocalStorageConstant.partMatrixDetail) != null) {
                this.partsMatrixData = JSON.parse(localStorage.getItem(LocalStorageConstant.partMatrixDetail) ?? "");
                return this.partsMatrixData;
            }
        }
        return [];
    }
    getPartSpecDetailFromLocalStorage(): PartSpecDetail[] {
        if (localStorage.getItem(LocalStorageConstant.partSpecDetail) && localStorage.getItem(LocalStorageConstant.partSpecDetail) != undefined) {
            if (localStorage.getItem(LocalStorageConstant.partSpecDetail) != null) {
                this.partspecDetail = JSON.parse(localStorage.getItem(LocalStorageConstant.partSpecDetail) ?? "");
                return this.partspecDetail;
            }
        }else{
            this.partspecDetail = [];
        }
        return [];
    }
    isAccessEnabled(): boolean {
        var is_access = false;
        if (localStorage.getItem(LocalStorageConstant.AccessToken)) {
            is_access = true;
        }
        else {
            is_access = false;
        }
        return is_access;
    }
    generateGUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    getRole():string
    {
        return localStorage.getItem(LocalStorageConstant.UserRole) ?? "";
    }
}