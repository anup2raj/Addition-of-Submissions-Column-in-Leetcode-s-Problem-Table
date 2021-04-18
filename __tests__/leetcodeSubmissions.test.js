const utils = require('../utils/config');
const { createSubmissionColumnForLeetCode } = require(utils.fileToTest);
const webPage = require('../utils/webPage.json')
const fetchMockData = require('../utils/data.json');
const {expectOr} = require('../utils/utils');

const mockApiCall = (mockSuccessResponse) => {
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({ // 3
        json: () => mockJsonPromise,
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
}
mockApiCall(fetchMockData);

let allProblemsData = transformData(fetchMockData.stat_status_pairs);

describe('Test the complete functionality of the script', () => {
    beforeEach(async () => {
        mockApiCall(fetchMockData);
        document.body.innerHTML = webPage.body;
    })

    it('should add a new column section on leetcode\'s problem set table', async () => {
        let allProblemRowElements = getAllProblemRowElementsExpected()
        let allProblems = allProblemsData;

        await createSubmissionColumnForLeetCode();

        const submissionElement = document.querySelector("#question-app > div > div:nth-child(2) > div.question-list-base > div.table-responsive.question-list-table > table > thead > tr > th:nth-child(8)");
        expect(submissionElement).not.toBeNull();

        const strongElement = submissionElement.querySelector("strong");
        expect(strongElement).not.toBeNull();
        expectOr(
            () => expect(strongElement.innerText.trim()).toEqual("Submissions"),
            () => expect(strongElement.textContent.trim()).toEqual("Submissions")
        )

        allProblemRowElements.forEach((rowElement) => {
            let submissionColumn = rowElement.querySelector("td:nth-child(8)");
            expect(submissionColumn).not.toBeNull();
            let problemId = rowElement.getElementsByTagName("td")[1].innerHTML;
            let problemExpectedData = getProblemDataByIdExpected(problemId, allProblems);

            let formatRegex = /[0-9]+\/[0-9]+/
            expectOr(
                () => expect(submissionColumn.innerText).toMatch(formatRegex),
                () => expect(submissionColumn.textContent).toMatch(formatRegex)
            )
            let submissionData = submissionColumn.innerText;
            if (!submissionData || !submissionData.match(formatRegex)) {
                submissionData = submissionColumn.textContent;
            }
            let [totalAcs, totalSubmitted] = submissionData.split('/');

            totalAcs = parseInt(totalAcs);
            totalSubmitted = parseInt(totalSubmitted);

            expect(totalAcs).toEqual(problemExpectedData.total_acs);
            expect(totalSubmitted).toEqual(problemExpectedData.total_submitted);
        })
    });
});

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

function getAllProblemRowElementsExpected() {
    let allProblemRow = document.querySelectorAll(
        "#question-app > div > div:nth-child(2) > div.question-list-base > div.table-responsive.question-list-table > table > tbody.reactable-data > tr");
    return Array.from(allProblemRow);
}

function getProblemDataByIdExpected(id, allProblems){
    return allProblems.find(object => {
        return object.id === parseInt(id.trim());
    });
}
