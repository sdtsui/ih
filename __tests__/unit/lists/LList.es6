jest.autoMockOff();
var IM = require('immutable'),
    LList = require('../../../src/lists/LList');

describe('LList', () => {
  describe('new instance initialization', () => {
    let sLLEmpty = new LList();

    it('starts with a null head', () => {
      expect(sLLEmpty.head).toBeNull();
    });

    it('starts with a null tail', () => {
      expect(sLLEmpty.tail).toBeNull();
    });

    it('starts with an empty _lzStore', () => {
      expect(sLLEmpty.size).toBe(0);
    });

    it('stores a number on initialization', () => {
      let sLLNumber = new LList(1);
      expect(sLLNumber.size).toBe(1);
      expect(sLLNumber.head.data).toEqual(1);
      expect(sLLNumber.head.next).toBeNull();
      expect(sLLNumber.tail.data).toEqual(1);
    });

    it('stores a string on initialization', () => {
      let sLLString = new LList('string value');
      expect(sLLString.size).toBe(1);
      expect(sLLString.head.next).toBeNull();
      expect(sLLString.head.data).toEqual('string value');
      expect(sLLString.tail.data).toEqual('string value');
      expect(sLLString.tail.next).toBeNull();

    });

    it('stores an object on initialization', () => {
      let sLLObject = new LList({ name: 'clark' });
      expect(sLLObject.size).toBe(1);
      expect(sLLObject.head.next).toBeNull();
      expect(sLLObject.tail.next).toBeNull();
      expect(sLLObject.head.data).toEqual({ name: 'clark' });
      expect(sLLObject.tail.data).toEqual({ name: 'clark' });
    });

    it('stores an array on initialization', () => {
      let sLLArray = new LList([
          'random string', 
          {'asdfasdf':'asdf'}, 
          { name: 'anna' }, 
          26, 
          ['tail value'],
        ]);
      expect(sLLArray.size).toBe(5);
      expect(sLLArray.head.data).toEqual('random string');
      expect(sLLArray.head.next).toNotEqual(null);
      expect(sLLArray.head.next.data['asdfasdf']).toBe('asdf');
      expect(sLLArray.head.next.next.next.data).toBe(26);
      expect(sLLArray.tail.next).toBeNull();
      expect(sLLArray.tail.data).toEqual(['tail value']);
    });

    it('contains immutable nodes', () => {
      let sLLNumber = new LList(1);
      let changeSomething = () =>{
        sLLNumber.head.data = 2;
      }
      expect(changeSomething).toThrow();
      expect(sLLNumber.head.data).toEqual(1); 
    });
  });

  describe('public interface instance methods', () => {
    let sLLNumber = new LList(1);
    let sLLArray = new LList([
        'random string', 
        {'asdfasdf':'asdf'}, 
        { name: 'anna' },
      ]);


    describe('prepends', () => {

      it('returns a new list when prepending undefined', () => {
        let nList = sLLNumber.prepend();
        expect(nList).toNotBe(sLLNumber);
        expect(nList.head.data).toBe(1);
      });

      it('prepends single elements', () => {
        let nList = sLLArray.prepend(0);
        expect(nList.head.data).toEqual(0);
        expect(nList.size).toBe(sLLArray.size+1);
      });

      it('prepends an array', () => {
        let nList = sLLArray.prepend([1,2,3]);
        expect(nList.head.next.data).toEqual(2);
        expect(nList.size).toEqual(sLLArray.size+3);
      });

      it('prepends nested arrays', () => {
        expect(sLLArray.prepend([[1,2,3],[1,2]]).head.data).toEqual([1,2,3]);
      });

      it('prepends nodes, copying only a node\'s data', () => {
        let nList = sLLArray.prepend(sLLArray.head);
        expect(nList.head.data).toEqual('random string');
        expect(nList.size).toBe(sLLArray.size+1);
      });

      it('prepends other LLs', () => {
        let nList = sLLArray.prepend(sLLArray);
        expect(nList.size).toEqual(sLLArray.size*2);
        expect(nList.tail.data).toEqual(sLLArray.tail.data);
      });

      it('prepends via tail-sharing', () => {
        let nList = sLLArray.prepend(sLLArray);
        expect(nList.head).toNotBe(sLLArray.head);
        expect(nList.tail.next).toBeNull();
        let currentNode = nList.head;
        //increment the size of the previous array, check if tail is old head
        for (let i = 0; i < sLLArray.size; i++){
          if (i === sLLArray.size-1){ 
            expect(currentNode.next).toBe(sLLArray.head);
          }
          currentNode = currentNode.next;
        }
      });

    });

    describe('appends', () => {

      it('returns a new list when appends undefined', () => {
        let nList = sLLNumber.append();
        expect(nList).toNotBe(sLLNumber);
        expect(nList.head.data).toBe(1);
        expect(nList.size).toBe(sLLNumber.size+1);
      });

      it('appends single numbers', () => {
        let sLLNumber2 = sLLNumber.append(2);
        // shouldn't mutate original list
        expect(sLLNumber.tail.data).toEqual(1); 
        expect(sLLNumber2.head.data).toEqual(1);
        expect(sLLNumber2.tail.data).toEqual(2);
      });

      it('appends an array', () => {
        let nList = sLLArray.append([1,2,3]);
        expect(nList.tail.data).toEqual(3);
        expect(nList.size).toEqual(sLLArray.size+3);
      });

      it('appends nested arrays', () => {
        expect(sLLArray.append([[1,2,3],[1,2]]).tail.data).toEqual([1,2]);
      });

      it('appends nodes, copying only a node\'s data', () => {
        let nList = sLLArray.prepend(sLLArray.head);
        expect(nList.head.data).toEqual('random string');
        expect(nList.head).toNotBe(sLLArray.head);
        expect(nList.size).toBe(sLLArray.size+1);

      });

      it('appends other LLs', () => {
        let nList = sLLArray.append(sLLArray);
        expect(nList.size).toEqual(sLLArray.size*2);
        expect(nList.tail.data).toEqual(sLLArray.tail.data);
      });

    });

    describe('removal methods', () => {

      it('removes-head', () => {
        let sLLNumber2 = sLLNumber.append(2);
        let sLLNumber3 = sLLNumber.removeHead();
        let sLLNumber4 = sLLNumber2.removeHead();
        expect(sLLNumber.head.data).toEqual(1); 
        expect(sLLNumber2.head.data).toEqual(1); 
        expect(sLLNumber3.head).toBeNull();
        expect(sLLNumber4.head.data).toEqual(2);
        expect(sLLNumber4.tail.data).toEqual(2);
      });

      it('removes-tail', () => {
        let sLLNumber2  = sLLNumber.append(2);
        let sLLNumber3  = sLLNumber2.removeTail();
        let sLLEmpty    = sLLNumber.removeTail();
        expect(sLLNumber.head.data).toEqual(1); 
        expect(sLLNumber2.head.data).toEqual(1);
        expect(sLLNumber3.head.data).toEqual(1);
        expect(sLLEmpty.tail).toBeNull();
      });

    });

    describe('functional methods', () => {

        describe('reverse', () => {
          it('reverses', () =>{
            expect(sLLArray.reverse().head.data['name']).toEqual('anna');
          });
        });  
    });

    describe('Circular Linked Lists', function() {
      let oneToFive = [1,2,3,4,5];
      let cLL = new LList(oneToFive, {circular: true});
      let midNode = cLL.head.next.next;

      describe('Basic Instance Methods & Properties', function() {
        it('is circular', function() {
          expect(cLL.tail.next).toBe(cLL.head);
        });

        it('has correct values midpoint, head, tail, and size values', function() {
          expect(midNode.data).toBe(3);
          expect(cLL.head.data).toBe(1);
          expect(cLL.tail.data).toBe(5);
          expect(cLL.size).toBe(5);
        });

        it('appends and prepends, immutably', function() {
          expect(cLL.append('NEW').tail.data).toBe('NEW');
          expect(cLL.prepend('NEW').head.data).toBe('NEW');
          expect(cLL.head.data).toNotBe('NEW');
        });
        
      });

      describe('Add before', function() {
        it('behaves exactly as prepend should, when called with head', function() {
          expect(cLL.addBefore(cLL.head, 0)).toBe(cLL.prepend(0).head);
          
        });

        it('returns a new list, with the correct inserted value', function() {
          let nList = cLL.addBefore(midpoint, 0);
          expect(cLL.size).toNotBe(nList.size);
          expect(nList.head.next.next.data).toBe(0);
        });

      });

      describe('Remove before', function() {
        it('removes tail, when called with head', function() {
          expect(cLL.removeBefore(cLL.head).tail.data).toBe(cLL.removeTail().tail.data);
          expect(cLL.removeBefore(cLL.head).head.data).toBe(cLL.removeTail().head.data);
        });

        it('returns a new list, with the correct length', function() {
          
        });
        it('does not contain the removed node', function() {
          
        });

      });

      describe('Add after', function() {
        it('behaves exactly as append should, when called with tail', function() {
          
        });

        it('returns a new list', function() {
          
        });

        it('has the correct inserted value', function() {
          
        });

      });

      describe('Remove after', function() {
        it('removes head, when called with tail', function() {
          
        });

        it('returns a new list, with the correct length', function() {
          
        });

        it('does not contain the removed node', function() {
          
        });

      });

    });

  });
});