import { InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const BOUNDARY = 786;

export const IS_MOBILE = new InjectionToken<Observable<boolean>>('app-is-mobile');

export const isMobileFactory = () => {
  const isMobileSbj = new BehaviorSubject<boolean>(window.innerWidth < BOUNDARY);

  window.onresize = () => {
    isMobileSbj.next(window.innerWidth < BOUNDARY);
  };

  return isMobileSbj.asObservable();
};
