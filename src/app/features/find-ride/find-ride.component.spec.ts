import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FindRideComponent } from "./find-ride.component";
import { RideService } from "../../core/services/ride.service";
import { NotificationService } from "../../core/services/notification.service";
import { signal } from "@angular/core";
import { Ride } from "../../core/models/ride.model";

describe("FindRideComponent", () => {
  let component: FindRideComponent;
  let fixture: ComponentFixture<FindRideComponent>;
  let rideServiceMock: any;
  let notificationServiceMock: any;

  const mockRides: Ride[] = [
    {
      id: "1",
      providerEmployeeId: "EMP001",
      vehicleType: "Car",
      vehicleNo: "AB-12-CD-3456",
      vacantSeats: 3,
      time: "10:00",
      pickupPoint: "A",
      destination: "B",
      bookedByEmployeeIds: [],
    },
  ];

  beforeEach(async () => {
    rideServiceMock = {
      rides: signal(mockRides),
      bookRide: jest.fn(),
    };

    notificationServiceMock = {
      show: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FindRideComponent],
      providers: [
        { provide: RideService, useValue: rideServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FindRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with default filter values", () => {
    expect(component.filterVehicleType()).toBe("All");
    expect(component.selectedRideForBooking()).toBeNull();
  });

  it("should filter rides correctly", () => {
    // Mock current time to match the ride time roughly
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2023-01-01T10:00:00"));

    // Re-trigger computed
    component.filterVehicleType.set("Car");
    fixture.detectChanges();

    const filtered = component.filteredRides();
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe("1");

    jest.useRealTimers();
  });

  it("should open booking modal", () => {
    const ride = mockRides[0];
    component.openBookingModal(ride);
    expect(component.selectedRideForBooking()).toEqual(ride);
    expect(component.isBookingModalOpen()).toBe(true);
  });

  it("should close booking modal", () => {
    component.selectedRideForBooking.set(mockRides[0]);
    component.closeBookingModal();
    expect(component.selectedRideForBooking()).toBeNull();
  });

  it("should confirm booking successfully", () => {
    const ride = mockRides[0];
    component.selectedRideForBooking.set(ride);
    component.bookingEmployeeId.set("EMP999");

    rideServiceMock.bookRide.mockReturnValue({
      success: true,
      message: "Booked",
    });

    component.confirmBooking();

    expect(rideServiceMock.bookRide).toHaveBeenCalledWith(ride.id, "EMP999");
    expect(notificationServiceMock.show).toHaveBeenCalledWith(
      "Booked",
      "success"
    );
    expect(component.selectedRideForBooking()).toBeNull();
  });

  it("should show error if employee ID is invalid", () => {
    const ride = mockRides[0];
    component.selectedRideForBooking.set(ride);
    component.bookingEmployeeId.set("INVALID");

    component.confirmBooking();

    expect(notificationServiceMock.show).toHaveBeenCalledWith(
      expect.stringContaining("Invalid Employee ID"),
      "error"
    );
    expect(rideServiceMock.bookRide).not.toHaveBeenCalled();
  });
});
