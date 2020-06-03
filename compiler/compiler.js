const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const Code = require('./Code');
const uniqid = require('uniqid');

function compileCode(code) {
    console.log(code);
    if (!(code instanceof Code)) {
        throw Error("Expected paramter of type 'Code'");
    }

    if (code.language === 'python') {
        return compilePythonCode(code);
    } else if (code.language === 'java') {
        return compileJavaCode(code);
    } else if (code.language === 'c++' || code.language === 'c') {
        return compileCppCode(code);
    }

    return getUnknownLanguagePromise();
}


function compilePythonCode(code) {
    return new Promise(function(resolve, reject) {
        const fileName = getFileName("py");
        fs.writeFile(path.join(getFilesDir(), fileName), code.code, function(err) {
            if (err) {
                reject("Unable to create file");
            } else {
                console.log(`Running python file: ${fileName}`);
                
                exec(`python ${fileName}`, {cwd: getFilesDir()})
                .then(result => {
                    resolve(result);
                    deleteFile(fileName);
                })
                .catch(err => {
                    reject(err);
                    deleteFile(fileName);
                });
            }
        });
    });
}

/*
Compile 'JAVA' code.
*/

function compileJavaCode(code) {
    const uniqueId = "filejava" + uniqid();
    const fileName = getFileName('java', uniqueId);
    console.log(`##### Java: ${fileName}`);

    const indexOfClassName = code.code.indexOf("OnlineCompileJava");

    if (indexOfClassName === -1) {
        return new Promise(function(resolve, reject) {
            resolve({stdout:"Unable to compile. Please make sure the name of outer most class in 'OnlineCompileJava'."});
        });
    }

    //Change the name of outer class
    const codeArray = code.code.split('');
    codeArray.splice(indexOfClassName, "OnlineCompileJava".length, uniqueId);
    code.code = codeArray.join('');

    return new Promise(function(resolve, reject) {
        console.log(`Creating file ${fileName}`);
        
        fs.writeFile(path.join(getFilesDir(), fileName), code.code, function(err) {
            if (err) {
                console.log(err);
                reject("Unable to create compile.");
            } else {
                console.log(`Compiling java file: ${fileName}`);

                exec(`javac ${fileName}`, {cwd: getFilesDir()})
                .then(result => {
                    console.log(`Running java file: ${uniqueId}.class`);
                    deleteFile(fileName);
                    return exec(`java ${uniqueId}`, {cwd: getFilesDir()});
                })
                .then(result => {                    
                    resolve(result);
                    deleteFile(fileName.replace('.java', '.class'));
                })
                .catch(err => {
                    reject(err);
                    deleteFile(fileName);
                    deleteFile(fileName.replace('.java', '.class'));
                });
            }
        });
    });
}

//Compile C++ code
function compileCppCode(code) {
    const uniqueId = "filejava" + uniqid();
    const fileName = getFileName('cpp', uniqueId);
    console.log(`##### C++" ${fileName}`);

    return new Promise(function(resolve, reject) {
        console.log(`Creating file ${fileName}`);

        fs.writeFile(path.join(getFilesDir(), fileName), code.code, function(err) {
            if (err) {
                reject(err);
            } else {
                console.log(`Compiling C++ file: ${fileName}`);

                exec(`g++ ${fileName} -o ${uniqueId}`, {cwd: getFilesDir()})
                .then(result => {
                    console.log(`Running C++ file: ${uniqueId}`);
                    deleteFile(fileName);
                    return exec(`${uniqueId}`, {cwd: getFilesDir()});
                })
                .then(result => {
                    console.log(result);
                    resolve(result);
                    deleteFile(uniqueId);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                    deleteFile(fileName);
                    deleteFile(uniqueId);
                });
            }
        });
    });
}
 
function getUnknownLanguagePromise() {
    return new Promise(function(reslove, reject) {
        reject("Unknown language");
    });
}

function deleteFile(fileName) {
    if (fs.existsSync(path.join(getFilesDir(), fileName))) {
        console.log(`Deleting file: ${fileName}`);
        fs.unlinkSync(path.join(getFilesDir(), fileName));
    }
}

//Return the path of 'files' folder
function getFilesDir() {
    return path.join(path.dirname(__dirname), "files");
}

function getFileName(extension, uniqueId) {
    if (uniqueId === undefined
    || uniqueId === null) {
        uniqueId = uniqid();
    }
    return `${uniqueId}.${extension}`;
}

module.exports = {
    compile:compileCode,
    Code
}