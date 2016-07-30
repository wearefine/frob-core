describe('FCH', function() {
  var FC = {};

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

      selector1.classList.add('marker');
      selector2.classList.add('marker');

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

  describe('Hook', function() {
    var int = 0;

    function increment() {
      int++;
    }

    describe('.add()', function() {

      it('should add a function to the callbacks', function() {
        int = 0;

        expect(int).toEqual(0);
        expect( FCH.ready.callbacks.length ).toEqual(0);

        FCH.ready.add( increment );
        expect( FCH.ready.callbacks.length ).toEqual(1);

        FCH.ready.remove( increment );
      });

      it('should execute the function when fire_immediately is true', function() {
        int = 0;

        expect(int).toEqual(0);

        FCH.ready.add( increment, true );
        expect( FCH.ready.callbacks.length ).toEqual(1);

        expect(int).toEqual(1);

        FCH.ready.remove( increment );
      });
    });

    describe('.remove()', function() {
      it('should remove the function from the callbacks', function() {
        expect( FCH.ready.callbacks.length ).toEqual(0);

        FCH.ready.add( increment );
        expect( FCH.ready.callbacks.length ).toEqual(1);

        FCH.ready.remove( increment );
        expect( FCH.ready.callbacks.length ).toEqual(0);
      });
    });
  });

  describe('.setBreakpoints()', function() {
    it('should include default breakpoints and custom breakpoints if override_breakpoints is false', function() {
      FCH.setBreakpoints(function(ww) {
          return {
            boot_size: ww < 12
          };
        },
        false
      );

      expect(FCH.bp.small).toBeDefined();
      expect(FCH.bp.boot_size).toBeDefined();
      expect(typeof FCH.bp.boot_size).toMatch('boolean');
    });

    // it('should override default default breakpoints with custom breakpoints if override_breakpoints is true', function() {
    //   FCH.setBreakpoints(function(ww) {
    //       return {
    //         boot_size: ww < 12
    //       };
    //     },
    //     true
    //   );

    //   expect(FCH.bp.small).not.toBeDefined();
    //   expect(FCH.bp.boot_size).toBeDefined();
    // });
  });

  describe('.bp', function() {
    it('should have default breakpoints if no options are passed', function() {
      // jasmine.any(Boolean) isn't applicable here
      expect(typeof FCH.bp.small).toMatch('boolean');
      expect(typeof FCH.bp.small_up).toMatch('boolean');
      expect(typeof FCH.bp.medium_portrait).toMatch('boolean');
      expect(typeof FCH.bp.medium).toMatch('boolean');
      expect(typeof FCH.bp.large_down).toMatch('boolean');
      expect(typeof FCH.bp.large).toMatch('boolean');
    });
  });

  describe('.blankit()', function() {
    it('should add a target="_blank" attribute to all external links', function() {
      var el1 = document.createElement('a'),
          el2 = document.createElement('a'),
          el3 = document.createElement('a');

      el1.setAttribute('href', '/relative/path');
      el2.setAttribute('href', 'https://externalurl.com');
      el3.setAttribute('href', '/blog/post-about-http');

      document.body.appendChild(el1);
      document.body.appendChild(el2);
      document.body.appendChild(el3);

      FCH.blankit();

      expect(el1.hasAttribute('target')).toBe(false);
      expect(el2.hasAttribute('target')).toBe(true);
      expect(el3.hasAttribute('target')).toBe(false);
    });
  });

});
