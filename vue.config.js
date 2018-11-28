module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/faux/' : '/',
  css: {
    loaderOptions: {
      sass: {
        data: `@import 'node_modules/spectre.css/src/variables.scss';
        @import 'node_modules/spectre.css/src/mixins.scss';
        @import 'node_modules/spectre.css/src/normalize.scss';
        @import 'node_modules/spectre.css/src/base.scss';
        @import 'node_modules/spectre.css/src/buttons.scss';
        @import 'node_modules/spectre.css/src/forms.scss';
        @import 'node_modules/spectre.css/src/icons/icons-core.scss';
        @import 'node_modules/spectre.css/src/layout.scss';
        @import 'node_modules/spectre.css/src/modals.scss';
        @import 'node_modules/spectre.css/src/navbar.scss';
        @import 'node_modules/spectre.css/src/tables.scss';
        @import 'node_modules/spectre.css/src/tabs.scss';
        @import 'node_modules/spectre.css/src/typography.scss';
        @import 'node_modules/spectre.css/src/utilities.scss';
        `
      }
    }
  }
}
