/* eslint func-name-matching: 0, no-underscore-dangle: 0 */

require('../config/globalConfig');
global.chai = require('chai');
global.expect = global.chai.expect;

const spy = require('chai-spies');
const chaiAsPromised = require('chai-as-promised');
const mock = require('mock-require');

global.chai.use(chaiAsPromised);
global.chai.use(spy);

function MockStellarAsset(code, issuer){

  this.code = code;
  this.issuer = issuer;

}

MockStellarAsset.prototype.isNative = function isNative(){

  return typeof this.issuer !== 'string';

};

MockStellarAsset.prototype.equals = function equals(assetCompare){

  return (assetCompare.isNative() && this.isNative() ) || (this.code === assetCompare.code && this.issuer === assetCompare.issuer);

};

MockStellarAsset.native = function native(){

  return new MockStellarAsset(null, null);

};

mock('stellar-sdk', {
  Operation: {
    manageOffer: offerData => offerData,
    createPassiveOffer: function MockStellarCreatePassiveOffer(offerData){

      this._offerData = offerData;
      
      return offerData;
    
    }
  },
  Server: function MockStellarServer(){},
  Asset: MockStellarAsset
});

