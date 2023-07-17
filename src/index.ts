import fs from "fs";
import path from "path";
import core from "@actions/core";

console.log("Hello World! - about to start");

async function run() {
  try {
    // const dirnameString = __dirname;
    // console.log("in the function for Run()");
    // console.log(dirnameString);
    // const rootDir = dirnameString.split("_actions")[0];

    
    // Not needed anymore if we depend on GHA to checkout the repo
    // const rootDir = dirnameString.split("_actions")[0];

    // const localProjectWorkingPath = '/Users/brettjames/development/maestro-test-results-to-slack'
    const localProjectWorkingPath = process.env.GITHUB_WORKSPACE as string;
    console.log(
        `Our checked out repo location is at: ${localProjectWorkingPath} (only visible after actions/checkout) `
        );
    
    // const testFolder = core.getInput("test-results-folder") as string;
    const testFolder = "" as string;
    // console.log(
    //   ` the root folder of the project should be.... ${rootDir}, while the testFolder is set as: ${testFolder}`
    // );
    const resultFolder = path.join(localProjectWorkingPath, testFolder);
    console.log(`the result folder is set as: ${resultFolder}`);

    const data = await fs.promises.readdir(resultFolder);
    console.log("- Found files: ");

    const xmlFiles = data.filter(
      (file) => path.extname(file).toLowerCase() === ".xml"
    );

    if (xmlFiles.length > 0) {
      console.log("There is XML files in the folder given");
    } else {
      console.log(
        "No XML files found to parse for testing - check your test-results-folder setting."
      );
    }
  } catch (err) {
    console.log("Had an error while attempting to open the folder: " + err);
  }

  console.log("Run() finished....");
}

run();
