try {
	const matchers = require('@testing-library/jest-dom/matchers');
	const { expect } = require('vitest');
	expect.extend(matchers);
} catch (e) {
}
