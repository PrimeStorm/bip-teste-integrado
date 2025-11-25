import { Component } from '@angular/core';
import { BeneficioListComponent } from './components/beneficio-list/beneficio-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BeneficioListComponent], 
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {  
  title = 'frontend';
}
