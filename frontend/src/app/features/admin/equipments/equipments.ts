import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminShell } from '../../../shared/layout/admin-shell/admin-shell';
import { UiButton, UiIcon, UiInputSearch, UiStatusBadge, UiToast } from '../../../shared/ui';
import { EquipmentRow } from './equipments.models';
import { EquipmentsService } from './equipments.service';

@Component({
  selector: 'app-equipments',
  imports: [RouterLink, AdminShell, UiButton, UiIcon, UiInputSearch, UiStatusBadge, UiToast],
  templateUrl: './equipments.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Equipments {
  private readonly api = inject(EquipmentsService);

  protected readonly equipments = signal<EquipmentRow[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly search = signal('');
  protected readonly showToast = signal(false);
  protected readonly toastMessage = signal('');
  protected readonly toastSuccess = signal(false);

  protected readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const rows = this.equipments();

    if (!q) return rows;

    return rows.filter((equipment) =>
      [equipment.name, equipment.service, equipment.status].some((field) =>
        field.toLowerCase().includes(q),
      ),
    );
  });

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.list().subscribe({
      next: (res) => {
        this.loading.set(false);

        if (res?.success) {
          this.equipments.set(res.equipments ?? []);
        } else {
          this.error.set(res?.message ?? 'Failed to load equipments');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Unable to reach the server');
      },
    });
  }

  protected onSearch(value: string): void {
    this.search.set(value);
  }

  protected remove(equipment: EquipmentRow): void {
    if (!confirm(`Delete equipment "${equipment.name}"? This cannot be undone.`)) {
      return;
    }

    this.api.remove(equipment.name).subscribe({
      next: (res) => {
        this.showResponse(res?.success ?? false, res?.message ?? 'Unknown response');

        if (res?.success) {
          this.equipments.update((rows) => rows.filter((row) => row.name !== equipment.name));
        }
      },
      error: (err) => {
        this.showResponse(false, err?.error?.message ?? 'Unable to reach the server');
      },
    });
  }

  protected isActive(status: string): boolean {
    return status?.toUpperCase() === 'ACTIVE';
  }

  protected toggleStatus(equipment: EquipmentRow): void {
    const action = this.isActive(equipment.status) ? 'deactivate' : 'activate';

    if (!confirm(`Are you sure you want to ${action} "${equipment.name}"?`)) {
      return;
    }

    this.api.toggleStatus(equipment.name).subscribe({
      next: (res) => {
        this.showResponse(res?.success ?? false, res?.message ?? 'Unknown response');

        if (res?.success) {
          this.equipments.update((rows) =>
            rows.map((row) =>
              row.name === equipment.name
                ? {
                    ...row,
                    status: this.isActive(row.status) ? 'INACTIVE' : 'ACTIVE',
                  }
                : row,
            ),
          );
        }
      },
      error: (err) => {
        this.showResponse(false, err?.error?.message ?? 'Unable to reach the server');
      },
    });
  }

  protected showResponse(success: boolean, message: string): void {
    this.toastSuccess.set(success);
    this.toastMessage.set(message);
    this.showToast.set(true);

    setTimeout(() => this.showToast.set(false), 3000);
  }
}
