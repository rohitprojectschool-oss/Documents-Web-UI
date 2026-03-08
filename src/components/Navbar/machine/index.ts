import navbarMachine from './machine';
import * as actors from './actors';
import * as guards from './guards';
import * as actions from './actions';

export default (additionalActions: Record<string, unknown> = {}) =>
  navbarMachine.provide({
    actions: { ...actions, ...additionalActions },
    actors,
    guards,
  });
