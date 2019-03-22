const sidebar = require('../sidebar');
module.exports = {
    title: 'Velay',
    description: 'Vue pages and fragments',
    base: '/velay/',
    ga: 'UA-34013393-2',
    evergreen: true,
    themeConfig: {
        repo: 'thundernet8/Velay',
        docsDir: 'docs',
        editLinks: true,
        sidebar
    }
};
