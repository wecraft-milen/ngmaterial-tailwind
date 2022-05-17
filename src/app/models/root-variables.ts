export interface RootColors {
  primary: string;
  secondary: string;
  success: string;
  info: string;
  warning: string;
  danger: string;
  grey: string;
}

export interface RootTypography {
  'font-family': string;
  'display-4': {
    'font-size': string;
    'line-height': string;
    'font-weight': string;
    'font-family'?: string;
    'letter-spacing'?: string;
  };
  'display-3': {
    'font-size': string;
    'line-height': string;
    'font-weight': string;
    'font-family'?: string;
    'letter-spacing'?: string;
  };
  'display-2': {
    'font-size': string;
    'line-height': string;
    'font-weight': string;
    'font-family'?: string;
    'letter-spacing'?: string;
  };
  'display-1': {
    'font-size': string;
    'line-height': string;
    'font-weight': string;
    'font-family'?: string;
    'letter-spacing'?: string;
  };
  headline: {
    'font-size': string;
    'line-height': string;
    'font-weight': string;
    'font-family'?: string;
    'letter-spacing'?: string;
  };
  title: {
    'font-size': string;
    'line-height': string;
    'font-weight': string;
    'font-family'?: string;
    'letter-spacing'?: string;
  };
  'subheading-2': {
    'font-size': string;
    'line-height': string;
    'font-weight': string;
    'font-family'?: string;
    'letter-spacing'?: string;
  };
  'subheading-1': {
    'font-size': string;
    'line-height': string;
    'font-weight': string;
    'font-family'?: string;
    'letter-spacing'?: string;
  };
  'body-2': {
    'font-size': string;
    'line-height': string;
    'font-weight': string;
    'font-family'?: string;
    'letter-spacing'?: string;
  };
  'body-1': {
    'font-size': '14px';
    'line-height': '20px';
    'font-weight': '400';
    'font-family'?: string;
    'letter-spacing'?: string;
  };
  button: {
    'font-size': '14px';
    'line-height': '14px';
    'font-weight': '500';
    'font-family'?: string;
    'letter-spacing'?: string;
  };
  caption: {
    'font-size': string;
    'line-height': string;
    'font-weight': string;
    'font-family'?: string;
    'letter-spacing'?: string;
  };
}

export interface RootVariables {
  colors: RootColors;
  typography: RootTypography;
}
