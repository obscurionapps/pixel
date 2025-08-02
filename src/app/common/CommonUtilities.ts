import { LocalStorageConstant } from '../common/constants';
import { PartsMatrix } from '../models/partsMatrix';
import { Injectable } from '@angular/core';
import { PartSpecDetail } from '../models/PartSpecDetail';
import { ReportedIssues } from '../models/reportedIssue';
import { AccountRequest, Matrix } from '../models/Custom';
export class CommonUtilities {
    @Injectable({
        providedIn: 'root'
    })
    partsMatrixData: PartsMatrix[] = [];
    partspecDetail: PartSpecDetail[] = [];
    reportedIssues: ReportedIssues[] = [];
    reportedIssues_user: ReportedIssues[] = [];
    accountRequests:AccountRequest[]=[];
    matrixDetail : Matrix[]=[];
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
        } else {
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
    getRole(): string {
        return localStorage.getItem(LocalStorageConstant.UserRole) ?? "";
    }
    getReportedIssuesFromLocalStorage(): ReportedIssues[] {
        const reportedIssues_detail = localStorage.getItem(LocalStorageConstant.reportedIssues);
        if (reportedIssues_detail != null && reportedIssues_detail != "" && reportedIssues_detail != undefined) {
            this.reportedIssues = JSON.parse(reportedIssues_detail);
        }
        else {
            this.reportedIssues = [];
        }
        return this.reportedIssues;
    }
    getReportedIssuesFromLocalStorageForUser(): ReportedIssues[] {
        const reportedIssues_detail = localStorage.getItem(LocalStorageConstant.reportedIssuesUser);
        if (reportedIssues_detail != null && reportedIssues_detail != "" && reportedIssues_detail != undefined) {
            this.reportedIssues_user = JSON.parse(reportedIssues_detail);
        }
        else {
            this.reportedIssues_user = [];
        }
        return this.reportedIssues_user;
    }
    parseDate(str: string): Date {
        const [day, month, year] = str.split('/').map(Number);
        return new Date(year, month - 1, day); // Month is 0-indexed
    }
    areDatesEqual(dateStr1: string, dateStr2: string): boolean {
        const date1 = this.parseDate(dateStr1);
        const date2 = this.parseDate(dateStr2);
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    }
    isDateBetween(target: string, start: string, end: string): boolean {
        const targetDate = this.parseDate(target);
        const startDate = this.parseDate(start);
        const endDate = this.parseDate(end);

        return targetDate >= startDate && targetDate <= endDate;
    }
    getBase64Image(file: File, callback: any) {
        const reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        };
        reader.readAsDataURL(file);
    }
    convertToDDMMYYYY(dateStr: string): string {
        const [month, day, year] = dateStr.split('/');
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
    removeDuplicatesByKey<T>(array: T[], key: keyof T): T[] {
        const seen = new Set();
        return array.filter(item => {
            const val = item[key];
            if (seen.has(val)) {
                return false;
            }
            seen.add(val);
            return true;
        });
    }
    getAccountRequests():AccountRequest[]
    {
       const req  = localStorage.getItem(LocalStorageConstant.AccountRequests);
       if(req != null && req!=undefined && req.length > 0){
        this.accountRequests = JSON.parse(req);
       }
       else{
        this.accountRequests = [];
       }
       return this.accountRequests;
    }
    getMatrixDetails():Matrix[]{
        const matrix = localStorage.getItem(LocalStorageConstant.MatrixDetails);
        if(matrix != null && matrix != undefined && matrix.length > 0){
            this.matrixDetail = JSON.parse(matrix);
        }
        else{
            this.matrixDetail = [];
        }
        return this.matrixDetail;
    }
}