import { BaseTable } from '../../common/entity/base-table.entity';
import { User } from '../../user/entity/user.entity';
import { ChatRoom } from './chat-room.entity';
export declare enum MessageType {
    text = "text",
    image = "image",
    file = "file",
    system = "system"
}
export declare class ChatMessage extends BaseTable {
    id: number;
    chatRoomId: number;
    chatRoom: ChatRoom;
    senderId: number;
    sender: User;
    messageType: MessageType;
    content: string;
    attachmentUrl: string;
    attachmentName: string;
    attachmentSize: number;
}
