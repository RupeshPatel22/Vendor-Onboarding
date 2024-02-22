import { animate, style, transition, trigger } from '@angular/animations';
export const fadeIn: any = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('0.2s', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('0.2s', style({ opacity: 0 }))
  ])
]);
export const fadeDelay: any = trigger('fadeDelay', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('0.4s 0.4s', style({ opacity: 1 }))])
]);
