const utils = require('../utils/config');
const { getApiUrl, getAllProblems } = require(utils.fileToTest);
const fetchMockData = require('../utils/data.json');

const mockApiCall = (mockSuccessResponse) => {
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({ // 3
        json: () => mockJsonPromise,
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
}

function reducer(accumulator, object) {
    accumulator.push({
        id: object.stat.frontend_question_id,
        total_submitted: object.stat.total_submitted,
        total_acs: object.stat.total_acs
    });
    return accumulator;
}

function transformData(data) {
    return data.reduce(reducer,[]);
}

const expectedResult = transformData(fetchMockData.stat_status_pairs);
expectedResult.sort();

describe('Test for getting all problems in the given format', () => {
    beforeEach(() => {
        mockApiCall(fetchMockData);
    })
    it('should not return null or undefined' , async () => {
        const problems = await getAllProblems(getApiUrl());
        expect(problems).not.toBeNull();
    })
    it('should return all the problems fetched from the API call in correct format', async () => {
        const problems = await getAllProblems(getApiUrl());
        problems.sort();
        expect(problems).toStrictEqual(expectedResult);
        expect(global.fetch).toHaveBeenCalledWith(getApiUrl());
    });
});
