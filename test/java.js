'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const fs = require('fs');
const path = require('path');

chai.use(chaiHttp);

describe('/POST Compile Java', () => {
    it("Should compile and run all Java files", (done) => {
        const code = {
            language: "java",
            code: "class OnlineCompileJava {public static void main(String args[]) {System.out.println(12);}}"
        }

        chai.request(server)
        .post('/compile')
        .send(code)
        .end((err, res) => {
            console.log(res.body);
            res.body.should.have.property('response').eql('success');
            done();
        });
    });

    runTestForFile('AddTwoNumbers.java', 'Should add two number and return result.');
    runTestForFile('HelloWorld.java', "Should print Hello World.");
    runTestForFile('StringReverse.java', 'Should reverse a string.');
    runTestForFile('JavaExample.java', 'Should print average.')
});

function runTestForFile(fileName, message = "Default Message") {
    describe(`/POST ${fileName}`, () => {
        it(message, (done) => {
            fs.readFile(path.join(path.dirname(__dirname), 'test', 'codes', 'java', fileName), 'utf8', (err, result) => {
                const code = {
                    language: "java",
                    code: result
                }
        
                chai.request(server)
                .post('/compile')
                .send(code)
                .end((err, res) => {
                    console.log(res.body);
                    res.body.should.have.property('response').eql('success');
                    done();
                });
            });
        });
    });
}