import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  constructor(
    private matSnackBar: MatSnackBar
  ) {

  }
  public errorSnackBar(message: string) {
    this.matSnackBar.open(message, '', {
      duration: 4000,
      panelClass: ["error-snack-bar"]
    });
  }

  public successSnackBar(message: string) {
    this.matSnackBar.open(message, '', {
      duration: 4000,
      panelClass: ["sucess-snack-bar"]
    });
  }
}