export type Theme = 'dark' | 'light';

export interface NavbarContext {
  dropdownOpen: boolean;
  theme: Theme;
}

export type NavbarEvents =
  | { type: 'TOGGLE_DROPDOWN' }
  | { type: 'CLOSE_DROPDOWN' }
  | { type: 'TOGGLE_THEME' };
