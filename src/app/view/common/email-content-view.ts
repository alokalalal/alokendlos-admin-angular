import { ArchiveView } from './archive-view';
import { KeyValueView } from './key-value-view';

export class EmailContentView extends ArchiveView{

    public emailAccountView? : KeyValueView;
	public content? : string;
	public subject? : string;
	public emailBcc? : string;
	public emailCc? : string;
	public notificationView? : KeyValueView;

    constructor(view?: EmailContentView){
        super(view);
        if(view != undefined){
            this.emailAccountView = view.emailAccountView
            this.content = view.content
            this.subject = view.subject
            this.emailBcc = view.emailBcc
            this.emailCc = view.emailCc
            this.notificationView = view.notificationView
        }
    }
}

export const EmailContentTemplate = {
    id: Number(),
    subject: "",
    content: "",
    emailAccountView: {key: "", value:""},
    emailBcc: "",
    emailCc: "",
    notificationView: {id: Number(), name: "", email: false, push: false}
}