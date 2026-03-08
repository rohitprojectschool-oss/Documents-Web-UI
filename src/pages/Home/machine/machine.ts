import { createMachine, assign } from 'xstate';
import type { HomeContext, HomeEvents, UserProfile, Country } from './types';

const homeMachine = createMachine({
  types: {} as {
    context: HomeContext;
    events: HomeEvents;
  },
  id: 'home',
  initial: 'loading',
  context: (): HomeContext => ({
    user: null,
    countries: [],
    activeRoute: 'dashboard',
    error: null,
  }),
  states: {
    loading: {
      type: 'parallel',
      states: {
        user: {
          initial: 'fetching',
          states: {
            fetching: {
              invoke: {
                src: 'fetchUser',
                onDone: {
                  target: 'done',
                  actions: assign({
                    user: ({ event }) => event.output as UserProfile,
                  }),
                },
                onError: {
                  target: 'done',
                  actions: assign({
                    error: ({ event }) => (event.error as Error).message,
                  }),
                },
              },
            },
            done: { type: 'final' },
          },
        },
        countries: {
          initial: 'fetching',
          states: {
            fetching: {
              invoke: {
                src: 'fetchCountries',
                onDone: {
                  target: 'done',
                  actions: assign({
                    countries: ({ event }) => event.output as Country[],
                  }),
                },
                onError: {
                  target: 'done',
                },
              },
            },
            done: { type: 'final' },
          },
        },
      },
      onDone: 'ready',
    },
    ready: {
      initial: 'dashboard',
      on: {
        NAVIGATE: [
          { guard: 'isDashboard', target: '.dashboard' },
          { guard: 'isInvoices', target: '.invoices' },
          { guard: 'isCustomers', target: '.customers' },
          { guard: 'isAnalytics', target: '.analytics' },
          { guard: 'isSettings', target: '.settings' },
          { guard: 'isUsers', target: '.users' },
        ],
      },
      states: {
        dashboard: {},
        invoices: {},
        customers: {},
        analytics: {},
        settings: {},
        users: {},
      },
    },
    error: {
      on: { RETRY: 'loading' },
    },
  },
});

export default homeMachine;
