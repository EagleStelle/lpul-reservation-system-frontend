import { UiSelectOption } from '../../../shared/ui';
import { EquipmentRow } from './equipments.models';

/** Build distinct facility (service) options from the equipment list. */
export function toFacilityOptions(rows: EquipmentRow[]): UiSelectOption[] {
  const seen = new Map<number, string>();

  for (const row of rows) {
    if (!seen.has(row.facilityId)) {
      seen.set(row.facilityId, row.facilityName);
    }
  }

  return [...seen].map(([id, name]) => ({ value: String(id), label: name }));
}
