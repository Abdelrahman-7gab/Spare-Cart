import { trigger, transition, style, animate } from '@angular/animations';

export const itemEnterAnimation = trigger('itemEnter', [
  transition(':enter', [
    style({ transform: 'translateY(50px)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
  ]),
]);