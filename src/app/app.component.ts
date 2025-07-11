import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from '@nz/layout';
import { register } from 'swiper/element/bundle';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, NzLayoutModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  ngOnInit() {
    // Register Swiper web components
    register();
  }
}
