'use strict';

const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isPlainObject } = require('../../utils/validateTypes');

const ruleName = 'at-rule-property-required-list';

const messages = ruleMessages(ruleName, {
	expected: (property, atRule) => `Expected property "${property}" for at-rule "${atRule}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/at-rule-property-required-list',
};

/** @type {import('stylelint').Rule<Record<string, string[]>>} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isPlainObject],
		});

		if (!validOptions) {
			return;
		}

		root.walkAtRules((atRule) => {
			if (!isStandardSyntaxAtRule(atRule)) {
				return;
			}

			const { name, nodes } = atRule;
			const atRuleName = name.toLowerCase();

			if (!primary[atRuleName]) {
				return;
			}

			for (const property of primary[atRuleName]) {
				const propertyName = property.toLowerCase();

				const hasProperty = nodes.find(
					(node) => node.type === 'decl' && node.prop.toLowerCase() === propertyName,
				);

				if (hasProperty) {
					continue;
				}

				report({
					message: messages.expected(propertyName, atRuleName),
					node: atRule,
					result,
					ruleName,
				});
				continue;
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
