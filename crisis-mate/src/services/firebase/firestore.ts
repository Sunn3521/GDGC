export * from './userService';
export * from './contactService';
export * from './emergencyService';

import userService from './userService';
import contactService from './contactService';
import emergencyService from './emergencyService';

export default {
  ...userService,
  ...contactService,
  ...emergencyService,
};
