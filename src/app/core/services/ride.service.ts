import { Injectable, signal } from "@angular/core";
import { Ride } from "../models/ride.model";

@Injectable({
  providedIn: "root",
})
export class RideService {
  // Signal to hold the list of rides. Private to prevent direct modification from outside.
  private readonly _rides = signal<Ride[]>([]);

  // Public readonly signal for components to consume.
  public readonly rides = this._rides.asReadonly();

  public constructor() {
    // Initialize with some mock data for demonstration purposes.
    const now = new Date();
    const mockRides: Ride[] = [
      {
        id: "1",
        providerEmployeeId: "EMP101",
        vehicleType: "Car",
        vehicleNo: "TS-07-AB-1234",
        vacantSeats: 3,
        // Set time to current time
        time: `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
        pickupPoint: "Main Gate",
        destination: "Tech Park Phase 2",
        bookedByEmployeeIds: ["EMP205"],
      },
      {
        id: "2",
        providerEmployeeId: "EMP102",
        vehicleType: "Bike",
        vehicleNo: "AP-09-CD-5678",
        vacantSeats: 1,
        // Set time to 1 hour from now
        time: `${((now.getHours() + 1) % 24).toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
        pickupPoint: "Cafeteria",
        destination: "Downtown Station",
        bookedByEmployeeIds: [],
      },
      {
        id: "3",
        providerEmployeeId: "EMP103",
        vehicleType: "Car",
        vehicleNo: "TS-08-XY-9012",
        vacantSeats: 2,
        // Set time to 2 hours from now
        time: `${((now.getHours() + 2) % 24).toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
        pickupPoint: "Main Gate",
        destination: "City Center",
        bookedByEmployeeIds: [],
      },
    ];
    this._rides.set(mockRides);
  }

  /**
   * Adds a new ride to the list.
   * @param ride The ride details to add (excluding ID and bookings).
   * @returns An object indicating success or failure and a message.
   */
  public addRide(ride: Omit<Ride, "id" | "bookedByEmployeeIds">): {
    success: boolean;
    message: string;
  } {
    try {
      const newRide: Ride = {
        ...ride,
        // Generate a simple random ID. In production, the backend would assign this.
        id: Math.random().toString(36).substr(2, 9),
        bookedByEmployeeIds: [],
      };

      // Update the signal with the new ride
      this._rides.update((rides) => [...rides, newRide]);
      return { success: true, message: "Ride offered successfully!" };
    } catch (error) {
      console.error("Error adding ride:", error);
      return { success: false, message: "Failed to offer ride." };
    }
  }

  /**
   * Books a seat on a specific ride.
   * @param rideId The ID of the ride to book.
   * @param employeeId The ID of the employee booking the ride.
   * @returns An object indicating success or failure and a message.
   */
  public bookRide(
    rideId: string,
    employeeId: string
  ): { success: boolean; message: string } {
    let success = false;
    let message = "";

    this._rides.update((rides) =>
      rides.map((ride) => {
        if (ride.id === rideId) {
          // Check if there are seats available
          if (ride.vacantSeats > 0) {
            // Check if the user has already booked this ride
            if (ride.bookedByEmployeeIds.includes(employeeId)) {
              message = "You have already booked this ride.";
              return ride;
            }
            // Check if the provider is trying to book their own ride
            if (ride.providerEmployeeId === employeeId) {
              message = "You cannot book your own ride.";
              return ride;
            }

            success = true;
            message = "Ride booked successfully!";

            // Return the updated ride object with decremented seats and added employee ID
            return {
              ...ride,
              vacantSeats: ride.vacantSeats - 1,
              bookedByEmployeeIds: [...ride.bookedByEmployeeIds, employeeId],
            };
          } else {
            message = "No seats available.";
            return ride;
          }
        }
        return ride;
      })
    );

    if (!message) message = "Ride not found.";

    return { success, message };
  }
}
