import { TestBed } from "@angular/core/testing";
import { RideService } from "./ride.service";
import { Ride } from "../models/ride.model";

describe("RideService", () => {
  let service: RideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RideService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should initialize with mock rides", () => {
    expect(service.rides().length).toBeGreaterThan(0);
  });

  it("should add a new ride", () => {
    const initialCount = service.rides().length;
    const newRide: Omit<Ride, "id" | "bookedByEmployeeIds"> = {
      providerEmployeeId: "EMP_NEW",
      vehicleType: "Car",
      vehicleNo: "TS-NEW-1234",
      vacantSeats: 4,
      time: "12:00",
      pickupPoint: "Point A",
      destination: "Point B",
    };

    const result = service.addRide(newRide);

    expect(result.success).toBe(true);
    expect(result.message).toBe("Ride offered successfully!");
    expect(service.rides().length).toBe(initialCount + 1);

    const addedRide = service
      .rides()
      .find((r) => r.providerEmployeeId === "EMP_NEW");
    expect(addedRide).toBeDefined();
    expect(addedRide?.id).toBeDefined();
    expect(addedRide?.bookedByEmployeeIds).toEqual([]);
  });

  describe("bookRide", () => {
    it("should book a ride successfully", () => {
      // Find a ride with vacant seats that is not provided by the booker
      const rideToBook = service
        .rides()
        .find(
          (r) => r.vacantSeats > 0 && r.providerEmployeeId !== "EMP_BOOKER"
        );
      if (!rideToBook)
        throw new Error("No suitable ride found for testing booking");

      const initialSeats = rideToBook.vacantSeats;
      const result = service.bookRide(rideToBook.id, "EMP_BOOKER");

      expect(result.success).toBe(true);
      expect(result.message).toBe("Ride booked successfully!");

      const updatedRide = service.rides().find((r) => r.id === rideToBook.id);
      expect(updatedRide?.vacantSeats).toBe(initialSeats - 1);
      expect(updatedRide?.bookedByEmployeeIds).toContain("EMP_BOOKER");
    });

    it("should fail if ride not found", () => {
      const result = service.bookRide("NON_EXISTENT_ID", "EMP_BOOKER");
      expect(result.success).toBe(false);
      expect(result.message).toBe("Ride not found.");
    });

    it("should fail if provider tries to book own ride", () => {
      const ride = service.rides()[0];
      const result = service.bookRide(ride.id, ride.providerEmployeeId);

      expect(result.success).toBe(false);
      expect(result.message).toBe("You cannot book your own ride.");
    });

    it("should fail if already booked by user", () => {
      const ride = service.rides()[0];
      // Ensure we are not the provider
      const bookerId = "EMP_OTHER";
      if (ride.providerEmployeeId === bookerId) return; // Skip if coincidence

      // First booking
      service.bookRide(ride.id, bookerId);

      // Second booking attempt
      const result = service.bookRide(ride.id, bookerId);

      expect(result.success).toBe(false);
      expect(result.message).toBe("You have already booked this ride.");
    });

    it("should fail if no seats available", () => {
      // Create a ride with 1 seat
      const newRide: Omit<Ride, "id" | "bookedByEmployeeIds"> = {
        providerEmployeeId: "EMP_FULL",
        vehicleType: "Car",
        vehicleNo: "TS-FULL-1234",
        vacantSeats: 1,
        time: "12:00",
        pickupPoint: "Point A",
        destination: "Point B",
      };
      service.addRide(newRide);
      const addedRide = service
        .rides()
        .find((r) => r.providerEmployeeId === "EMP_FULL")!;

      // Book the only seat
      service.bookRide(addedRide.id, "EMP_1");

      // Try to book again
      const result = service.bookRide(addedRide.id, "EMP_2");

      expect(result.success).toBe(false);
      expect(result.message).toBe("No seats available.");
    });
  });
});
