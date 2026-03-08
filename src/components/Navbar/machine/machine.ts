import { createMachine, assign } from 'xstate';
import type { NavbarContext, NavbarEvents, Theme } from './types';

const navbarMachine = createMachine({
  types: {} as {
    context: NavbarContext;
    events: NavbarEvents;
  },
  id: 'navbar',
  initial: 'active',
  context: (): NavbarContext => ({
    dropdownOpen: false,
    theme: (document.documentElement.classList.contains('light') ? 'light' : 'dark'),
  }),
  states: {
    active: {
      on: {
        TOGGLE_DROPDOWN: {
          actions: assign({
            dropdownOpen: ({ context }) => !context.dropdownOpen,
          }),
        },
        CLOSE_DROPDOWN: {
          actions: assign({
            dropdownOpen: () => false,
          }),
        },
        TOGGLE_THEME: {
          actions: assign({
            theme: ({ context }): Theme => {
              const newTheme: Theme = context.theme === 'dark' ? 'light' : 'dark';
              document.documentElement.className = newTheme;
              localStorage.setItem('crimson:theme', newTheme);
              return newTheme;
            },
          }),
        },
      },
    },
  },
});

export default navbarMachine;
