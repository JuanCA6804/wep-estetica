import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  contactForm: FormGroup;
  readonly enviado = signal(false);
  readonly itemSeleccionado = signal<{
    tipo: string;
    nombre: string;
    precio?: string;
    presentacion?: string;
  } | null>(null);

  constructor() {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      comentarios: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const item = params.get('item');
      const tipo = params.get('tipo') || 'producto';
      const precio = params.get('precio');
      const presentacion = params.get('presentacion');

      if (item) {
        this.itemSeleccionado.set({
          tipo,
          nombre: item,
          precio: precio ?? undefined,
          presentacion: presentacion ?? undefined
        });

        const detallePrecio = precio ? ` ($${precio}.00 MXN)` : '';
        const detallePres = presentacion ? ` [${presentacion}]` : '';
        const mensajeAutocompletado =
          tipo === 'producto'
            ? `Hola, me interesa solicitar el producto "${item}"${detallePres}${detallePrecio}. ¿Me podrían confirmar disponibilidad?`
            : `Hola, me gustaría agendar una cita para el ${tipo} "${item}"${detallePres}${detallePrecio}.`;

        this.contactForm.patchValue({
          comentarios: mensajeAutocompletado
        });
      }
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.enviado.set(true);
      this.itemSeleccionado.set(null);
      this.contactForm.reset();
    } else {
      this.enviado.set(false);
      this.contactForm.markAllAsTouched();
    }
  }
}
