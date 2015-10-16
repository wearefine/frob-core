;(function() { FCH.ready.push(FC.init); FCH.init(); })();

describe('FCH', function() {

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

      expect(el.className).toEqual('');
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

  describe('x.mobileFPS()', function() {

    it('should add class when scroll is triggered', function() {
      window.scroll(0, 1);

      expect(document.body.className).toEqual(' u-disable_hover');
    });

  });

});
