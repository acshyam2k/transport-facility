import { TestBed } from "@angular/core/testing";
import { NotificationService } from "./notification.service";

describe("NotificationService", () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should initialize with null notification", () => {
    expect(service.notification()).toBeNull();
  });

  it("should show notification and clear it after 3 seconds", () => {
    jest.useFakeTimers();

    service.show("Test Message", "success");

    expect(service.notification()).toEqual({
      message: "Test Message",
      type: "success",
    });

    // Fast-forward time by 3 seconds
    jest.advanceTimersByTime(3000);

    expect(service.notification()).toBeNull();

    jest.useRealTimers();
  });
});
