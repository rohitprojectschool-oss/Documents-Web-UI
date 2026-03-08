import { createMachine } from 'xstate';
import type { AppContext, AppEvents } from './types';

// Minimal app-level machine.
// Future use: authentication, login redirect, permission checks, environment setup.
const appMachine = createMachine({
  types: {} as {
    context: AppContext;
    events: AppEvents;
  },
  id: 'app',
  initial: 'home',
  context: (): AppContext => ({}),
  states: {
    // Future states: 'login', 'unauthorized', 'maintenance', etc.
    home: {},
  },
});

export default appMachine;
