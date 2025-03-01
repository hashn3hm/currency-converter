import { EventEmitter } from 'events';

// Create a global event bus
export const eventBus = new EventEmitter();

// Increase the number of listeners (default is 10)
eventBus.setMaxListeners(50);
