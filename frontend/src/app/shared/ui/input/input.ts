import { Directive } from '@angular/core';

/**
 * Text input: typed text stays gray-900, only placeholder is gray-500.
 * Border idle gray-500, hover secondary, focus ("active") primary.
 */
@Directive({
  selector: 'input[uiInput]',
  host: {
    class:
      'w-full rounded-lg border bg-white/90 px-3.5 py-2.5 text-sm shadow-sm ' +
      'border-gray-200 text-gray-900 placeholder:text-gray-400 ' +
      'transition-all duration-200 ease-out ' +
      'hover:border-secondary/70 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10',
  },
})
export class UiInput {}
