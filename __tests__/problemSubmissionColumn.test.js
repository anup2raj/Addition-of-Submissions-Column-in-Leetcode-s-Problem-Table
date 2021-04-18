const utils = require('../utils/config');
const { addSubmissionsToEachProblem } = require(utils.fileToTest);
const webPage = require('../utils/webPage.json')
const {expectOr} = require('../utils/utils')

let allProblemsData = require('../utils/data.json');
allProblemsData = transformData(allProblemsData.stat_status_pairs);

describe('Test adding number of submissions for each problem row', () => {
    beforeEach(async () => {
        document.body.innerHTML = webPage.body;
    })
    it('should add a new td element in each row', async () => {
        let allProblemRowElements = getAllProblemRowElementsExpected()

        addSubmissionsToEachProblem(allProblemRowElements, allProblemsData);

        allProblemRowElements.forEach((rowElement) => {
            let submissionColumn = rowElement.querySelector("td:nth-child(8)");
            expect(submissionColumn).not.toBeNull();
        })
    });

    it('should add data to each row in total_acs/total_submitted format', async () => {
        let allProblemRowElements = getAllProblemRowElementsExpected().filter(element => element !== undefined)
        addSubmissionsToEachProblem(allProblemRowElements, allProblemsData);

        allProblemRowElements.forEach((rowElement) => {
            let submissionColumn = rowElement.querySelector("td:nth-child(8)");
            expect(submissionColumn).not.toBeNull();

            let formatRegex = /[0-9]+\/[0-9]+/
            expectOr(
                () => expect(submissionColumn.innerText).toMatch(formatRegex),
                () => expect(submissionColumn.textContent).toMatch(formatRegex)
            )
        })
    });

    it('should add the correct data to each row', async () => {
        let allProblemRowElements = getAllProblemRowElementsExpected()
        let allProblems = allProblemsData;

        addSubmissionsToEachProblem(allProblemRowElements, allProblems);

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
