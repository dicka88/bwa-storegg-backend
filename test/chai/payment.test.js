const chai = require("chai");
const chaiHttp = require('chai-http');
const app = require("../../app");

const request = chai.request(app);

chai.should();

chai.use(chaiHttp);

describe("Get all payments, GET /payment", () => {
  it("It should get all payment", (done) => {
    request.get('/api/payment')
      .end((err, res) => {
        res.body.should.be.an('object');
        done();
      });
  });
});

// Insert Payment

// Update Payment

// Delete Payment