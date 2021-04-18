
function expectOr(...tests) {
    try {
        tests.shift()();
    } catch(e) {
        if (tests.length) expectOr(...tests);
        else throw e;
    }
}

module.exports = {expectOr}
