import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { RideService } from "../../core/services/ride.service";
import { NotificationService } from "../../core/services/notification.service";

@Component({
  selector: "app-offer-ride",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./offer-ride.component.html",
  styleUrl: "./offer-ride.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferRideComponent {
  private rideService = inject(RideService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Form group for adding a new ride with validation rules
  public addRideForm = this.fb.group({
    providerEmployeeId: [
      "",
      [Validators.required, Validators.pattern("^EMP[0-9]+$")], // Example: EMP123
    ],
    vehicleType: ["Car" as "Car" | "Bike", Validators.required],
    vehicleNo: [
      "",
      [
        Validators.required,
        Validators.pattern("^[A-Z]{2}-[0-9]{2}-[A-Z]{1,2}-[0-9]{4}$"), // Example: TS-07-AB-1234
      ],
    ],
    vacantSeats: [
      1,
      [Validators.required, Validators.min(1), Validators.max(10)],
    ],
    time: ["", Validators.required],
    pickupPoint: ["", Validators.required],
    destination: ["", Validators.required],
  });

  /**
   * Helper getter for easy access to form controls in the template.
   */
  public get formControls() {
    return this.addRideForm.controls;
  }

  /**
   * Handles the form submission to add a new ride.
   */
  public onAddRideSubmit(): void {
    if (this.addRideForm.invalid) {
      this.addRideForm.markAllAsTouched();
      this.notificationService.show(
        "Please fill all required fields correctly.",
        "error"
      );
      return;
    }

    const result = this.rideService.addRide({
      providerEmployeeId: this.addRideForm.value.providerEmployeeId!,
      vehicleType: this.addRideForm.value.vehicleType!,
      vehicleNo: this.addRideForm.value.vehicleNo!,
      vacantSeats: this.addRideForm.value.vacantSeats!,
      time: this.addRideForm.value.time!,
      pickupPoint: this.addRideForm.value.pickupPoint!,
      destination: this.addRideForm.value.destination!,
    });

    this.notificationService.show(
      result.message,
      result.success ? "success" : "error"
    );

    if (result.success) {
      // Reset form and navigate to find ride page on success
      this.addRideForm.reset({ vehicleType: "Car", vacantSeats: 1 });
      this.router.navigate(["/find"]);
    }
  }
}
