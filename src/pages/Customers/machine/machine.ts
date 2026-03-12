import { createMachine, assign } from 'xstate';
import type { CustomersContext, CustomersEvents, Customer, CustomerForm } from './types';

const INITIAL_FORM: CustomerForm = {
  customer_id: '',
  customer_tax_id: '',
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  customer_address_line1: '',
  customer_address_line2: '',
  customer_state: '',
  customer_country_code: 'AO',
  customer_postal_code: '',
};

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
    showModal: false,
    formData: { ...INITIAL_FORM },
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
        TOGGLE_MODAL: {
          actions: assign({
            showModal: ({ event }) => event.show,
            formData: ({ context, event }) => event.show ? context.formData : { ...INITIAL_FORM },
          }),
        },
        UPDATE_FORM: {
          actions: assign({
            formData: ({ context, event }) => ({
              ...context.formData,
              [event.field]: event.value,
            }),
          }),
        },
        ADD_CUSTOMER: 'submitting',
      },
    },
    submitting: {
      invoke: {
        src: 'addCustomer',
        input: ({ context }) => context.formData,
        onDone: {
          target: 'loaded',
          actions: [
            assign({
              customers: ({ context, event }) => [event.output, ...context.customers],
              showModal: false,
              formData: { ...INITIAL_FORM },
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
