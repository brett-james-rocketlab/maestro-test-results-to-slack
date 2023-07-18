"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTest = void 0;
const fs_1 = __importDefault(require("fs"));
const xml_js_1 = require("xml-js");
const helpers_1 = require("./helpers");
/**
 * Parses an XML file containing a JUnit and writes a usable output
 * @param {string[]} inData
 * @param {string} testFolder
 * @returns {string}
 */
function parseTest(inData, testFolder) {
    function getTestCaseResult(inData) {
        // It is possible to have multiple test results, although I have not seen that happen yet...
        let parsedResult = "";
        inData.elements.forEach((result) => {
            parsedResult += " ";
            parsedResult += result.name;
        });
        return parsedResult;
    }
    let FULLSTR = "";
    inData.forEach((fileName) => {
        console.log("about to parse", fileName);
        if (fileName.includes("report")) {
            //   console.log("ok, about to read file: " + testFolder);
            // Check if the folder exists
            if (fs_1.default.existsSync(testFolder)) {
                try {
                    const xml = fs_1.default.readFileSync(testFolder + "/" + fileName, "utf8");
                    const options = { ignoreComment: true, alwaysChildren: true };
                    const content = (0, xml_js_1.xml2js)(xml, options);
                    console.log("calculating test results, deciding if abbreviate output");
                    const testSuitesBase = content.elements[0].elements[0];
                    // We only need to show an abrieviated output if the test was successful
                    const successfulTest = true;
                    //   console.log("hey - ", testSuitesBase, parseInt(testSuitesBase.attributes.skipped), parseInt(testSuitesBase.attributes.failures), parseInt(testSuitesBase.attributes.errors))
                    // Check the header, it looks like this:
                    // <testsuite name="Test Suite" device="R5CR10E0ZGF" tests="2" failures="0" time="19">
                    if ((0, helpers_1.safeTestUnits)(testSuitesBase.attributes.skipped) &&
                        (0, helpers_1.safeTestUnits)(testSuitesBase.attributes.skipped) &&
                        (0, helpers_1.safeTestUnits)(testSuitesBase.attributes.failures) &&
                        (0, helpers_1.safeTestUnits)(testSuitesBase.attributes.errors)) {
                        console.log("building abbreviated string for " +
                            testSuitesBase.attributes.name);
                        let SHORTOUTPUT = "" + testSuitesBase.attributes.name + " all passed:";
                        for (let i = 0; i < parseInt(testSuitesBase.attributes.tests); i++) {
                            SHORTOUTPUT += " :white_check_mark:";
                        }
                        SHORTOUTPUT += "\r\n";
                        FULLSTR += SHORTOUTPUT;
                    }
                    else {
                        console.log("building long string for the failed test called: " +
                            testSuitesBase.elements[0].attributes.name);
                        let OUTPUTSTR = "";
                        // TODO: Change to markdown
                        OUTPUTSTR += testSuitesBase.elements[0].attributes.name;
                        OUTPUTSTR += " has errors:";
                        OUTPUTSTR += "\r\n";
                        const testcases = testSuitesBase.elements;
                        testcases.forEach((item) => {
                            // console.log("item is: ", item)
                            if (item.name === "testcase") {
                                let testCaseNameResult = item.attributes.name;
                                testCaseNameResult += getTestCaseResult(item);
                                // Test was skipped
                                if (testCaseNameResult.includes("skipped")) {
                                    testCaseNameResult = ":fast_forward: " + testCaseNameResult;
                                }
                                else if (testCaseNameResult.includes("failure")) {
                                    // console.log("Test failure result text: ", item.elements[0].elements[0].text)
                                    //   const errorMessage = item.elements[0].elements[0].attributes.message;
                                    const errorMessage = item.elements[0].elements[0].text;
                                    const shortMessage = errorMessage.split(/\r?\n/)[0];
                                    //   Sample result:
                                    // 
                                    //  functionality failure Element not found: Text matching regex: GO TO SCREEN dddd3
                                    testCaseNameResult =
                                        `:x: ${testCaseNameResult} _${shortMessage}_`;
                                }
                                else {
                                    // Success: todo reorder this
                                    testCaseNameResult = `:white_check_mark: ${testCaseNameResult}`;
                                }
                                testCaseNameResult = "    " + testCaseNameResult;
                                testCaseNameResult += "\r\n"; // Safe newline
                                OUTPUTSTR += testCaseNameResult;
                            }
                        });
                        FULLSTR += OUTPUTSTR + "\r\n";
                    }
                }
                catch (error) {
                    console.error("Error reading the file:", error);
                }
            }
            else {
                console.error("Folder does not exist:", testFolder);
            }
        }
    });
    return FULLSTR;
}
exports.parseTest = parseTest;
