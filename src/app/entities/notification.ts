
export class Notification{
    id: number;
    name: string;
    email : boolean;
    push : boolean;
    constructor(notification: Notification){
        this.id = notification.id
        this.name = notification.name;
        this.email = notification.email;
        this.push = notification.push;  
    }
}

export const NotificationTemplate = {
    id: Number(),
    name: '',
    email: false,
    push: false,
}