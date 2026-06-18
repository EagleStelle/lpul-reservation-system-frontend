import { Directive } from '@angular/core';
import { BrnInput } from '@spartan-ng/brain/input';

/** Text input. Built on spartan/brain input (field + validation state). */
@Directive({
  selector: 'input[uiInput]',
  hostDirectives: [BrnInput],
  host: {
    class:
      'w-full rounded-lg glass-field px-4 py-2 text-sm sm:px-3.5 sm:py-2.5 sm:text-sm ' +
      'text-gray-900 dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-400 ' +
      'transition-all duration-200 hover:border-secondary/45 hover:ring-secondary/25 ' +
      'focus:border-primary/55 focus:ring-2 focus:ring-primary/35 focus:outline-none',
  },
})
export class UiInput {}
