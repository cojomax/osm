import { Component } from '@angular/core';
import { NavigationAdminComponent } from '../../navigation/admin/navigation-admin.component';

@Component({
    selector: 'app-admin-shell',
    imports: [NavigationAdminComponent],
    templateUrl: './admin-shell.component.html',
    styleUrl: './admin-shell.component.css'
})
export class AdminShellComponent {}
