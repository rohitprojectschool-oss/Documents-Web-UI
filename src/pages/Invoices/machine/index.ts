import invoicesMachine from './machine';
import * as actors from './actors';
import * as guards from './guards';
import * as actions from './actions';

export default (additionalActions: Record<string, unknown> = {}) =>
  invoicesMachine.provide({
    actions: { ...actions, ...additionalActions },
    actors,
    guards,
  });
