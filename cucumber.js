module.exports = {
    default: [
        'src/features/**/*.feature',
        '--require-module ts-node/register/transpile-only',
        '--require src/steps/**/*.ts',
        '--require src/api/steps/**/*.ts',
        '--require src/support/config.ts',
        '--require src/support/world.ts',
        '--require src/support/hooks.ts',
        '--format json:report/cucumber-report.json',
        '--format @cucumber/pretty-formatter'
    ].join(' ')
};