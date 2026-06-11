import { Directive } from '@angular/core';

/**
 * Text input: typed text stays gray-900, only placeholder is gray-500.
 * Border idle gray-500, hover secondary, focus ("active") primary.
 */
@Directive({
  selector: 'input[uiInput]',
  host: {
    class:
      'w-full rounded-md border bg-white px-3.5 py-2.5 text-sm ' +
      'border-gray-500 text-gray-900 placeholder:text-gray-500 ' +
      'transition-colors duration-200 ease-out ' +
      'hover:border-secondary focus:border-primary focus:outline-none',
  },
})
export class UiInput {}
