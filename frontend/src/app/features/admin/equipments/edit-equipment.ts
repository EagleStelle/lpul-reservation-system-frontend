import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AdminShell } from '../../../shared/layout/admin-shell/admin-shell';
import { UiButton, UiIcon, UiInput, UiSelect } from '../../../shared/ui';
import { EQUIPMENT_STATUS_OPTIONS } from './equipment-status';
import { EquipmentsService } from './equipments.service';

@Component({
  selector: 'app-edit-equipment',
  imports: [ReactiveFormsModule, RouterLink, AdminShell, UiButton, UiIcon, UiInput, UiSelect],
  templateUrl: './edit-equipment.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditEquipment {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(EquipmentsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly ready = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly oldName = signal('');
  protected readonly currentStatus = signal<string | null>(null);

  protected readonly statuses = computed(() => {
    const current = this.currentStatus();

    if (!current || EQUIPMENT_STATUS_OPTIONS.some((status) => status.value === current)) {
      return EQUIPMENT_STATUS_OPTIONS;
    }

    return [{ label: current, value: current }, ...EQUIPMENT_STATUS_OPTIONS];
  });

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    service: ['', [Validators.required]],
    status: ['ACTIVE', [Validators.required]],
  });

  constructor() {
    const name = this.route.snapshot.paramMap.get('name') ?? '';
    this.oldName.set(name);

    if (!name) {
      this.loading.set(false);
      this.error.set('Missing equipment name');
      return;
    }

    this.load(name);
  }

  private load(name: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.list().subscribe({
      next: (res) => {
        this.loading.set(false);

        if (!res?.success) {
          this.error.set(res?.message ?? 'Failed to load equipment');
          return;
        }

        const equipment = (res.equipments ?? []).find(
          (row) => row.name.toLowerCase() === name.toLowerCase(),
        );

        if (!equipment) {
          this.error.set('Equipment not found');
          return;
        }

        this.currentStatus.set(equipment.status);
        this.form.setValue({
          name: equipment.name,
          service: equipment.service,
          status: equipment.status,
        });
        this.ready.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Unable to reach the server');
      },
    });
  }

  protected save(): void {
    if (!this.ready()) {
      this.error.set('Equipment details are not ready yet');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Please complete all required fields');
      return;
    }

    const v = this.form.getRawValue();
    this.saving.set(true);
    this.error.set(null);

    this.api
      .update({
        oldName: this.oldName(),
        name: v.name,
        service: v.service,
        status: v.status,
      })
      .subscribe({
        next: (res) => {
          this.saving.set(false);

          if (res?.success) {
            this.router.navigateByUrl('/equipments');
          } else {
            this.error.set(res?.message ?? 'Failed to update equipment');
          }
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set(err?.error?.message ?? 'Unable to reach the server');
        },
      });
  }
}
