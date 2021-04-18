/* Step 1: Adding Submission column header to the table -
 *         a. Find the table header element.
 *         b. Create the Submission header <th> element.
 *         c. Add this element to the header.
 *              - Add the element only when this column doesn't exist (Optional)
 */
function addSubmissionColumnHeader() {

    const thead = document.createElement("th");
    const str = document.createElement("strong");
    const val = document.createTextNode("Submissions");
    str.appendChild(val);
    thead.appendChild(str);
    thead.setAttribute("class","reactable-th-status reactable-header-sortable");
    thead.setAttribute("role", "button");
    thead.setAttribute("tabindex", "0");
    trow = document.querySelector("#question-app > div > div:nth-child(2) > div.question-list-base > div.table-responsive.question-list-table > table > thead > tr");
    trow.appendChild(thead);
}


/* Step 2: Find the API endpoint for retrieving all problems
 */
function getApiUrl() {

    return "https://leetcode.com/api/problems/all/";
}

/* Step 3: Get all the problems as an Array in the following object format by using fetch -
 *          {
 *              id: "",
 *              total_submitted: "",
 *              total_acs: ""
 *          }
 */
async function getAllProblems(apiUrl) {

    const var1 = await fetch(getApiUrl())
    .then(res => res.json())
    .then(data => data.stat_status_pairs)

    var arr = [];
    for(i of var1){
        arr.push({"id": i.stat.frontend_question_id, "total_acs": i.stat.total_acs, "total_submitted": i.stat.total_submitted});
    }
    //console.log(arr);
    return arr;
}



/* Step 4: Getting every problem's row in the form of an array
 */
function getAllProblemRowElements() {

    let trow = document.querySelectorAll("#question-app > div > div:nth-child(2) > div.question-list-base > div.table-responsive.question-list-table > table > tbody.reactable-data > tr");
    var arr =  Array.from(trow);
    //console.log(arr);
    return arr;
}

/* Step 5: Add "total_acs"/"total_submitted" to each row element of the table on the page. Iterate through each row element and add a new <td> containing the submission data in the provided format
 */
function addSubmissionsToEachProblem(allProblemRowElements, allProblems) {
    var problemRowSingle, obj, submission, tdata, data;
    for(var i=0; i<allProblemRowElements.length; i++){
        problemRowSingle = allProblemRowElements[i];
        obj = allProblems.find(item => item.id == (problemRowSingle.childNodes[1].innerHTML));
        submission = obj.total_acs + "/" + obj.total_submitted;
        //console.log(obj);
        tdata = document.createElement("td");
        data = document.createTextNode(submission);
        tdata.appendChild(data);
        problemRowSingle.appendChild(tdata);
    }
}


/* Step 6: Putting it all together
 */
async function createSubmissionColumnForLeetCode() {

    addSubmissionColumnHeader();
    //var apiUrl = await getApiUrl();
    var allProblems = await getAllProblems(getApiUrl());
    var allProblemRowElements = getAllProblemRowElements();
    addSubmissionsToEachProblem(allProblemRowElements, allProblems);
}

/* Step 7: Additional code for making script tampermonkey ready. This is done so that the script is properly executed when we visit https://leetcode.com/problemset/all/
 */
let tableCheck = setInterval(async() => {
    var css = "#question-app > div > div:nth-child(2) > div.question-list-base > div.table-responsive.question-list-table > table";
    if(document.querySelector(css)){
        createSubmissionColumnForLeetCode();
        clearInterval(tableCheck);
    }
} , 100);

module.exports = {getApiUrl, getAllProblems, addSubmissionColumnHeader, getAllProblemRowElements, addSubmissionsToEachProblem, createSubmissionColumnForLeetCode};
