var OpenLDAP = require('../../modules/openldap');
const expect = require('chai').expect;


describe('MSSQL - Database Functionality', () => {
  describe('Insert', () => {
    it('should get ready for connection', () => {
      expect(OpenLDAP.bind).to.be.a('function');
    });
    it('should return a promise', () => {
      const ldapBindResult = OpenLDAP.bind();
      expect(ldapBindResult.then).to.be.a('Function');
      expect(ldapBindResult.catch).to.be.a('Function');
    })
  });

  describe('Bulk insert', () => {
    it('should be able to insert 100 records at one function call', () => {

    });
  });
});


/*
describe('CartSummary', function() {
  it('getSubtotal() should return 0 if no items are passed in', function() {
    var cartSummary = new CartSummary([]);
    expect(cartSummary.getSubtotal()).to.equal(0);
  });
  it('aaa', () = > {

  });
});
*/
