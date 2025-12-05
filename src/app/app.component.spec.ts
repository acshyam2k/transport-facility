import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { NotificationService } from "./core/services/notification.service";
import { HeaderComponent } from "./layout/header/header.component";
import { RouterOutlet, provideRouter } from "@angular/router";
import { signal } from "@angular/core";

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let notificationServiceMock: any;

  beforeEach(async () => {
    notificationServiceMock = {
      notification: signal(null),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent, HeaderComponent, RouterOutlet],
      providers: [
        { provide: NotificationService, useValue: notificationServiceMock },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the app", () => {
    expect(component).toBeTruthy();
  });

  it("should have notification signal initialized", () => {
    expect(component.notification()).toBeNull();
  });
});
