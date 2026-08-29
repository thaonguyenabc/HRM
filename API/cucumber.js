module.exports = {
    default: [
        'src/features/**/*.feature',
        '--require-module ts-node/register/transpile-only',
        '--require src/steps/**/*.ts',
        '--require src/support/**/*.ts',
        '--format progress-bar',
        '--format json:report/cucumber-report.json'
    ].join(' ')
};
