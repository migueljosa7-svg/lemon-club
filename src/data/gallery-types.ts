export interface GalleryPhoto {
  /** URL directa de la foto (CC con atribución). */
  src: string;
  /** Texto alternativo accesible. */
  alt: string;
  /** Autor para la atribución CC visible en la galería. */
  credit: string;
}

export interface ActivityQuote {
  author: string;
  text: string;
  event: string;
}
