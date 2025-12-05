import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OfferRideComponent } from "./offer-ride.component";
import { RideService } from "../../core/services/ride.service";
import { NotificationService } from "../../core/services/notification.service";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

describe("OfferRideComponent", () => {
  let component: OfferRideComponent;
  let fixture: ComponentFixture<OfferRideComponent>;
  let rideServiceMock: any;
  let notificationServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    rideServiceMock = {
      addRide: jest.fn(),
    };

    notificationServiceMock = {
      show: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [OfferRideComponent, ReactiveFormsModule],
      providers: [
        { provide: RideService, useValue: rideServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OfferRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form with default values", () => {
    expect(component.addRideForm).toBeDefined();
    expect(component.addRideForm.get("vehicleType")?.value).toBe("Car");
    expect(component.addRideForm.get("vacantSeats")?.value).toBe(1);
  });

  it("should show error if form is invalid on submit", () => {
    component.onAddRideSubmit();
    expect(notificationServiceMock.show).toHaveBeenCalledWith(
      expect.stringContaining("Please fill"),
      "error"
    );
    expect(rideServiceMock.addRide).not.toHaveBeenCalled();
  });

  it("should submit form successfully", () => {
    component.addRideForm.setValue({
      providerEmployeeId: "EMP123",
      vehicleType: "Car",
      vehicleNo: "TS-09-AB-1234",
      vacantSeats: 2,
      time: "09:00",
      pickupPoint: "Home",
      destination: "Office",
    });

    rideServiceMock.addRide.mockReturnValue({
      success: true,
      message: "Added",
    });

    component.onAddRideSubmit();

    expect(rideServiceMock.addRide).toHaveBeenCalled();
    expect(notificationServiceMock.show).toHaveBeenCalledWith(
      "Added",
      "success"
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(["/find"]);
  });
});
