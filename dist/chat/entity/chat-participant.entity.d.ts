import { BaseTable } from '../../common/entity/base-table.entity';
import { User } from '../../user/entity/user.entity';
import { ChatRoom } from './chat-room.entity';
export declare class ChatParticipant extends BaseTable {
    id: number;
    chatRoomId: number;
    chatRoom: ChatRoom;
    userId: number;
    user: User;
    isActive: boolean;
    isNotificationEnabled: boolean;
    lastReadMessageId: number;
    joinedAt: Date;
    leftAt: Date;
}
