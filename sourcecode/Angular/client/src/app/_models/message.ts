export interface Message{
    id: number;
    senderId: number;
    senderName: string ;
    senderAvatarPath: string ;
    recipientId: number;
    recipientName:  string ;
    recipientAvatarPath: string;
    content: string;
    created: Date;
    read?: Date;
   
}