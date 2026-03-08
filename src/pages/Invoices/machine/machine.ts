import { createMachine, assign } from 'xstate';
import type { InvoicesContext, InvoicesEvents, Invoice } from './types';

const invoicesMachine = createMachine({
  types: {} as {
    context: InvoicesContext;
    events: InvoicesEvents;
  },
  id: 'invoices',
  initial: 'loading',
  context: (): InvoicesContext => ({
    invoices: [],
    selectedCountry: 'all',
    selectedStatus: 'all',
    searchQuery: '',
    error: null,
  }),
  states: {
    loading: {
      invoke: {
        src: 'fetchInvoices',
        onDone: {
          target: 'loaded',
          actions: assign({
            invoices: ({ event }) => event.output as Invoice[],
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
      on: {
        REFRESH: 'loading',
        SELECT_COUNTRY: {
          actions: assign({
            selectedCountry: ({ event }) => event.country,
          }),
        },
        SELECT_STATUS: {
          actions: assign({
            selectedStatus: ({ event }) => event.status,
          }),
        },
        SEARCH: {
          actions: assign({
            searchQuery: ({ event }) => event.query,
          }),
        },
      },
    },
    error: {
      on: { REFRESH: 'loading' },
    },
  },
});

export default invoicesMachine;
