const fabric = require('@umijs/fabric');

const stylelint = fabric.stylelint;
stylelint.extends.splice(2, 1); // order plugin
stylelint.rules['comment-empty-line-before'] = 'never';
stylelint.rules['selector-pseudo-element-colon-notation'] = ['single', 'double'];
module.exports = {
    ...stylelint,
};
