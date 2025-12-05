/**
 * Represents a ride offered by an employee.
 */
export interface Ride {
  /** Unique identifier for the ride. */
  id: string;

  /** Employee ID of the person offering the ride. */
  providerEmployeeId: string;

  /** Type of vehicle being used. */
  vehicleType: "Bike" | "Car";

  /** Registration number of the vehicle. */
  vehicleNo: string;

  /** Number of seats currently available. */
  vacantSeats: number;

  /** Time of the ride in "HH:MM" format (24-hour). */
  time: string;

  /** Starting location of the ride. */
  pickupPoint: string;

  /** Destination of the ride. */
  destination: string;

  /** List of employee IDs who have booked a seat on this ride. */
  bookedByEmployeeIds: string[];
}
