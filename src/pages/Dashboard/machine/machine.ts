import { createMachine, assign } from 'xstate';
import type { DashboardContext, DashboardEvents } from './types';
import type { DashboardData } from './actors';

const dashboardMachine = createMachine({
  types: {} as {
    context: DashboardContext;
    events: DashboardEvents;
  },
  id: 'dashboard',
  initial: 'loading',
  context: (): DashboardContext => ({
    stats: null,
    activityData: [],
    countryData: [],
    docDistribution: [],
    recentDocuments: [],
    error: null,
  }),
  states: {
    loading: {
      invoke: {
        src: 'fetchDashboardData',
        onDone: {
          target: 'loaded',
          actions: assign(({ event }) => {
            const data = event.output as DashboardData;
            return {
              stats: data.stats,
              activityData: data.activityData,
              countryData: data.countryData,
              docDistribution: data.docDistribution,
              recentDocuments: data.recentDocuments,
            };
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

export default dashboardMachine;
