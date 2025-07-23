import { LocalStorageConstant } from '../common/constants';
import { PartsMatrix } from '../models/partsMatrix';
import { Injectable } from '@angular/core';
export class CommonUtilities {
    @Injectable({
        providedIn: 'root'
    })
    partsMatrixData: PartsMatrix[] = [];
    getPartsMatrixDetailFromLocalStorage(): PartsMatrix[] {
        if (localStorage.getItem(LocalStorageConstant.partMatrixDetail) && localStorage.getItem(LocalStorageConstant.partMatrixDetail) != undefined) {
            if (localStorage.getItem(LocalStorageConstant.partMatrixDetail) != null) {
                this.partsMatrixData = JSON.parse(localStorage.getItem(LocalStorageConstant.partMatrixDetail) ?? "");
            }
        }
        return this.partsMatrixData;
    }
}