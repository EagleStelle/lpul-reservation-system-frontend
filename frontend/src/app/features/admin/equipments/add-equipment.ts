import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AdminShell } from '../../../shared/layout/admin-shell/admin-shell';
import { UiButton, UiIcon, UiInput, UiSelect } from '../../../shared/ui';
import { EQUIPMENT_STATUS_OPTIONS } from './equipment-status';
import { EquipmentsService } from './equipments.service';

@Component({
  selector: 'app-add-equipment',
  imports: [ReactiveFormsModule, RouterLink, AdminShell, UiButton, UiIcon, UiInput, UiSelect],
  templateUrl: './add-equipment.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEquipment {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(EquipmentsService);
  private readonly router = inject(Router);

  protected readonly statuses = EQUIPMENT_STATUS_OPTIONS;
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    service: ['', [Validators.required]],
    status: ['ACTIVE', [Validators.required]],
  });

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Please complete all required fields');
      return;
    }

    const v = this.form.getRawValue();
    this.saving.set(true);
    this.error.set(null);

    this.api
      .create({
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
            this.error.set(res?.message ?? 'Failed to create equipment');
          }
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set(err?.error?.message ?? 'Unable to reach the server');
        },
      });
  }
}
