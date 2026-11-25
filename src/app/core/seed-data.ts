import { Cita, ProductoApi, Testimonio, Usuario } from './models';

export const STORAGE_USERS_KEY = 'estetica_usuarios_v2';
export const STORAGE_CITAS_KEY = 'estetica_citas_v2';
export const STORAGE_CATALOGO_KEY = 'estetica_catalogo_kenya_v3';

export const INITIAL_CATALOGO: ProductoApi[] = [
  // --- PRODUCTOS PROPIOS (como en bellaapp) ---
  {
    id: 1,
    title: 'Shampoo Hidratante con Keratina',
    price: 190,
    category: 'Cuidado Capilar',
    tipo: 'producto',
    duracion: 'Envase 500 ml',
    image:
      'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR7deQiEkCbhL80suZWWGCRKyVcgZti-HvUmOyGKzIi_AZAoqe8njXVs_N-Ky4AFvnPbIElphLror00TBsIcEe2jViTaQhqEaN1gZdWuLVNXIkeKfIOyM8kbwD0DPKg1vGJw78hAd8&usqp=CAc',
    description:
      'Fórmula libre de sulfatos enriquecida con keratina hidrolizada y aceite de argán para restaurar el brillo y suavidad.',
    rating: { rate: 4.9, count: 48 },
    fechaModificacion: '2026-11-24 19:59',
    modificadoPor: 'johnd'
  },
  {
    id: 2,
    title: 'Mascarilla Capilar Reparadora',
    price: 240,
    category: 'Cuidado Capilar',
    tipo: 'producto',
    duracion: 'Tarro 350 g',
    image:
      'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTCH30AsHcRRHbkLFtgKZq5lXMGlNNFFdBGaqjyd2r1efz_xQde10hB5E3uo1fElRkw5FNeaJAj_RvLZ0CeMCdAwiJLVhOqPGJItQ5ZyyAXfbsH-BVLBYhSzJ8kgnFQ-F7gYimuLQ&usqp=CAc',
    description:
      'Tratamiento intensivo para cabello teñido o procesado; sella las puntas abiertas desde la primera aplicación.',
    rating: { rate: 4.8, count: 36 },
    fechaModificacion: '2026-11-24 19:59',
    modificadoPor: 'johnd'
  },
  {
    id: 3,
    title: 'Sérum Protector Termo-Activo',
    price: 160,
    category: 'Cuidado Capilar',
    tipo: 'producto',
    duracion: 'Frasco 120 ml',
    image: 'https://http2.mlstatic.com/D_Q_NP_2X_678961-CBT108797932826_032026-P.webp',
    description:
      'Protege la fibra capilar del calor de planchas y secadoras hasta 230°C eliminando el frizz al instante.',
    rating: { rate: 4.9, count: 52 },
    fechaModificacion: '2026-11-24 19:58',
    modificadoPor: 'johnd'
  },
  {
    id: 4,
    title: 'Kit Cuidado Facial Hidratante',
    price: 380,
    category: 'Cuidado Facial y Spa',
    tipo: 'producto',
    duracion: 'Kit 2 pzas (150 ml)',
    image: 'https://http2.mlstatic.com/D_NQ_NP_997100-MLM110515233866_052026-O.webp',
    description:
      'Kit de cremas hidratantes y sérum revitalizante formulado con ingredientes naturales para mantener tu piel joven y radiante.',
    rating: { rate: 5.0, count: 29 },
    fechaModificacion: '2026-11-24 19:58',
    modificadoPor: 'johnd'
  },
  {
    id: 5,
    title: 'Aceite Nutritivo para Cutícula y Uñas',
    price: 135,
    category: 'Manicure y Uñas',
    tipo: 'producto',
    duracion: 'Gotero 30 ml',
    image:
      'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1722190518-61nfnfKR0xL.jpg?crop=1xw:1xh;0xw,0xh&resize=980:*',
    description:
      'Complejo con vitamina E y almendras dulces que fortalece las uñas y mantiene hidratada la cutícula.',
    rating: { rate: 4.7, count: 31 },
    fechaModificacion: '2026-11-24 19:57',
    modificadoPor: 'johnd'
  },
  {
    id: 6,
    title: 'Cera Modeladora Mate Profesional',
    price: 175,
    category: 'Barbería y Estilizado',
    tipo: 'producto',
    duracion: 'Tarro 100 g',
    image:
      'https://www.elpalaciodelabelleza.com.mx/cdn/shop/files/7501846506488_67ce7fd6-5a11-4135-8299-8f055dc430d5_720x.png?v=1782494804',
    description:
      'Fijación flexible con acabado mate natural sin residuos para definir cortes ejecutivos, fade y texturizados.',
    rating: { rate: 4.8, count: 24 },
    fechaModificacion: '2026-11-24 19:56',
    modificadoPor: 'johnd'
  },

  // --- SERVICIOS: CORTES PARA DAMA Y CABELLO ---
  {
    id: 7,
    title: 'Corte de cabello para dama',
    price: 120,
    category: 'Cortes para dama',
    tipo: 'servicio',
    duracion: '45 min',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgfpOjFzd1s3mmIl3dzMDpFFapO5utWp1haQlPvC6ZCw&s=10',
    description:
      'Corte personalizado según tu tipo de rostro, incluye lavado revitalizante, despunte o cambio de estilo y secado con cepillo.',
    rating: { rate: 4.9, count: 64 },
    fechaModificacion: '2026-11-24 20:00',
    modificadoPor: 'johnd'
  },
  {
    id: 8,
    title: 'Corte en capas y estilizado',
    price: 150,
    category: 'Cortes para dama',
    tipo: 'servicio',
    duracion: '50 min',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVHwOZQPDyx6utIddkllsRAWvuIduuU5QaKIay0kZMaw&s=10',
    description:
      'Diseño de capas para dar volumen y movimiento natural al cabello, con aplicación de protector térmico y planchado o moldeado.',
    rating: { rate: 4.9, count: 41 },
    fechaModificacion: '2026-11-24 20:00',
    modificadoPor: 'johnd'
  },
  {
    id: 9,
    title: 'Tintes y luces (Balayage)',
    price: 1200,
    category: 'Cortes para dama',
    tipo: 'servicio',
    duracion: '120 min',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl4u_VvRyFmpgFVbCUN6_qpS2BonP2V7ipoqGFFiH9pA&s=10',
    description:
      'Coloración profesional, balayage, babylights y diseño de color con tratamiento sellador de brillo.',
    rating: { rate: 5.0, count: 38 },
    fechaModificacion: '2026-11-24 20:01',
    modificadoPor: 'johnd'
  },

  // --- SERVICIOS: CORTES PARA CABALLERO ---
  {
    id: 10,
    title: 'Corte clásico para caballero',
    price: 100,
    category: 'Cortes para caballero',
    tipo: 'servicio',
    duracion: '30 min',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHneUSfovWEw1P3Tu73_nZ3APQCpDRaP-fgXI8UssSzQ&s=10',
    description:
      'Corte ejecutivo con tijera y máquina, delineado de contornos con navaja y peinado con cera o pomada profesional.',
    rating: { rate: 4.8, count: 55 },
    fechaModificacion: '2026-11-24 20:01',
    modificadoPor: 'johnd'
  },
  {
    id: 11,
    title: 'Corte Fade / Degradado',
    price: 130,
    category: 'Cortes para caballero',
    tipo: 'servicio',
    duracion: '40 min',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMdt6Jr5Gal2TpMJMoDEgQ1Wn63M9EYGOnrBr9VqJwDA&s=10',
    description:
      'Degradado limpio con diseño de textura en la parte superior y perfilado de cejas incluido.',
    rating: { rate: 4.9, count: 47 },
    fechaModificacion: '2026-11-24 20:02',
    modificadoPor: 'johnd'
  },
  {
    id: 12,
    title: 'Corte y ritual de barba',
    price: 170,
    category: 'Cortes para caballero',
    tipo: 'servicio',
    duracion: '50 min',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWB-Ehcw7y4RBInaYeEjmUrhQZ1yCeMQDG8Ty040JyrA&s=10',
    description:
      'Corte completo más arreglo de barba con toalla caliente, aceites esenciales hidratantes y perfilado de precisión.',
    rating: { rate: 5.0, count: 39 },
    fechaModificacion: '2026-11-24 20:02',
    modificadoPor: 'johnd'
  },

  // --- SERVICIOS: UÑAS Y CUIDADO FACIAL ---
  {
    id: 13,
    title: 'Arreglo de Uñas Francesas',
    price: 220,
    category: 'Uñas y Cuidado Facial',
    tipo: 'servicio',
    duracion: '60 min',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuBQDNTAOqXwAgF3tJNyON-PKLZYNz3hrCVjT3fsuk2w&s=10',
    description:
      'Manicura completa con diseño francés clásico o moderno, exfoliación hidratante de manos y acabado en gel de larga duración.',
    rating: { rate: 4.9, count: 58 },
    fechaModificacion: '2026-11-24 20:03',
    modificadoPor: 'johnd'
  },
  {
    id: 14,
    title: 'Manicure Gelish y Pedicure Spa',
    price: 350,
    category: 'Uñas y Cuidado Facial',
    tipo: 'servicio',
    duracion: '60 min',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReKrGKBDRF1A9T24xUzjGiJsKuKaP8IHhwRg10h3g0wQ&s=10',
    description:
      'Exfoliación, mascarilla hidratante, masaje relajante y esmaltado en gel brillante de alta duración.',
    rating: { rate: 5.0, count: 44 },
    fechaModificacion: '2026-11-24 20:03',
    modificadoPor: 'johnd'
  },
  {
    id: 15,
    title: 'Limpieza Facial Profunda',
    price: 450,
    category: 'Uñas y Cuidado Facial',
    tipo: 'servicio',
    duracion: '60 min',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3WrYQm5vB8opKpFhc2T5d8wZBESI1zuXlv7m8P-khMw&s=10',
    description:
      'Extracción suave, exfoliación ultrasónica, tonificación y mascarilla calmante según tu tipo de piel.',
    rating: { rate: 4.9, count: 33 },
    fechaModificacion: '2026-11-24 20:03',
    modificadoPor: 'johnd'
  },

  // --- PAQUETES: BODA Y SPA (como en bellaapp) ---
  {
    id: 16,
    title: 'Paquete Novia Radiante',
    price: 1200,
    category: 'Paquetes para Boda y Spa',
    tipo: 'paquete',
    duracion: '3 hrs',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNwuHsrxYsvn8YxpOWwJ7NAuPZAze3KU7GF1uJVHGjCQ&s',
    description:
      'Incluye prueba previa de maquillaje y alto peinado, preparación facial luminosa, pestañas pelo a pelo y manicura nupcial.',
    rating: { rate: 5.0, count: 27 },
    fechaModificacion: '2026-11-24 20:04',
    modificadoPor: 'johnd'
  },
  {
    id: 17,
    title: 'Paquete Damas de Honor',
    price: 650,
    category: 'Paquetes para Boda y Spa',
    tipo: 'paquete',
    duracion: '90 min',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0-nh7qTg_OFSwh3afXTbZyujAqoDUyNOqI1iLbIWrvA&s=10',
    description:
      'Peinado recogido u ondas suaves más maquillaje social de alta duración a prueba de agua y fijador profesional.',
    rating: { rate: 4.9, count: 31 },
    fechaModificacion: '2026-11-24 20:04',
    modificadoPor: 'johnd'
  },
  {
    id: 18,
    title: 'Paquete Novio Gala',
    price: 450,
    category: 'Paquetes para Boda y Spa',
    tipo: 'paquete',
    duracion: '75 min',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9rvrF4r6SSjIFi1Dx8bGVLWCjJwAizXrVxBcvUzOSJA&s=10',
    description:
      'Corte de gala, diseño y perfilado de barba, mascarilla facial matificante y manicura para caballero.',
    rating: { rate: 4.9, count: 22 },
    fechaModificacion: '2026-11-24 20:05',
    modificadoPor: 'johnd'
  },
  {
    id: 19,
    title: 'Paquete Día de Spa Completo',
    price: 1500,
    category: 'Paquetes para Boda y Spa',
    tipo: 'paquete',
    duracion: '3 hrs',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpwlaXclALR47vuSa9htmv4DmXiVSxjdsyrl5UQ3EFlw&s=10',
    description:
      'Incluye masaje relajante de cuerpo completo, limpieza facial profunda, hidratación capilar y manicure.',
    rating: { rate: 5.0, count: 35 },
    fechaModificacion: '2026-11-24 20:05',
    modificadoPor: 'johnd'
  }
];

export const INITIAL_USUARIOS: Usuario[] = [
  {
    id_usuario: 1,
    nombre_usuario: 'johnd',
    correo: 'john@gmail.com',
    rol: 'ADMINISTRADOR',
    fechaModificacion: '2026-11-10 09:15',
    modificadoPor: 'sistema'
  },
  {
    id_usuario: 2,
    nombre_usuario: 'recepcion1',
    correo: 'rec1@kenya.com',
    rol: 'RECEPCIONISTA',
    fechaModificacion: '2026-11-10 10:30',
    modificadoPor: 'johnd'
  },
  {
    id_usuario: 3,
    nombre_usuario: 'monica_estilista',
    correo: 'monica@kenya.com',
    rol: 'ESTILISTA',
    fechaModificacion: '2026-11-11 12:00',
    modificadoPor: 'johnd'
  },
  {
    id_usuario: 4,
    nombre_usuario: 'karla_unas',
    correo: 'karla@kenya.com',
    rol: 'ESTILISTA',
    fechaModificacion: '2026-11-12 16:40',
    modificadoPor: 'johnd'
  },
  {
    id_usuario: 5,
    nombre_usuario: 'daniel_corte',
    correo: 'daniel@kenya.com',
    rol: 'ESTILISTA',
    fechaModificacion: '2026-11-13 11:20',
    modificadoPor: 'johnd'
  },
  {
    id_usuario: 6,
    nombre_usuario: 'mor_2314',
    correo: 'morrison@gmail.com',
    rol: 'USUARIO',
    fechaModificacion: '2026-11-14 14:05',
    modificadoPor: 'sistema'
  }
];

export const INITIAL_CITAS: Cita[] = [
  {
    id_cita: 101,
    nombre_invitado: 'María Fernanda López',
    telefono: '2711234567',
    servicio: 'Tintes y luces (Balayage)',
    fecha: '2026-11-17',
    hora: '10:00',
    estado: 'CONFIRMADA',
    fechaModificacion: '2026-11-14 09:30',
    modificadoPor: 'johnd'
  },
  {
    id_cita: 102,
    nombre_invitado: 'Ana Valeria Ruiz',
    telefono: '2712345678',
    servicio: 'Arreglo de Uñas Francesas',
    fecha: '2026-11-17',
    hora: '11:30',
    estado: 'PENDIENTE',
    fechaModificacion: '2026-11-14 10:15',
    modificadoPor: 'recepcion1'
  },
  {
    id_cita: 103,
    id_cliente: 45,
    nombre_invitado: 'Carlos Mendoza',
    telefono: '2713456789',
    servicio: 'Corte clásico para caballero',
    fecha: '2026-11-18',
    hora: '16:00',
    estado: 'CANCELADA',
    fechaModificacion: '2026-11-14 12:10',
    modificadoPor: 'johnd'
  },
  {
    id_cita: 104,
    nombre_invitado: 'Laura Hernández',
    telefono: '2714567890',
    servicio: 'Paquete Novia Radiante',
    fecha: '2026-11-19',
    hora: '09:00',
    estado: 'CONFIRMADA',
    fechaModificacion: '2026-11-15 08:45',
    modificadoPor: 'johnd'
  },
  {
    id_cita: 105,
    id_cliente: 12,
    nombre_invitado: 'Diana Gómez',
    telefono: '2715678901',
    servicio: 'Limpieza Facial Profunda',
    fecha: '2026-11-19',
    hora: '14:00',
    estado: 'CONFIRMADA',
    fechaModificacion: '2026-11-15 13:00',
    modificadoPor: 'recepcion1'
  },
  {
    id_cita: 106,
    nombre_invitado: 'Sofía Martínez',
    telefono: '2716789012',
    servicio: 'Manicure Gelish y Pedicure Spa',
    fecha: '2026-11-20',
    hora: '11:15',
    estado: 'PENDIENTE',
    fechaModificacion: '2026-11-15 17:25',
    modificadoPor: 'mor_2314'
  },
  {
    id_cita: 107,
    id_cliente: 28,
    nombre_invitado: 'Valeria Castro',
    telefono: '2717890123',
    servicio: 'Corte en capas y estilizado',
    fecha: '2026-11-21',
    hora: '10:30',
    estado: 'ATENDIDA',
    fechaModificacion: '2026-11-16 11:00',
    modificadoPor: 'johnd'
  }
];

export const TESTIMONIOS_NOSOTROS: Testimonio[] = [
  {
    id: 1,
    nombre: 'Mariana Velasco',
    servicio: 'Tintes y luces (Balayage)',
    calificacion: 5,
    comentario:
      'Mónica y su equipo cuidaron muchísimo mi cabello. El color quedó exacto como lo pedí y el ambiente del salón te hace sentir consentida desde que llegas.',
    fecha: 'Noviembre 2026',
    iniciales: 'MV'
  },
  {
    id: 2,
    nombre: 'Fernanda Ríos',
    servicio: 'Día de Spa & Limpieza Facial',
    calificacion: 5,
    comentario:
      'Me encantó la limpieza facial profunda y el masaje relajante. Todo súper higiénico, puntual y con excelente asesoría para mi rutina diaria en casa.',
    fecha: 'Octubre 2026',
    iniciales: 'FR'
  },
  {
    id: 3,
    nombre: 'Alejandro Morales',
    servicio: 'Corte Unisex y Cuidado Capilar',
    calificacion: 5,
    comentario:
      'Excelente atención unisex en Córdoba. Me asesoraron sobre el corte y productos adecuados para mi tipo de cabello. Cien por ciento recomendados.',
    fecha: 'Octubre 2026',
    iniciales: 'AM'
  },
  {
    id: 4,
    nombre: 'Lucía Serrano',
    servicio: 'Manicure Gelish & Pedicure Spa',
    calificacion: 5,
    comentario:
      'Llevo más de tres semanas con el gelish intacto y el pedicure spa fue súper relajante. El trato de Karla y todo el equipo es impecable.',
    fecha: 'Septiembre 2026',
    iniciales: 'LS'
  },
  {
    id: 5,
    nombre: 'Sofía Domínguez',
    servicio: 'Paquete Novia Radiante',
    calificacion: 5,
    comentario:
      'Contraté el paquete de novia y fue la mejor decisión. La prueba previa me dio total tranquilidad y el día de mi boda el maquillaje y peinado duraron intactos toda la noche.',
    fecha: 'Noviembre 2026',
    iniciales: 'SD'
  },
  {
    id: 6,
    nombre: 'Ricardo Pacheco',
    servicio: 'Corte Fade y Ritual de Barba',
    calificacion: 5,
    comentario:
      'El ritual de barba con toalla caliente y aceites esenciales es de otro nivel. Excelente puntualidad en las citas y productos de primera calidad.',
    fecha: 'Noviembre 2026',
    iniciales: 'RP'
  }
];

export function loadOrSeedStorage<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as T[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    localStorage.setItem(key, JSON.stringify(seed));
  } catch {
    // Ignore storage unavailability
  }
  return [...seed];
}

export function saveStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}
