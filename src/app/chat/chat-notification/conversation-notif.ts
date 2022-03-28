import {UserBasic} from "../../shared/models/user-basic";
import {ChatMessage} from "../chat-box/chat-msg/chat-msg";

export interface ConversationNotif {
  id: number;
  user: UserBasic;
  latestMessage: ChatMessage;
}
