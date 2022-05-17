import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ngmaterial-tailwind';

  constructor(private theme: ThemeService) {}

  switchTheme(): void {
    this.theme.switchTheme();
  }
}
