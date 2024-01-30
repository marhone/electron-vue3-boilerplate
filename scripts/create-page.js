const chalk = require("chalk");
const path = require("path");
const fs = require("fs");

const outputTips = (message) => console.log(chalk.blue(`${message}`));
const outputSuccess = (message) => console.log(chalk.green(`${message}`));
const outputError = (error) => console.log(chalk.red(`${error}`));

let pageName = "";

outputTips("Input page name:");

process.stdin.on("data", async(chunk) => {
  // Input page name
  pageName = String(chunk).trim().toString();
  if(!pageName){
    outputError("Name is empty!");
    return;
  }

  const targetPath = path.join(__dirname, "../src/renderer/pages", pageName);
  // Check whether page is exist or not
  const pageExists = fs.existsSync(targetPath);
  if(pageExists){
    outputError(`Page ${pageName} has already exist!`);
    return;
  }

  fs.mkdirSync(targetPath);
  const sourcePath = path.join(__dirname, "template-ts");
  copyFile(sourcePath, targetPath);
  process.stdin.emit("end");
});

process.stdin.on("end", () => {
  outputSuccess(`Create ${pageName} page successful!`);
  process.exit();
});

const createDirectories = (path) => {
  if(!fs.existsSync(path)){
    fs.mkdirSync(path);
  }
};

const copyFile = (sourcePath, targetPath) => {
  const sourceFile = fs.readdirSync(sourcePath, { withFileTypes: true });

  sourceFile.forEach((file) => {
    const newSourcePath = path.resolve(sourcePath, file.name);
    const newTargetPath = path.resolve(targetPath, file.name);

    if(file.isDirectory()){
      createDirectories(newTargetPath);
      copyFile(newSourcePath, newTargetPath);
    }else{
      fs.copyFileSync(newSourcePath, newTargetPath);
    }
  });
};