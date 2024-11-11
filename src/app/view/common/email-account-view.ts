import { ArchiveView } from './archive-view';
import { KeyValueView } from './key-value-view';

export class EmailAccountView extends ArchiveView{
    public name? : string;
	public host? : string;
	public port? : number;
	public userName? : string;
	public password? : string;
	public replyToEmail? : string;
	public emailFrom? : string;
	public ratePerHour? : number;
	public updateRatePerHour? : number;
	public ratePerDay? : number;
	public updateRatePerDay? : number;
	public authenticationMethod? : KeyValueView;
	public authenticationSecurity? : KeyValueView;
	public timeOut? : number;
    
    constructor(view?: EmailAccountView){
        super(view);
        if(view != undefined){
            this.name = view.name
            this.host = view.host
            this.port = view.port
            this.userName = view.userName
            this.password = view.password
            this.replyToEmail = view.replyToEmail
            this.emailFrom = view.emailFrom
            this.ratePerHour = view.ratePerHour
            this.updateRatePerHour = view.updateRatePerHour
            this.ratePerDay = view.ratePerDay
            this.updateRatePerDay = view.updateRatePerDay
            this.authenticationMethod = view.authenticationMethod
            this.authenticationSecurity = view.authenticationSecurity
            this.timeOut = view.timeOut
        }
    }
}