import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminDataService } from '../../core/admin-data.service';
import { Cita } from '../../core/models';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent {
  private readonly fb = inject(FormBuilder);
  private readonly adminData = inject(AdminDataService);

  searchForm: FormGroup;
  readonly hasSearched = signal(false);
  readonly lastTerm = signal('');
  readonly resultados = signal<Cita[]>([]);

  constructor() {
    this.searchForm = this.fb.group({
      termino: ['', Validators.required]
    });
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const term = String(this.searchForm.value.termino ?? '').trim();
    const termLower = term.toLowerCase();
    this.hasSearched.set(true);
    this.lastTerm.set(term);

    const matches = this.adminData.citas().filter(
      (c) =>
        c.nombre_invitado.toLowerCase().includes(termLower) ||
        (c.telefono && c.telefono.includes(termLower)) ||
        (c.servicio && c.servicio.toLowerCase().includes(termLower))
    );
    this.resultados.set(matches);
  }
}
