import { createMachine, assign } from 'xstate';
import type { CustomersContext, CustomersEvents, Customer } from './types';

const customersMachine = createMachine({
  types: {} as {
    context: CustomersContext;
    events: CustomersEvents;
  },
  id: 'customers',
  initial: 'loading',
  context: (): CustomersContext => ({
    customers: [],
    selectedCountry: 'all',
    searchQuery: '',
    error: null,
  }),
  states: {
    loading: {
      invoke: {
        src: 'fetchCustomers',
        onDone: {
          target: 'loaded',
          actions: assign({
            customers: ({ event }) => event.output as Customer[],
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
        SEARCH: {
          actions: assign({
            searchQuery: ({ event }) => event.query,
          }),
        },
        ADD_CUSTOMER: 'submitting',
      },
    },
    submitting: {
      invoke: {
        src: 'addCustomer',
        input: ({ event }) => event.data,
        onDone: {
          target: 'loaded',
          actions: [
            assign({
              customers: ({ context, event }) => [event.output, ...context.customers],
            }),
          ],
        },
        onError: {
          target: 'loaded',
          actions: assign({
            error: ({ event }) => (event.error as Error).message,
          }),
        },
      },
    },
    error: {
      on: { REFRESH: 'loading' },
    },
  },
});

export default customersMachine;
