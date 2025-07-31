export class PartSpecDetail{
    id:string;
    part_number:string;
    control_plan_no:string;
    drawing_no:string;
    issue:string;
    spec_json:SpecJSON;
    remedy:string;
    is_active:string;
    created_date:string;
    created_by:string;
    mod_date:string;
    mod_by:string;
    constructor(){
        this.id = '';
        this.part_number = '';
        this.control_plan_no = '';
        this.drawing_no = '';
        this.issue = '';
        this.spec_json = new SpecJSON();
        this.remedy = '';
        this.is_active = '';
        this.created_date = '';
        this.mod_date = '';
        this.created_by = '';
        this.mod_by = '';
    }
}
export class SpecJSON{
    specification:string;
    actualValue:string;
    outputValue:string;
    id:string;
    constructor(){
        this.specification = '';
        this.actualValue = '';
        this.outputValue = '';
        this.id='';
    }
}
export class specification{
    specification:string;
    actualValue:string;
    outputValue:string;
    id:string;
     constructor(){
        this.specification = '';
        this.actualValue = '';
        this.outputValue = '';
        this.id = '';
    }
}
export class partSpecification{
    specification:string;
    actualValue:ActualValue[];
    id:string;
     constructor(){
        this.specification = '';
        this.actualValue = [];
        this.id = '';
    }
}
export class ActualValue{
    value:string;
    isValid:boolean;
    constructor(value:string, isValid:boolean){
        this.value = value;
        this.isValid=isValid;
    }
}