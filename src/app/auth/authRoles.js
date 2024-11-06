/**
 * Authorization Roles
 */
const authRoles = {
  admin: ['admin'],
  staff: ['storeUser', 'storeAdmin'],
  user: ['storeUser', 'storeAdmin'],
  onlyGuest: [],
};

export default authRoles;
