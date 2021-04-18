const functions = require('../leetcode');
const axios = require('axios');

jest.mock('axios');

describe('Tests for API interaction', () => {
    it('', async () => {
        var problemData = require('../data.json');
        axios.get.mockResolvedValue({data: problemData});
        let allproblems = await functions.getAllProblems();
        expect(axios.get).toHaveBeenCalled();
        expect(axios.get).toHaveBeenCalledWith('https://leetcode.com/api/problems/all/');
        expect(allproblems).toEqual(problemData);
    });
});
