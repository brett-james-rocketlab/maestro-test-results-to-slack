import fs from "fs";
import { xml2js } from "xml-js";
import { safeTestUnits } from "./helpers";


/**
 * Parses an XML file containing a JUnit and writes a usable output
 * @param {string[]} inData
 * @param {string} testFolder
 * @param {string} introMessage optional - a message to add to the top of the output
 * @returns {string}
 */
function parseTest(inData: any, testFolder: string, introMessage?: string) {
  function getTestCaseResult(inData: any) {
    // It is possible to have multiple test results, although I have not seen that happen yet...
    let parsedResult = "";
    inData.elements.forEach((result: any) => {
      parsedResult += " ";
      parsedResult += result.name;
    });
    return parsedResult;
  }

  let FULLSTR = "";

  inData.forEach((fileName: string) => {
    console.log("about to parse", fileName);
    if (fileName.includes("report")) {
    //   console.log("ok, about to read file: " + testFolder);

      // Check if the folder exists
      if (fs.existsSync(testFolder)) {
        try {
          const xml = fs.readFileSync(testFolder + "/" + fileName, "utf8");
          const options = { ignoreComment: true, alwaysChildren: true };
          const content = xml2js(xml, options);

          console.log("Parsing test results, deciding if only need to show summary results");
          const testSuitesBase = content.elements[0].elements[0]

          // We only need to show an abrieviated output if the test was successful
        //   const successfulTest = true;
        //   console.log("hey - ", testSuitesBase, parseInt(testSuitesBase.attributes.skipped), parseInt(testSuitesBase.attributes.failures), parseInt(testSuitesBase.attributes.errors))

        // Check the header, it looks like this:
        // <testsuite name="Test Suite" device="R5CR10E0ZGF" tests="2" failures="0" time="19">

          if (
            safeTestUnits(testSuitesBase.attributes.skipped) &&
            safeTestUnits(testSuitesBase.attributes.skipped) &&
            safeTestUnits(testSuitesBase.attributes.failures) &&
            safeTestUnits(testSuitesBase.attributes.errors) 
          ) {
            console.log(
              "building abbreviated string for " +
              testSuitesBase.attributes.name
            );
            // The following typically looks like:
            // Test Suite all passed: :white:
            // where Test Suite is the name defined in the xml itself.

            let SHORTOUTPUT = "";
            // Optional intro message, with an linebreak

            if (introMessage !== undefined && introMessage !== null) {
              SHORTOUTPUT += `${introMessage} \r\n`
            }

            SHORTOUTPUT += testSuitesBase.attributes.name + " all passed:";

            for (
              let i = 0;
              i < parseInt(testSuitesBase.attributes.tests);
              i++
            ) {
              SHORTOUTPUT += " :white_check_mark:";
            }

            // Also add time it took to run
            SHORTOUTPUT += ` (${testSuitesBase.attributes.time}s)\r\n`

            SHORTOUTPUT += "\r\n";
            FULLSTR += SHORTOUTPUT;
          } else {
            const failedTestName = testSuitesBase.elements[0].attributes.name
            console.log(
              "building details for the failed test called: " +
              failedTestName
            );
            let OUTPUTSTR = ""; // Allow falling back to an empty string
            
            // Optional intro message, with an linebreak
            if (introMessage !== undefined && introMessage !== null) {
              OUTPUTSTR += `${introMessage} \r\n`
            }

            // TODO: Change to markdown
            OUTPUTSTR += `Test named: ${failedTestName} has errors: \r\n`

            const testcases = testSuitesBase.elements;
            testcases.forEach((item: any) => {
                // console.log("item is: ", item)
              if (item.name === "testcase") {
                let testCaseNameResult = item.attributes.name;
                testCaseNameResult += getTestCaseResult(item);
                
                // Test was skipped
                if (testCaseNameResult.includes("skipped")) {
                  testCaseNameResult = ":fast_forward: " + testCaseNameResult;
                } else if (testCaseNameResult.includes("failure")) {
                    // console.log("Test failure result text: ", item.elements[0].elements[0].text)
                //   const errorMessage = item.elements[0].elements[0].attributes.message;
                  const errorMessage = item.elements[0].elements[0].text
                  const shortMessage = errorMessage.split(/\r?\n/)[0];
                //   Sample result:
                // 
                //  functionality failure Element not found: Text matching regex: GO TO SCREEN dddd3

                  testCaseNameResult =
                    `:x: ~${testCaseNameResult}~ _${shortMessage}_`;

                    
                } else {
                    // Success: todo reorder this
                  testCaseNameResult = `:white_check_mark: ${testCaseNameResult}`;
                }
                testCaseNameResult = "    " + testCaseNameResult;
                testCaseNameResult += "\r\n";
                OUTPUTSTR += testCaseNameResult;
              }
            });

            // Check for a global time it took to run and add that.
            if (testSuitesBase.attributes.name) {
                OUTPUTSTR += `> Total time to run: ${testSuitesBase.attributes.time} seconds\r\n`
            }

            FULLSTR += OUTPUTSTR + "\r\n";
          }
        } catch (error) {
          console.error("Error reading the file:", error);
        }
      } else {
        console.error("Folder does not exist:", testFolder);
      }
    }
  });

  return FULLSTR;
}

export { parseTest };
