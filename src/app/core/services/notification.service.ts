import { Injectable, signal } from "@angular/core";

/**
 * Represents a notification message to be displayed to the user.
 */
export interface Notification {
  message: string;
  type: "success" | "error";
}

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  // Signal to hold the current notification. Null if no notification is active.
  private readonly _notification = signal<Notification | null>(null);

  // Public readonly signal for components to consume.
  public readonly notification = this._notification.asReadonly();

  /**
   * Displays a notification message for a short duration.
   * @param message The message to display.
   * @param type The type of notification ('success' or 'error').
   */
  public show(message: string, type: "success" | "error") {
    this._notification.set({ message, type });

    // Automatically clear the notification after 3 seconds
    setTimeout(() => this._notification.set(null), 3000);
  }
}
