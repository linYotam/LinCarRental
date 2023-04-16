import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  invokeUpdateNumberOfOrders = new EventEmitter();
  subsVar: Subscription;
  constructor() { }
  onUpdateInvokation() {
    this.invokeUpdateNumberOfOrders.emit();
  }
}
 