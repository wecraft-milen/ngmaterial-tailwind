import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, Observable, of, take } from 'rxjs';
import { WindowToken } from '../config/window';
import { RootVariables } from '../models/root-variables';

export type ThemeType = 'light' | 'dark';

export interface ThemeState {
  isDark: boolean;
  theme: ThemeType;
  isLoading: boolean;
}

declare const tinycolor: any;

export interface Color {
  name: string;
  hex: string;
  darkContrast: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  themeState: ThemeState = { isDark: false, theme: 'light', isLoading: true };
  theme$ = new BehaviorSubject<ThemeState>(this.themeState);
  private htmlElement: HTMLElement;
  private readonly themeKey = 'theme';

  constructor(
    @Inject(WindowToken) private window: Window,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.htmlElement = this.document.documentElement;
  }

  async init(): Promise<void> {
    try {
      // On page load or when changing themes, best to add inline in `head` to avoid FOUC (Flash Of Unstyled Content)
      let isDark = false;
      let isDarkMatchMedia = this.window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      let key = this.window.localStorage.getItem(this.themeKey);

      if (key?.includes('isDark')) {
        isDark = JSON.parse(key).isDark;
      } else {
        isDark = isDarkMatchMedia;
      }

      const cssRootVariables = await lastValueFrom(this.loadRootVariables());

      Object.entries(cssRootVariables.colors).forEach(([k, v]) =>
        this.generateThemeByColor(k, v)
      );

      Object.entries(cssRootVariables.typography).forEach(([k, v]) => {
        if (typeof v == 'string') {
          this.htmlElement.style.setProperty(`--${k}`, `${v}`);
        } else {
          this.setTypography(k, v);
        }
      });

      this.themeState = {
        ...this.themeState,
        isDark,
        theme: isDark ? 'dark' : 'light',
        isLoading: false,
      };

      this.theme$.next(this.themeState);
      this.theme$.pipe(take(1)).subscribe((res) => {
        this.htmlElement.classList.add(res.theme + '-theme');
        this.storeThemeData(res);
      });
    } catch (error) {
      console.log(error);
    }
  }

  switchTheme(): void {
    const isDark = !this.theme$.getValue().isDark;

    this.themeState = {
      ...this.themeState,
      isDark,
      theme: isDark ? 'dark' : 'light',
    };

    this.theme$.next(this.themeState);

    this.theme$.pipe(take(1)).subscribe((res) => {
      const dark: ThemeType = 'dark';
      const light: ThemeType = 'light';
      if (res.isDark) {
        this.htmlElement.classList.replace(`${light}-theme`, `${dark}-theme`);
      } else {
        this.htmlElement.classList.replace(`${dark}-theme`, `${light}-theme`);
      }
      this.storeThemeData(res);
    });
  }

  storeThemeData(data: ThemeState): void {
    this.window.localStorage.setItem(this.themeKey, JSON.stringify(data));
  }

  private loadRootVariables(): Observable<RootVariables> {
    return of<RootVariables>({
      colors: {
        primary: '#272e50',
        secondary: '#c1cbd0',
        success: '#28a745',
        info: '#2f96b4',
        warning: '#f89406',
        danger: '#dc3545',
        grey: '#e9ecef',
      },
      typography: {
        'font-family': `Roboto, "Helvetica Neue", sans-serif`,
        'display-4': {
          'font-size': '112px',
          'line-height': '112px',
          'font-weight': '300',
          'font-family': `'Segoe UI`,
          'letter-spacing': '-0.0134em',
        },
        'display-3': {
          'font-size': '56px',
          'line-height': '56px',
          'font-weight': '400',
          'font-family': `'Segoe UI`,
          'letter-spacing': '-0.0089em',
        },
        'display-2': {
          'font-size': '45px',
          'line-height': '48px',
          'font-weight': '400',
          'font-family': `'Segoe UI`,
          'letter-spacing': '0em',
        },
        'display-1': {
          'font-size': '34px',
          'line-height': '40px',
          'font-weight': '400',
          'font-family': `'Segoe UI`,
          'letter-spacing': '0.0074em',
        },
        headline: {
          'font-size': '24px',
          'line-height': '32px',
          'font-weight': '400',
          'font-family': `'Segoe UI`,
          'letter-spacing': '0em',
        },
        title: {
          'font-size': '20px',
          'line-height': '32px',
          'font-weight': '500',
          'font-family': `'Segoe UI`,
          'letter-spacing': '0.0075em',
        },
        'subheading-2': {
          'font-size': '16px',
          'line-height': '28px',
          'font-weight': '400',
          'font-family': `'Segoe UI`,
          'letter-spacing': '0.0094em',
        },
        'subheading-1': {
          'font-size': '15px',
          'line-height': '24px',
          'font-weight': '500',
          'font-family': `'Segoe UI`,
          'letter-spacing': '0.0067em',
        },
        'body-2': {
          'font-size': '14px',
          'line-height': '24px',
          'font-weight': '500',
          'font-family': `'Segoe UI`,
          'letter-spacing': '0.0179em',
        },
        'body-1': {
          'font-size': '14px',
          'line-height': '20px',
          'font-weight': '400',
          'font-family': `'Segoe UI`,
          'letter-spacing': '0.0179em',
        },
        button: {
          'font-size': '14px',
          'line-height': '14px',
          'font-weight': '500',
          'font-family': `'Segoe UI`,
          'letter-spacing': '0.0893em',
        },
        caption: {
          'font-size': '12px',
          'line-height': '20px',
          'font-weight': '400',
        },
      },
    });
  }

  private generateThemeByColor(name: string, color: string) {
    const colorPalette = this.computeColors(color);

    for (const color of colorPalette) {
      const key1 = `--${name}-${color.name}`;
      const value1 = color.hex;
      this.htmlElement.style.setProperty(key1, value1);

      const key2 = `--${name}-contrast-${color.name}`;
      const value2 = color.darkContrast ? 'black' : 'white';
      this.htmlElement.style.setProperty(key2, value2);
    }
  }

  private computeColors(hex: string): Color[] {
    return [
      this.getColorObject(tinycolor(hex).lighten(52), '50'),
      this.getColorObject(tinycolor(hex).lighten(37), '100'),
      this.getColorObject(tinycolor(hex).lighten(26), '200'),
      this.getColorObject(tinycolor(hex).lighten(12), '300'),
      this.getColorObject(tinycolor(hex).lighten(6), '400'),
      this.getColorObject(tinycolor(hex), '500'),
      this.getColorObject(tinycolor(hex).darken(6), '600'),
      this.getColorObject(tinycolor(hex).darken(12), '700'),
      this.getColorObject(tinycolor(hex).darken(18), '800'),
      this.getColorObject(tinycolor(hex).darken(24), '900'),
      this.getColorObject(tinycolor(hex).lighten(50).saturate(30), 'A100'),
      this.getColorObject(tinycolor(hex).lighten(30).saturate(30), 'A200'),
      this.getColorObject(tinycolor(hex).lighten(10).saturate(15), 'A400'),
      this.getColorObject(tinycolor(hex).lighten(5).saturate(5), 'A700'),
    ];
  }

  private getColorObject(value: any, name: any): Color {
    const c = tinycolor(value);
    return {
      name: name,
      hex: c.toHexString(),
      darkContrast: c.isLight(),
    };
  }

  private async setTypography(key: any, value: any): Promise<void> {
    Object.entries(value).forEach(([k, v]) => {
      this.htmlElement.style.setProperty(`--${key}-${k}`, `${v}`);
    });
  }
}
