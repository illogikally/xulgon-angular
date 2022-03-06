import { NotificationType } from "./notification-type";

export interface Notification {
  id: number;
  createdAgo: string;
  type: NotificationType;
  isRead: boolean;
  actorCount: number;

  actorId: number;
  actorFullName: string;
  actorAvatarUrl: string;
  actorContentId: number;

  targetContentId: number;
  targetContentBody: string;
  targetContentType: string;

  targetContentParentId: number;
  targetContentParentType: string;
  targetContentUserId: number;

  rootContentId: number;
  rootContentType: string;

  pageId: number;
  pageType: string;
  pageName: string;
}
