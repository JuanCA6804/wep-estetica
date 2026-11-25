import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-paginacion',
  standalone: true,
  template: `
    @if (totalPages() > 1) {
      <div class="pagination-bar" role="navigation" aria-label="Paginación">
        <span class="pagination-info">
          Página {{ currentPage() }} de {{ totalPages() }} ({{ totalItems() }} registros)
        </span>
        <div class="pagination-controls">
          <button
            type="button"
            class="page-btn"
            [disabled]="currentPage() <= 1"
            (click)="goTo(currentPage() - 1)"
          >
            &larr; Anterior
          </button>
          @for (p of pages(); track p) {
            <button
              type="button"
              class="page-btn"
              [class.active]="p === currentPage()"
              (click)="goTo(p)"
            >
              {{ p }}
            </button>
          }
          <button
            type="button"
            class="page-btn"
            [disabled]="currentPage() >= totalPages()"
            (click)="goTo(currentPage() + 1)"
          >
            Siguiente &rarr;
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    .pagination-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 1.25rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }
    .pagination-info {
      font-size: 0.88rem;
      color: var(--text-muted);
    }
    .pagination-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .page-btn {
      padding: 6px 12px;
      border: 1px solid #ddd;
      background: #fff;
      color: var(--text-dark);
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .page-btn:hover:not(:disabled) {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .page-btn.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: #fff;
    }
    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class PaginacionComponent {
  readonly totalItems = input.required<number>();
  readonly pageSize = input<number>(5);
  readonly currentPage = input<number>(1);
  readonly pageChange = output<number>();

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / Math.max(1, this.pageSize())))
  );

  readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, idx) => idx + 1)
  );

  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }
}
