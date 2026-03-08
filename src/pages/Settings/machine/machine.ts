import { createMachine, assign } from 'xstate';
import type { SettingsContext, SettingsEvents, SettingsData } from './types';

const settingsMachine = createMachine({
  types: {} as {
    context: SettingsContext;
    events: SettingsEvents;
  },
  id: 'settings',
  initial: 'loading',
  context: (): SettingsContext => ({
    data: null,
    error: null,
  }),
  states: {
    loading: {
      invoke: {
        src: 'fetchSettingsData',
        onDone: {
          target: 'loaded',
          actions: assign({
            data: ({ event }) => event.output as SettingsData,
          }),
        },
        onError: {
          target: 'error',
          actions: assign({
            error: ({ event }) => (event.error as Error).message,
          }),
        },
      },
    },
    loaded: {
      on: { REFRESH: 'loading', SAVE: 'loading' },
    },
    error: {
      on: { REFRESH: 'loading' },
    },
  },
});

export default settingsMachine;
