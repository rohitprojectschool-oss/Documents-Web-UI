import { createMachine, assign } from 'xstate';
import type { AnalyticsContext, AnalyticsEvents, AnalyticsData } from './types';

const analyticsMachine = createMachine({
  types: {} as {
    context: AnalyticsContext;
    events: AnalyticsEvents;
  },
  id: 'analytics',
  initial: 'loading',
  context: (): AnalyticsContext => ({
    data: null,
    error: null,
  }),
  states: {
    loading: {
      invoke: {
        src: 'fetchAnalyticsData',
        onDone: {
          target: 'loaded',
          actions: assign({
            data: ({ event }) => event.output as AnalyticsData,
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
      on: { REFRESH: 'loading' },
    },
    error: {
      on: { REFRESH: 'loading' },
    },
  },
});

export default analyticsMachine;
