import { ReactionType } from "./reaction-type";

export interface ReactionPayload {
  type: ReactionType;
  contentId: number;
}