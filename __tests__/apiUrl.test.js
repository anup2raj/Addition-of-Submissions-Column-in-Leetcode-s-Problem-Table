const utils = require('../utils/config');
const { getApiUrl } = require(utils.fileToTest);

describe('API URL:', () => {
    it('should be the API for getting all problems', () => {
        expect(getApiUrl()).toMatch(/https:\/\/leetcode.com\/api\/problems\/all\//);
    });
});
