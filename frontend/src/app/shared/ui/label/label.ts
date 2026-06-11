import { Directive } from '@angular/core';

@Directive({
  selector: 'label[uiLabel]',
  host: {
    class: 'select-none text-sm text-gray-500',
  },
})
export class UiLabel {}
