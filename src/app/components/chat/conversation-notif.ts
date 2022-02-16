import {UserBasic} from "../share/user-basic";
import {ChatMessage} from "./chat-msg";

export interface ConversationNotif {
  id: number;
  user: UserBasic;
  latestMessage: ChatMessage;
}
