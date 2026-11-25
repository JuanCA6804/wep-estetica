import { Routes } from '@angular/router';
import { adminGuard } from './core/admin.guard';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./public/public-layout/public-layout.component').then((m) => m.PublicLayoutComponent),
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      {
        path: 'inicio',
        loadComponent: () => import('./public/inicio/inicio.component').then((m) => m.InicioComponent)
      },
      {
        path: 'nosotros',
        loadComponent: () => import('./public/nosotros/nosotros.component').then((m) => m.NosotrosComponent)
      },
      {
        path: 'servicios',
        loadComponent: () => import('./public/servicios/servicios.component').then((m) => m.ServiciosComponent)
      },
      {
        path: 'productos',
        loadComponent: () => import('./public/productos/productos.component').then((m) => m.ProductosComponent)
      },
      {
        path: 'contacto',
        loadComponent: () => import('./public/contacto/contacto.component').then((m) => m.ContactoComponent)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./auth/registro.component').then((m) => m.RegistroComponent)
  },
  {
    path: 'usuario',
    loadComponent: () => import('./usuario/usuario-panel.component').then((m) => m.UsuarioPanelComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./admin/productos/admin-productos.component').then((m) => m.AdminProductosComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./admin/usuarios/usuarios.component').then((m) => m.UsuariosComponent)
      },
      {
        path: 'citas',
        loadComponent: () => import('./admin/citas/citas.component').then((m) => m.CitasComponent)
      },
      {
        path: 'historial',
        loadComponent: () => import('./admin/historial/historial.component').then((m) => m.HistorialComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
