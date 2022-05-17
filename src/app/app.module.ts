import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { ThemeService } from './services/theme.service';
import { windowProvider, WindowToken } from './config/window';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, MatButtonModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (themeService: ThemeService) => () =>
        new Promise<void>((resolve) => {
          themeService.init();
          resolve();
        }),
      deps: [ThemeService],
      multi: true,
    },
    {
      provide: WindowToken,
      useFactory: windowProvider,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
