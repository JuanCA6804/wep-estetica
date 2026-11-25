import { Component } from '@angular/core';
import { Testimonio } from '../../core/models';
import { TESTIMONIOS_NOSOTROS } from '../../core/seed-data';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.scss']
})
export class NosotrosComponent {
  readonly testimonios: Testimonio[] = TESTIMONIOS_NOSOTROS;
  /** Lista duplicada para que el desplazamiento continuo (-50%) sea infinito y sin cortes */
  readonly slidesContinuos: Testimonio[] = [...TESTIMONIOS_NOSOTROS, ...TESTIMONIOS_NOSOTROS];

  estrellas(cantidad: number): string {
    return '★'.repeat(cantidad) + '☆'.repeat(Math.max(0, 5 - cantidad));
  }
}
