const expect = require("chai").expect;
const { text } = require("express");
const request = require("supertest");
const assert = require("chai").assert;

const app = require("./todos.js");

describe("POST /todos", () => {
  it("OK, creating a new todo works! ", (done) => {
    request(app)
      .post("/todos")
      .send({ text: "Wash the Dishes" })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property("text");
        expect(body).to.contain.property("priority");
        expect(body).to.contain.property("done");
        expect(body).to.contain.property("id");
        done();
      })
      .catch((err) => done(err));
  });

  it("Fail, todo requires a text! ", (done) => {
    request(app)
      .post("/todos")
      .send({ wrong: "info" })
      .then((res) => {
        const textResponse = res.text;
        expect(res.text).to.equal(
          "You can only enter text info and text can only be a string..."
        );

        done();
      })
      .catch((err) => done(err));
  });

  it("Fail, text can only be a string! ", (done) => {
    request(app)
      .post("/todos")
      .send({ text: 21 })
      .then((res) => {
        const textResponse = res.text;
        expect(textResponse).to.equal(
          "You can only enter text info and text can only be a string..."
        );

        done();
      })
      .catch((err) => done(err));
  });
});

describe("GET /todos", () => {
  it("OK, getting todos works! ", (done) => {
    request(app)
      .get("/todos")
      .then((res) => {
        const body = res.body;
        console.log(res);
        expect(body).to.contain.property("text");
        expect(body).to.contain.property("priority");
        expect(body).to.contain.property("done");
        expect(body).to.contain.property("id");
        expect(body.id).to.equal(1);
        done();
      })
      .catch((err) => done(err));
  });
});

describe("GET /todos/id", () => {
  it("OK, getting a todo with given id works! ", (done) => {
    request(app)
      .get("/todos/1")
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property("text");
        expect(body).to.contain.property("priority");
        expect(body).to.contain.property("done");
        expect(body).to.contain.property("id");
        expect(body.id).to.equal(1);
        done();
      })
      .catch((err) => done(err));
  });

  it("Fail, there is no todo with the given id! ", (done) => {
    request(app)
      .get("/todos/10000")
      .then((res) => {
        const textResponse = res.text;
        expect(textResponse).to.equal("There is no todo with the given id...");
        done();
      })
      .catch((err) => done(err));
  });
});
