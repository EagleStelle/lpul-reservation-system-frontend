import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import {
  CreateEquipmentRequest,
  EquipmentRow,
  EquipmentStatementResponse,
  PopulateEquipmentsResponse,
  UpdateEquipmentRequest,
} from './equipments.models';

@Injectable({ providedIn: 'root' })
export class EquipmentsService {
  // Placeholder in-memory data until the equipment API endpoints are available.
  private equipments: EquipmentRow[] = [
    { name: 'LCD Projector', service: 'Audio Visual', status: 'ACTIVE' },
    { name: 'Sound System', service: 'Audio Visual', status: 'ACTIVE' },
    { name: 'Conference Microphone', service: 'Events', status: 'INACTIVE' },
  ];

  list(): Observable<PopulateEquipmentsResponse> {
    return of({
      success: true,
      message: 'Equipments loaded',
      equipments: this.snapshot(),
    });
  }

  create(payload: CreateEquipmentRequest): Observable<EquipmentStatementResponse> {
    const equipment = this.clean(payload);

    if (!equipment.name || !equipment.service) {
      return of({ success: false, message: 'Please complete all required fields' });
    }

    if (this.hasName(equipment.name)) {
      return of({ success: false, message: 'Equipment name already exists' });
    }

    this.equipments = [...this.equipments, equipment];
    return of({ success: true, message: 'Equipment created' });
  }

  update(payload: UpdateEquipmentRequest): Observable<EquipmentStatementResponse> {
    const index = this.findIndex(payload.oldName);

    if (index < 0) {
      return of({ success: false, message: 'Equipment not found' });
    }

    const equipment = this.clean(payload);

    if (!equipment.name || !equipment.service) {
      return of({ success: false, message: 'Please complete all required fields' });
    }

    const duplicate = this.equipments.some(
      (row, rowIndex) =>
        rowIndex !== index && this.normalize(row.name) === this.normalize(equipment.name),
    );

    if (duplicate) {
      return of({ success: false, message: 'Equipment name already exists' });
    }

    this.equipments = this.equipments.map((row, rowIndex) =>
      rowIndex === index ? equipment : row,
    );
    return of({ success: true, message: 'Equipment updated' });
  }

  remove(name: string): Observable<EquipmentStatementResponse> {
    const index = this.findIndex(name);

    if (index < 0) {
      return of({ success: false, message: 'Equipment not found' });
    }

    this.equipments = this.equipments.filter((_, rowIndex) => rowIndex !== index);
    return of({ success: true, message: 'Equipment deleted' });
  }

  toggleStatus(name: string): Observable<EquipmentStatementResponse> {
    const index = this.findIndex(name);

    if (index < 0) {
      return of({ success: false, message: 'Equipment not found' });
    }

    this.equipments = this.equipments.map((row, rowIndex) =>
      rowIndex === index
        ? {
            ...row,
            status: this.isActive(row.status) ? 'INACTIVE' : 'ACTIVE',
          }
        : row,
    );

    return of({ success: true, message: 'Equipment status updated' });
  }

  private clean(payload: CreateEquipmentRequest | UpdateEquipmentRequest): EquipmentRow {
    return {
      name: payload.name.trim(),
      service: payload.service.trim(),
      status: payload.status || 'ACTIVE',
    };
  }

  private snapshot(): EquipmentRow[] {
    return this.equipments.map((row) => ({ ...row }));
  }

  private hasName(name: string): boolean {
    return this.findIndex(name) >= 0;
  }

  private findIndex(name: string): number {
    const target = this.normalize(name);
    return this.equipments.findIndex((row) => this.normalize(row.name) === target);
  }

  private normalize(value: string): string {
    return value.trim().toLowerCase();
  }

  private isActive(status: string): boolean {
    return status.toUpperCase() === 'ACTIVE';
  }
}
