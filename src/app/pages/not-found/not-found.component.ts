import { Component } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { RouterModule } from '@angular/router';
  import { ButtonModule } from 'primeng/button';

  @Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule],
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.css']
  })
  export class NotFoundComponent {}
