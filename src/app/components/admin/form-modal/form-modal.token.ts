import { InjectionToken } from '@angular/core';
import { Repository } from '../../../services/repository.interface';

export const REPOSITORY_SERVICE = new InjectionToken<Repository>('REPOSITORY_SERVICE');
