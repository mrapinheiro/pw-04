module.exports = {
  extends: ['react-app', 'react-app/jest'],
  globals: {
    BigUint64Array: 'readonly',
    FinalizationRegistry: 'readonly'
  }
};
