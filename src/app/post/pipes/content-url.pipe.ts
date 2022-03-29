import { Pipe, PipeTransform } from '@angular/core';
import { PhotoViewResponse } from 'src/app/shared/components/photo/photo-view-response';
import { Post } from '../post';

@Pipe({
  name: 'contentUrl'
})
export class ContentUrlPipe implements PipeTransform {

  transform(content: Post | PhotoViewResponse): string {
    const isGroupPost = content.pageType == 'GROUP';
    const isPost = content.type == 'POST';
    return isPost
      ? `${isGroupPost ? '/groups' : ''}/${content.pageId}/posts/${content.id}`
      : `/photo/${content.id}`;
  }

}
