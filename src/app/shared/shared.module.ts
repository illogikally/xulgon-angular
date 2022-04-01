import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from "./components/button/button.component";
import {CardHeaderComponent} from "./components/card-header/card-header.component";
import {LabelComponent} from "./components/label/label.component";
import {ModalComponent} from "./components/modal/modal.component";
import {PhotoComponent} from "./components/photo/photo.component";
import {PopupComponent} from "./components/popup/popup.component";
import {ToasterComponent} from "./components/toaster/toaster.component";
import {SpinnerComponent} from "./components/spinner/spinner.component";
import {UserRefComponent} from "./components/user-ref/user-ref.component";
import {UserRefPopupComponent} from "./components/user-ref/user-ref-popup/user-ref-popup.component";
import {SquareImageComponent} from "./components/square-image/square-image.component";
import {FriendshipButtonComponent} from "./components/friendship-button/friendship-button.component";
import {ProfileAboutComponent} from "./components/profile-about/profile-about.component";
import {ProfileAboutItemComponent} from "./components/profile-about/profile-about-item/profile-about-item.component";
import {ClickOutsideModule} from "ng-click-outside";
import {ImageCropperModule} from "ngx-image-cropper";
import {EmojiModule} from "@ctrl/ngx-emoji-mart/ngx-emoji";
import {PickerModule} from "@ctrl/ngx-emoji-mart";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LabelDirective} from "./components/label/label.directive";
import {SirvPipe} from "./pipes/sirv.pipe";
import {PhotoListComponent} from "../profile/photo-list/photo-list.component";
import {PhotoListItemComponent} from "../profile/photo-list/photo-list-item/photo-list-item.component";
import {TabBarComponent} from "./tab-bar/tab-bar.component";
import {RouterModule} from "@angular/router";
import {StickySidebarDirective} from "./directives/sticky-sidebar.directive";
import {GroupCreatePostComponent} from "./components/group-create-post/group-create-post.component";
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    ButtonComponent,
    CardHeaderComponent,
    LabelComponent,
    ModalComponent,
    PhotoComponent,
    PopupComponent,
    SpinnerComponent,
    ToasterComponent,
    UserRefComponent,
    PhotoListComponent,
    PhotoListItemComponent,
    UserRefPopupComponent,
    SquareImageComponent,
    ProfileAboutComponent,
    GroupCreatePostComponent,
    ProfileAboutItemComponent,
    FriendshipButtonComponent,
    SirvPipe,
    LabelDirective,
    TabBarComponent,
    StickySidebarDirective,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    ClickOutsideModule,
    ImageCropperModule,
    EmojiModule,
    PickerModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  exports: [
    StickySidebarDirective,
    TabBarComponent,
    ClickOutsideModule,
    ButtonComponent,
    CardHeaderComponent,
    PhotoListComponent,
    LabelComponent,
    LabelDirective,
    SidebarComponent,
    SirvPipe,
    GroupCreatePostComponent,
    ProfileAboutComponent,
    ModalComponent,
    PhotoComponent,
    PopupComponent,
    SpinnerComponent,
    ToasterComponent,
    UserRefComponent,
    UserRefPopupComponent,
    SquareImageComponent,
    FriendshipButtonComponent,
  ]
})
export class SharedModule { }
