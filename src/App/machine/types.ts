// Minimal context for now — will grow with auth, permissions, environment config.
export type AppContext = Record<string, never>;

export type AppEvents = { type: 'LOGOUT' };
