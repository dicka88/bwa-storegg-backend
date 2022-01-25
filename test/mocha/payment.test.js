const chai = require("chai");
const chaiHttp = require('chai-http');
const app = require("../../app");

chai.use(chaiHttp);
chai.should();

const request = chai.request(app);

describe("Get all payments, GET /payment", () => {
  it("It should get all payment", (done) => {
    request.get('/api/payment')
      .end((err, res) => {
        console.log(res.body);
        res.body.should.be.an('object');
        done();
      });
  });
});

// Insert Payment

// Update Payment

// Delete Payment