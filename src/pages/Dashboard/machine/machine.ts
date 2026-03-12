import { createMachine, assign } from 'xstate';

import type { DashboardContext, DashboardEvents, InvoiceForm } from './types';
import type { DashboardData } from './actors';

const INITIAL_FORM: InvoiceForm = {
  sourceReference: '',
  customer: '',
  grossAmount: '',
  docType: 'Standard Invoice',
  countryCode: 'AO',
  file: null,
};

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
    showModal: false,
    selectedDocument: null,
    formData: { ...INITIAL_FORM },
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
      on: { 
        REFRESH: 'loading',
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
        }),
        onDone: {
          target: 'loading', // Reload to refresh all stats
          actions: assign({
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

export default dashboardMachine;
