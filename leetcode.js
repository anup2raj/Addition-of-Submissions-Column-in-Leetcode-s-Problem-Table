const axios = require('axios');
const objectsToCsv = require('objects-to-csv');
const fs = require('fs');

function getApiURL() {
// Returns a String denoting the API url which fetches all problems
	return "https://leetcode.com/api/problems/all/";
}

async function getAllProblems() {
// Returns a Promise object of the response on calling
// the API to fetch all problems
	const myPromise = await axios.get(getApiURL())
	.then(function (response){
		return Promise.resolve(response.data);
	})
	.catch(function(err){
		return Promise.reject(err);
	});

	return myPromise
}


function getTopHundredProblems(allProblems) {
    // Returns the top 100 most submitted problems
	// Input:
	//  	allProblems - Raw API response
	const arr = allProblems.stat_status_pairs.filter(item => item.paid_only == false);
	arr.sort( (a, b) => {
		return b.stat.total_submitted - a.stat.total_submitted;
	});

	var new_arr = [];
	for(i of arr){
		new_arr.push({"id": i.stat.frontend_question_id, "question_title":i.stat.question__title , "submissions": i.stat.total_submitted});
	}
	
	// Output:
	//  	Array of objects with the question id, title and total submissions values for the
	//      top 100 problems ordered by their total submissions in descending order
	new_arr = new_arr.slice(0, 100);
	console.log(new_arr);
	return new_arr;
}


async function createCSV(topHundredProblems) {
    // Write data to a CSV file
	// Input:
	(async () => {
		const csv = new objectsToCsv(topHundredProblems).toString();
		await csv.toDisk('/list.csv');
		console.log(await csv);
	})();
	//  	topHundredProblems - data to write


}

async function main() {
    console.log("Running main");
    const allProblems = await getAllProblems();
    if (allProblems != null) {
		fs.writeFile("./problemsAll.json", JSON.stringify(allProblems, null, 4), (err) => {
			if (err) {
				console.error(err);
				return;
			}
	   });
	}

    const topHundredProblems = await getTopHundredProblems(allProblems);
    createCSV(topHundredProblems);
}

module.exports = {getApiURL, getAllProblems, getTopHundredProblems, createCSV, main};
