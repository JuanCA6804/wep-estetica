import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-destacados',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './destacados.component.html',
  styleUrls: ['./destacados.component.scss']
})
export class DestacadosComponent {}
