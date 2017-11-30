const Nightmare = require('nightmare');
const assert = require('assert');

describe('Load a Page if signing in correctly', function(){
  //this.timeout('30s');
  this.timeout('30s')

  let nightmare = null;
  beforeEach( () => {
    nightmare = new Nightmare();
  });
  describe('/profile/login (User Sign in Portal)', () => {
    it('should load without error', done => {
      nightmare.goto('http://localhost:3000/profile/login')
        .end()
        .then( function(result) {
          done();
        })
        .catch(done);
    });
  });
});
