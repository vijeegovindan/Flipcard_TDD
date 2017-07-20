const request          = require("supertest");
const assert           = require("assert");
const app              = require("../app");
const cards            = require("../models/cards");
const decks            = require("../models/decks");
const mongoose         = require('mongoose');
const nodeEnv          = process.env.NODE_ENV || "test";
const config           = require("../config.json")[nodeEnv];
var expect             = require('chai').expect;
var should             = require('should');


//before all the tests
before("Database Setup", function(done) {

 mongoose.createConnection(config.mongoURL,  { useMongoClient: true });

 let newCard_1 = new cards({
      question: "question question question",
      answer: "a1"
    });
   newCard_1.save(function(err){
   card_1 = newCard_1;
 });

 let newCard_2 = new cards({
      question: "question2 question2 question2",
      answer: "a2"
    });
   newCard_2.save(function(err){
   card_1 = newCard_2;
 });
done();
});

describe("POST /signup'", function () {
 it("should be able to sign up", function (done) {
    request(app)
      .get('/signup')
      .send({
        username:'vijee',
        password:'password123'
      })
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(function(res){
        assert.equal(res.body.status, "success");
      })
      done();
   })
   it("check for credentials", function (done) {
      request(app)
        .get('/signup')
        .send({
          username:'vijee'
        })
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(function(res){
          assert.equal(res.body.status, "failure");
        })
        done();
     })
});
describe("GET '/login'", function () {
 it("should be able to login", function (done) {
    request(app)
      .get('/login')
      .send({
        username:'vijee',
        password:'password123'
      })
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(function(res){
        assert.equal(res.body.status, "success");
      })
      done();
   })
   it("check for credentials", function (done) {
      request(app)
        .get('/login')
        .send({
          password:'password123'
        })
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(function(res){
          assert.equal(res.body.status, "failure");
        })
        done();
     })
});

describe("GET /flipcard", function(){
  it("should display all the existing cards", function(done){
    request(app)
    .get('/flipcard')
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(function(res){
      assert(res.body.length > 0);
    })
    done();
  })
})

describe("GET /flipcard", function(){
  it("should display all the existing cards", function(done){
    request(app)
    .get('/flipcard')
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(function(res){
      assert(res.body['list'].length > 0);
    })
    done();
  })
})

describe("POST /flipcard/new", function(){
  it("create a new flipcard", function(done){
    request(app)
    .get('/flipcard')
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(function(res){
      assert(res.body['deck'].length > 0);
    })
    done();
  })
})

describe("GET /flipcard/1/delete", function(){
  it("delete a flipcard", function(done){
    request(app)
    .get('/flipcard/1/delete')
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(function(res){
      assert(res.body.length = 0);
    })
    done();
  })
})

describe("GET /edit", function(){
  it("update a flipcard", function(done){
    request(app)
    .get('/edit')
    .send({
      question: "question2 question2 question2",
      answer: "a3"
    })
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(function(res){
      assert.equal(res.body['answer'], "a3");
      assert.equal(res.body['question'], "question2 question2 question2");
    })
    done();
  })
})

describe("POST /playcards", function(){
  it("play a flipcard", function(done){
    request(app)
    .post('/flipcard/1/submit')
    .send({
      question: "question2 question2 question2",
    })
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8")
    .expect(function(res){
      assert.equal(res.body['answer'], "a2");
    })
    done();
  })
})

//runs after all tests in this block
after("drop database", function (done) {
  mongoose.connection.dropDatabase(done);
})
