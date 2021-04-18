const utils = require('../utils/config');
const { getAllProblemRowElements } = require(utils.fileToTest);
const webPage = require('../utils/webPage.json')

describe('Test getting all table row elements', () => {
    beforeEach(async () => {
        document.body.innerHTML = webPage.body;
    })

    it('should not return null or undefined', () => {
        let tableRowElements = getAllProblemRowElements();
        let expectedRowElements = getAllProblemRowElementsExpected();
        tableRowElements.sort();
        expectedRowElements.sort();
        expect(tableRowElements).not.toBeNull();
    })

    it('should fetch the row elements for each problem in an Array', () => {
        let tableRowElements = getAllProblemRowElements();
        let expectedRowElements = getAllProblemRowElementsExpected();
        tableRowElements.sort();
        expectedRowElements.sort();
        expect(tableRowElements).toStrictEqual(expectedRowElements);
    })
})

function getAllProblemRowElementsExpected() {
    let allProblemRow = document.querySelectorAll(
        "#question-app > div > div:nth-child(2) > div.question-list-base > div.table-responsive.question-list-table > table > tbody.reactable-data > tr");
    return Array.from(allProblemRow);
}
