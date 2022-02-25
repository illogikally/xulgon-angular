import { NotificationType } from "./notification-type";

export interface Notification {
  id: number;
  createdAgo: string;
  type: string;
  isRead: boolean;

  actorId: number;
  actorFullName: string;
  actorAvatarUrl: string;
  actorCount: number;
  actorContentId: number;
  actorContentBody: string;

  recipientContentId: number;
  recipientContentBody: string;
  recipientContentType: string;

  rootContentId: number;
  rootContentType: string;

  pageId: number;
  pageType: string;
}
