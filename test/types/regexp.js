import { type, Store } from '../../src'; //, model, optional, Nil, bare, reference, collections
import { createStore } from 'redux';
import { expect, should } from 'chai';
import { baseTypeProperties, checkProperties } from './utils';

should();

describe('RegExp', () => {
  var schema
    , store
    , actions
    ;

  beforeEach(() => {
    store = new Store({ schema: type(RegExp), debug: true });
    store.store = createStore(store.reducer);
    schema = store.schema;
    actions = [];
    var origDispatch = store.dispatch;
    store.dispatch = function(action) {
      actions.push(action);
      return origDispatch(action);
    };
  });

  context('type', () => {
    checkProperties(() => schema, Object.assign({}, baseTypeProperties, {
      name: 'regexp',
      kind: 'regexp',
      storageKinds: ['object']
    }));
  });

  context('instance', () => {
    it('should be empty regexp by default ', () => {
      var v = store.instance;
      v.should.be.instanceOf(RegExp);
      String(v).should.match(/^[^a-z]*$/i);
    });

    it('should allow correct state assignment', () => {
      store.state = (store.state);
    });

    it('should disallow incorrect state assignment', () => {
      expect(() => store.state = 0).to.throw(TypeError);
    });

    it('should allow assignment and retrieval of a RegExp object', () => {
      var regExpIn = /test[abc](12|34)(:?foo)/i
        , regExpOut
        ;

      regExpIn.custom = 'extra info';
      store.instance = regExpIn;
      regExpOut = store.instance;
      regExpIn.source.should.equal(regExpOut.source);
      regExpIn.global.should.equal(regExpOut.global);
      regExpIn.ignoreCase.should.equal(regExpOut.ignoreCase);
      regExpIn.multiline.should.equal(regExpOut.multiline);
    });

    it('should reject non-RegExp assignment', () => {
      expect(()=>store.instance = {}).to.throw(TypeError);
    });
  });
});
