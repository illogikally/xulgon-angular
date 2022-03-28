import {animate, style, transition, trigger} from "@angular/animations";

export const slideInOutRight =
trigger('slideInOutRight', [
  transition(':enter', [
    style({
        position: 'relative',
        transform: 'translateX(100%)',
        opacity: '1',
      }),
      animate(
        '.15s ease-in',
        style({
          transform: 'translateX(0%)',
          opacity: '1'
        })
      ),
    ]),
    transition(':leave', [
      style({
        position: 'absolute',
        top: '0',
        opacity: '1'
      }),
      animate(
        '.15s ease-out',
        style({
          transform: 'translateX(100%)',
          opacity: '0'
        })
      ),
  ])
]);
