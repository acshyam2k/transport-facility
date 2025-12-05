import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RideService } from "../../core/services/ride.service";
import { NotificationService } from "../../core/services/notification.service";
import { Ride } from "../../core/models/ride.model";

@Component({
  selector: "app-find-ride",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./find-ride.component.html",
  styleUrl: "./find-ride.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindRideComponent {
  // Inject services
  private rideService = inject(RideService);
  private notificationService = inject(NotificationService);

  // Signal for filtering rides by vehicle type
  public filterVehicleType = signal<"All" | "Car" | "Bike">("All");

  // Signal to track the ride currently selected for booking
  public selectedRideForBooking = signal<Ride | null>(null);

  // Signal for the employee ID input in the booking modal
  public bookingEmployeeId = signal("");

  // Computed signal to check if the booking modal should be open
  public isBookingModalOpen = computed(
    () => this.selectedRideForBooking() !== null
  );

  // Read-only signal of all rides from the service
  public rides = this.rideService.rides;

  // Computed signal to filter rides based on criteria
  public filteredRides = computed(() => {
    const allRides = this.rides();
    const vehicleType = this.filterVehicleType();

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return allRides.filter((ride) => {
      // Filter out rides with no vacant seats
      if (ride.vacantSeats <= 0) return false;

      // Filter by vehicle type if not 'All'
      if (vehicleType !== "All" && ride.vehicleType !== vehicleType)
        return false;

      // Filter rides within +/- 60 minutes of current time
      const [hours, minutes] = ride.time.split(":").map(Number);
      const rideMinutes = hours * 60 + minutes;
      const timeDifference = Math.abs(rideMinutes - currentMinutes);

      return timeDifference <= 60;
    });
  });

  /**
   * Opens the booking modal for a specific ride.
   * @param ride The ride to book.
   */
  public openBookingModal(ride: Ride): void {
    this.bookingEmployeeId.set("");
    this.selectedRideForBooking.set(ride);
  }

  /**
   * Closes the booking modal.
   */
  public closeBookingModal(): void {
    this.selectedRideForBooking.set(null);
  }

  /**
   * Confirms the booking with the entered employee ID.
   */
  public confirmBooking(): void {
    const ride = this.selectedRideForBooking();
    const employeeId = this.bookingEmployeeId();

    if (!ride || !employeeId) {
      this.notificationService.show("Employee ID is required.", "error");
      return;
    }

    // Validate Employee ID format
    if (!employeeId.match("^EMP[0-9]+$")) {
      this.notificationService.show(
        "Invalid Employee ID format. e.g. EMP123",
        "error"
      );
      return;
    }

    const result = this.rideService.bookRide(ride.id, employeeId);
    this.notificationService.show(
      result.message,
      result.success ? "success" : "error"
    );

    if (result.success) {
      this.closeBookingModal();
    }
  }

  /**
   * Handles the change event of the vehicle type filter.
   * @param event The change event.
   */
  public onFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as
      | "All"
      | "Car"
      | "Bike";
    this.filterVehicleType.set(value);
  }

  /**
   * Handles input changes for the employee ID field.
   * @param event The input event.
   */
  public onEmployeeIdInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.bookingEmployeeId.set(value);
  }
}
