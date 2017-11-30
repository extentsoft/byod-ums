//const MSSQL = require('./modules/MSSQL');
const expect = require('chai').expect;

describe('MSSQL - Database Operation', () => {
  describe('Availability', () => {
    it('should get ready for a connection');
    it('should get ready for more than 10 connections in case of pooling');
    it('should get ready for connection');
  });
  describe('Reliability', () => {
    describe('Account Staging', () => {
      it('should always sync with Production before getting restated');
    });
  });

  describe('Connectivity', () => {
    it('should sh');
  });
});
