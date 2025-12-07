/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // disable default ones so only our message shows
    'type-empty': [0, 'never'],
    'subject-empty': [0, 'never'],

    'custom-format-help': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'custom-format-help': (parsed) => {
          const { header, type, subject } = parsed;

          // If either type or subject is missing, show our custom help
          if (!type || !subject) {
            const msgLines = [
              '❌ Invalid commit message format!',
              '',
              `  Current: ${header || '<empty>'}`,
              '',
              '  Expected format:',
              '    <type>: <subject>',
              '',
              '  Examples:',
              '    feat: add login API',
              '    fix: handle null pointer in user service',
              '    docs: add express + ts setup guide',
              '',
              '  Allowed types (default conventional):',
              '    feat, fix, docs, style, refactor, test, chore, perf, ci, build',
              '',
            ];

            return [false, msgLines.join('\n')];
          }

          return [true, ''];
        },
      },
    },
  ],
};
