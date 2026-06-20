import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  readonly isLoading = signal(false);
  private pending = 0;

  start(): void {
    this.pending++;
    this.isLoading.set(true);
  }

  stop(): void {
    this.pending = Math.max(0, this.pending - 1);
    if (this.pending === 0) this.isLoading.set(false);
  }
}
