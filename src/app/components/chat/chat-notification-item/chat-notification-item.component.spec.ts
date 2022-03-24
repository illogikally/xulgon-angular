import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ChatNotificationItemComponent} from './chat-notification-item.component';


describe('ChatNotificationItemComponent', () => {
  let component: ChatNotificationItemComponent;
  let fixture: ComponentFixture<ChatNotificationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatNotificationItemComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatNotificationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
