export const VEHICLE_STATUS_OPTIONS = [
  { label: 'ACTIVE', value: 'active' },
  { label: 'INACTIVE', value: 'inactive' },
] as const;

export function normalizeVehicleStatus(status: string | null | undefined): string {
  const value = status?.trim() ?? '';
  const lower = value.toLowerCase();

  return lower === 'active' || lower === 'inactive' ? lower : value;
}
