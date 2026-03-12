import { createMachine, assign } from 'xstate';
import type { InvoicesContext, InvoicesEvents, Invoice, InvoiceForm } from './types';

const INITIAL_FORM: InvoiceForm = {
  sourceReference: '',
  customer: '',
  grossAmount: '',
  docType: 'Standard Invoice',
  countryCode: 'AO',
  file: null,
};

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
    dateRange: 'all',
    withDocsOnly: false,
    error: null,
    showModal: false,
    selectedDocument: null,
    formData: { ...INITIAL_FORM },
  }),
  states: {
    loading: {
      invoke: {
        src: 'fetchInvoices',
        onDone: {
          target: 'loaded',
          actions: assign({
            invoices: ({ event }) => event.output,
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
        SELECT_DATE_RANGE: {
          actions: assign({
            dateRange: ({ event }) => event.range,
          }),
        },
        TOGGLE_WITH_DOCS_ONLY: {
          actions: assign({
            withDocsOnly: ({ event }) => event.value,
          }),
        },
        CLEAR_FILTERS: {
          actions: assign({
            selectedCountry: 'all',
            selectedStatus: 'all',
            searchQuery: '',
            dateRange: 'all',
            withDocsOnly: false,
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
            formData: ({ context, event }) => (event.show ? context.formData : { ...INITIAL_FORM }),
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
        UPLOAD_DOCUMENT: 'uploading',
        OPEN_DETAILS: {
          actions: assign({
            selectedDocument: ({ event }) => event.document,
          }),
        },
        CLOSE_DETAILS: {
          actions: assign({
            selectedDocument: null,
          }),
        },
      },
    },
    uploading: {
      invoke: {
        src: 'uploadInvoice',
        input: ({ context }) => ({
          ...context.formData,
          grossAmount: parseFloat(context.formData.grossAmount || '0'),
          // countryName is handled by actor or backend usually, but for completeness:
          countryName: context.formData.countryCode === 'AO' ? 'Angola' : 
                       context.formData.countryCode === 'NG' ? 'Nigeria' :
                       context.formData.countryCode === 'PT' ? 'Portugal' :
                       context.formData.countryCode === 'SA' ? 'Saudi Arabia' :
                       context.formData.countryCode === 'GR' ? 'Greece' : 'Angola'
        }),
        onDone: {
          target: 'loaded',
          actions: assign({
            invoices: ({ context, event }) => [event.output, ...context.invoices],
            showModal: false,
            formData: { ...INITIAL_FORM },
          }),
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

export default invoicesMachine;
