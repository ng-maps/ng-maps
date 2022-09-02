const {
  utils: { getProjects },
} = require('@commitlint/config-nx-scopes');

module.exports = {
  rules: {
    'scope-enum': async (ctx) => [
      2,
      'always',
      ['deps', 'deps-dev', ...(await getProjects(ctx))],
    ],
  },
};
