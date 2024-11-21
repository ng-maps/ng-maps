import nxScopes from '@commitlint/config-nx-scopes';

export default {
  rules: {
    'scope-enum': (ctx) => [
      2,
      'always',
      ['deps', 'deps-dev', ...nxScopes.utils.getProjects(ctx)],
    ],
  },
};
