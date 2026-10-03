/** Abre el escáner staff (listener en StaffScannerModal, cargado en diferido). */
export function openStaffScanner(): void {
  window.dispatchEvent(new CustomEvent("lemon:open-staff"));
}
