import { partSpecification } from "./PartSpecDetail";

export class Actions{
    id:string;
    action:string;
    constructor(){
        this.id='';
        this.action ='';
    }
}
export class defect_image{
    filename:string | ArrayBuffer | null;
    image_data:string | ArrayBuffer | null;
    id:string;
    issue_id:string;
    action:string;
    constructor(){
        this.id='';
        this.filename = '';
        this.image_data = null;
        this.issue_id = '';
        this.action = '';
    }
}
export class CommonPartDetail{
    part_number:string;
    control_plan_no:string;
    drawing_number:string;
    createdby:string;
    constructor(){
        this.part_number ='';
        this.control_plan_no='';
        this.drawing_number='';
        this.createdby='';
    }
}
export class reportView{
    date:string;
    problem:string;
    specification:partSpecification[];
    actions:Actions[];
    impact:string;
    remarks:string;
    image:string;
    issue_type:string;
    disposition:string;
    constructor(){
        this.date='';
        this.problem='';
        this.specification = [],
        this.actions=[],
        this.image='';
        this.impact='';
        this.remarks='';
        this.issue_type='';
        this.disposition='';
    }
}
export class AccountRequest{
    firstname:string;
    lastname:string;
    id:string;
    email:string;
    is_read:string;
    constructor(){
        this.firstname='';
        this.lastname='';
        this.email='';
        this.id='';
        this.is_read='';
    }
}