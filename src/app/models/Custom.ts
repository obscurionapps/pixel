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