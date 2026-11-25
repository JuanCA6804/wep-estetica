import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    @if (open()) {
      <div class="modal-backdrop" (click)="cancel.emit()">
        <div class="modal-card" role="dialog" aria-modal="true" (click)="$event.stopPropagation()">
          <h3>{{ title() }}</h3>
          <p>{{ message() }}</p>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" [disabled]="busy()" (click)="cancel.emit()">
              Cancelar
            </button>
            <button type="button" class="btn-danger" [disabled]="busy()" (click)="confirm.emit()">
              {{ busy() ? 'Eliminando...' : confirmLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      z-index: 2000;
    }
    .modal-card {
      background: #fff;
      width: 100%;
      max-width: 420px;
      border-radius: 10px;
      padding: 1.75rem;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
      border-top: 4px solid var(--error-color);
    }
    h3 {
      margin-bottom: 0.75rem;
      color: var(--text-dark);
      font-family: var(--font-main);
      font-size: 1.15rem;
    }
    p {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-bottom: 1.5rem;
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .btn-secondary {
      padding: 9px 16px;
      border: 1px solid #ccc;
      background: #fff;
      color: var(--text-dark);
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-danger {
      padding: 9px 16px;
      border: none;
      background: var(--error-color);
      color: #fff;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-danger:disabled,
    .btn-secondary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class ConfirmModalComponent {
  readonly open = input<boolean>(false);
  readonly title = input<string>('Confirmar eliminación');
  readonly message = input<string>('¿Estás seguro de eliminar este registro?');
  readonly confirmLabel = input<string>('Sí, eliminar');
  readonly busy = input<boolean>(false);

  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
