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
    editingId: null,
    showDeleteConfirm: null,
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
            error: null,
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
            editingId: ({ event }) => event.show ? null : null,
            formData: ({ context, event }) => event.show ? context.formData : { ...INITIAL_FORM },
            error: null,
          }),
        },
        EDIT_CUSTOMER: {
          actions: assign({
            showModal: true,
            editingId: ({ event }) => event.customer.id,
            error: null,
            formData: ({ event }) => ({
              customer_id: event.customer.customerId,
              customer_tax_id: event.customer.taxId,
              customer_name: event.customer.name,
              customer_email: event.customer.email || '',
              customer_phone: event.customer.phone || '',
              customer_address_line1: event.customer.addressLine1 || '',
              customer_address_line2: event.customer.addressLine2 || '',
              customer_state: event.customer.state || '',
              customer_country_code: event.customer.countryCode,
              customer_postal_code: event.customer.postalCode || '',
            }),
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
        SAVE_CUSTOMER: 'updating',
        CONFIRM_DELETE: {
          actions: assign({
            showDeleteConfirm: ({ event }) => event.id,
          }),
        },
        DELETE_CUSTOMER: 'deleting',
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
              customers: ({ context, event }) => [event.output as Customer, ...context.customers],
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
    updating: {
      invoke: {
        src: 'updateCustomer',
        input: ({ context }) => ({
          id: context.editingId!,
          data: context.formData,
        }),
        onDone: {
          target: 'loaded',
          actions: [
            assign({
              customers: ({ context, event }) => context.customers.map(c => 
                c.id === (event.output as Customer).id ? (event.output as Customer) : c
              ),
              showModal: false,
              editingId: null,
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
    deleting: {
      invoke: {
        src: 'deleteCustomer',
        input: ({ context }) => context.showDeleteConfirm!,
        onDone: {
          target: 'loaded',
          actions: [
            assign({
              customers: ({ context, event }) => context.customers.filter(c => c.id !== (event.output as string)),
              showDeleteConfirm: null,
            }),
          ],
        },
        onError: {
          target: 'loaded',
          actions: assign({
            error: ({ event }) => (event.error as Error).message,
            showDeleteConfirm: null,
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
