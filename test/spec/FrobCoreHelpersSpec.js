describe('FCH', function() {
  var FCH;
  var FC = {};

  beforeEach(function() {
    FCH = new FrobCoreHelpers(FC);
  });

  describe('.setDefault()', function() {

    it('should be the default when variable is non-existent', function() {
      var marker = FCH.setDefault(marker, 'black');

      expect(marker).toEqual('black');
    });

    it('should be the variable when the variable has been defined', function() {
      var marker = 'black';
      marker = FCH.setDefault(marker, 'brown');

      expect(marker).toEqual('black');
    });

  });

  describe('.exists()', function() {

    it('should return false when element is not present', function() {
      var elExists = FCH.exists('#bo');

      expect(elExists).toBe(false);
    });

    it('should return true when element is present', function() {
      var el = document.createElement('div');
      el.id = 'bo';
      document.body.appendChild(el);

      var elExists = FCH.exists('#bo');

      expect(elExists).toBe(true);
    });

  });

  describe('.hasClass()', function() {

    it('should return false when element does not have class', function() {
      var el = document.createElement('div');
      var elClass = FCH.hasClass(el, 'squeaker');

      expect(elClass).toBe(false);
    });

    it('should return false when element does have class', function() {
      var el = document.createElement('div');
      el.className = 'squeaker';
      var elClass = FCH.hasClass(el, 'squeaker');

      expect(elClass).toBe(true);
    });

  });

  describe('.removeClass()', function() {

    it('should do nothing if element does not have class', function() {
      var el = document.createElement('div');
      FCH.removeClass(el, 'squeaker');

      expect(el.className).toEqual('');
    });

    it('should remove class', function() {
      var el = document.createElement('div');
      el.className = 'squeaker';
      FCH.removeClass(el, 'squeaker');

      expect(el.className.indexOf('squeaker')).toEqual( -1 );
    });

  });

  describe('.addClass()', function() {

    it('should do nothing if element already has class', function() {
      var el = document.createElement('div');
      el.className = 'squeaker';
      FCH.addClass(el, 'squeaker');

      expect(el.className).toEqual('squeaker');
    });

    it('should trim existing whitespace in the class', function() {
      var el = document.createElement('div');
      el.className = '    shelf-toys'
      FCH.addClass(el, 'squeaker');

      expect(el.className).toEqual('shelf-toys squeaker');
    });

    it('should not interfere with existing classes', function() {
      var el = document.createElement('div');
      el.className = 'shelf-toys';
      FCH.addClass(el, 'squeaker');

      expect(el.className).toEqual('shelf-toys squeaker');
    });


    it('should add the new class', function() {
      var el = document.createElement('div');
      FCH.addClass(el, 'squeaker');

      expect(el.className).toEqual(' squeaker');
    });

  });

  describe('localStorage adapter', function() {
    beforeEach(function() {
      localStorage.clear();
    });

    describe('.localSet()', function() {
      it('should add the new key/value pair', function() {
        FCH.localSet('language', 'Spanish');

        expect(FCH.localGet('language')).toEqual( 'Spanish' );
      });

      it('should return the value after setting the key/value pair', function() {
        var value = FCH.localSet('language', 'Spanish');

        expect(value).toEqual('Spanish');
      });
    });

    describe('.localGet()', function() {
      it('should retrieve the value provided a key', function() {
        FCH.localSet('language', 'Spanish');

        expect( FCH.localGet('language') ).toEqual( 'Spanish' );
      });

      it('should return false if key is not present', function() {
        expect( FCH.localGet('language') ).toBe(false);
      });
    });

    describe('.localSet()', function() {
      it('should clear all values if not provided a key', function() {
        FCH.localSet('language', 'Spanish');

        FCH.localClear();

        expect( FCH.localGet('language') ).toBe(false);
      });

      it('should clear a specific pair provided a key', function() {
        FCH.localSet('language', 'Spanish');
        FCH.localSet('catchphrase', 'infinito');

        // Ensure both values saved
        expect( localStorage.length ).toEqual(2);

        FCH.localClear('language');

        expect( localStorage.length ).toEqual(1);
        expect( FCH.localGet('language') ).toBe(false);
      });
    });
  });

  describe('.loop()', function() {
    it('should find all elements with a selector', function() {
      var selector1 = document.createElement('div');
      var selector2 = document.createElement('div');

      FCH.addClass(selector1, 'marker');
      FCH.addClass(selector2, 'marker');

      document.body.innerHTML += selector1.outerHTML + selector2.outerHTML;
      var iterations = 0;

      FCH.loop('.marker', function(el) {
        iterations++;
      });

      expect(iterations).toEqual(2);
    });

    it('should evaluate all elements of an array', function() {
      var arr = [1, 2, 3];

      FCH.loop(arr, function(item, idx) {
        arr[idx] += 1;
      });

      expect(arr).toEqual( [2,3,4] );
    });
  });

  // describe('.mobileFPS()', function() {

  //   it('should add class when scroll is triggered', function() {
  //     window.scroll(0, 1);

  //     expect(document.body.className).toEqual(' u-disable_hover');
  //   });

  // });

});
