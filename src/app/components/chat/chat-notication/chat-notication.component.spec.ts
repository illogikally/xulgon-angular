import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatNoticationComponent } from './chat-notication.component';

describe('ChatNoticationComponent', () => {
  let component: ChatNoticationComponent;
  let fixture: ComponentFixture<ChatNoticationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatNoticationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatNoticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
