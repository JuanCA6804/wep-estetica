export type RolUsuario = 'ADMINISTRADOR' | 'RECEPCIONISTA' | 'ESTILISTA' | 'USUARIO';

export type EstadoCita = 'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA';

export type TipoCatalogo = 'producto' | 'servicio' | 'paquete';

export interface BitacoraRegistro {
  fechaModificacion: string;
  modificadoPor: string;
}

export interface Usuario extends BitacoraRegistro {
  id_usuario: number;
  nombre_usuario: string;
  correo: string;
  rol: RolUsuario;
  passwordHash?: string;
}

export interface Cita extends BitacoraRegistro {
  id_cita: number;
  id_cliente?: number;
  nombre_invitado: string;
  telefono?: string;
  servicio?: string;
  fecha: string;
  hora: string;
  estado: EstadoCita;
}

export interface ProductoRating {
  rate: number;
  count: number;
}

export interface ProductoApi extends Partial<BitacoraRegistro> {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  tipo: TipoCatalogo;
  duracion: string;
  image: string;
  rating?: ProductoRating;
}

export interface ProductoInput {
  title: string;
  price: number;
  description: string;
  category: string;
  tipo: TipoCatalogo;
  duracion: string;
  image: string;
}

export interface Testimonio {
  id: number;
  nombre: string;
  servicio: string;
  calificacion: number;
  comentario: string;
  fecha: string;
  iniciales: string;
}
