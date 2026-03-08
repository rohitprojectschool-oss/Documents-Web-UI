import { createMachine } from 'xstate';
import type { UsersContext, UsersEvents } from './types';

const usersMachine = createMachine({
  types: {} as {
    context: UsersContext;
    events: UsersEvents;
  },
  id: 'users',
  initial: 'idle',
  context: (): UsersContext => ({
    error: null,
  }),
  states: {
    idle: {},
  },
});

export default usersMachine;
