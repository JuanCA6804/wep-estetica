import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { CaracteristicasComponent } from './caracteristicas/caracteristicas.component';
import { DestacadosComponent } from './destacados/destacados.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [HeroComponent, DestacadosComponent, CaracteristicasComponent],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {
  // Componente principal de la Landing Page
}
