import { Injectable, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private readonly breakpointObserver = inject(BreakpointObserver);

  /**
   * Native Angular CDK BreakpointObserver signal for phone/handset viewports.
   */
  readonly isHandset = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, '(max-width: 768px)'])
      .pipe(map((result) => result.matches)),
    { initialValue: typeof window !== 'undefined' ? window.innerWidth <= 768 : false }
  );

  /**
   * Detects tablet and compact desktop screens up to 1024px.
   */
  readonly isCompact = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet, '(max-width: 1024px)'])
      .pipe(map((result) => result.matches)),
    { initialValue: typeof window !== 'undefined' ? window.innerWidth <= 1024 : false }
  );
}
