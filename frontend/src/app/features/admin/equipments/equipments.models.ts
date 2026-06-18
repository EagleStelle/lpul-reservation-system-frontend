export interface EquipmentRow {
  name: string;
  service: string;
  status: string;
}

export interface PopulateEquipmentsResponse {
  success: boolean;
  message: string;
  equipments: EquipmentRow[];
}

export interface CreateEquipmentRequest {
  name: string;
  service: string;
  status: string;
}

export interface UpdateEquipmentRequest {
  oldName: string;
  name: string;
  service: string;
  status: string;
}

export interface EquipmentStatementResponse {
  success: boolean;
  message: string;
}
