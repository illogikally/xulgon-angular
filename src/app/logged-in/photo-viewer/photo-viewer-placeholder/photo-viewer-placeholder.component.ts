import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import { PhotoViewResponse } from 'src/app/shared/components/photo/photo-view-response';
import {PostViewService} from "../../../post-view/post-view.service";
import {filter, throttleTime} from "rxjs/operators";
import {MessageService} from "../../../shared/services/message.service";

@Component({
  selector: 'app-photo-viewer-placeholder',
  templateUrl: './photo-viewer-placeholder.component.html',
  styleUrls: ['./photo-viewer-placeholder.component.scss']
})
export class PhotoViewerPlaceholderComponent implements OnInit {


  id!: number;
  setId?: number;
  openPhotoViewer$ = new Subject<any>();
  photo: PhotoViewResponse | null = null;
  constructor(
    private postViewService: PostViewService,
    private messageService: MessageService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.getPhotoDataFromRoute();
    this.onRouteReuse().subscribe(route => this.postViewService.highlight(route));
    this.postViewService.highlight(this.route.snapshot);
  }

  onDetach() {
    this.postViewService.highlight$.next(null);
  }

  onAttach() {
    this.openPhotoViewer$.next();
    this.postViewService.highlight(this.route.snapshot);
  }

  getPhotoDataFromRoute() {
    this.photo = this.route.snapshot.data.photo;
    const paramMap = this.route.snapshot.paramMap;
    const queryParamMap = this.route.snapshot.queryParamMap;
    const photoId = Number(paramMap.get('id'));
    const photoSetId = queryParamMap.get('set');
    this.id = photoId;
    this.setId = Number(photoSetId) || undefined;
  }

  onRouteReuse(): Observable<any> {
    return this.messageService.routeReuse$.pipe(
      filter(route => this.compareRoute(route, this.route.snapshot)),
      // Get called twice?
      throttleTime(1e3)
    );
  }

  compareRoute(
    left: ActivatedRouteSnapshot,
    right: ActivatedRouteSnapshot
  ): boolean {
    return left.routeConfig?.path == right.routeConfig?.path;
  }
}
