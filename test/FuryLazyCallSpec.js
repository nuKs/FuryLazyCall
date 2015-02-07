describe("FuryLazyCall", function() {

  beforeEach(function() {
    this.furyLazyCall = new FuryLazyCall();

    this.spy1 = new jasmine.createSpy('fn1');
    this.spy2 = new jasmine.createSpy('fn2').and.returnValue('spy 2 return');
    this.fn1 = this.spy1;
    this.fn2 = this.spy2;
  });

  describe("#last", function() {

    it("should call methods once after exec", function() {
      this.furyLazyCall.last(this, 'fn1');
      this.furyLazyCall.last(this, 'fn2');

      this.fn1();
      this.fn2('arg1', 'arg2');
      this.fn2('with arg');

      expect(this.spy1.calls.count()).toEqual(0);
      expect(this.spy2.calls.count()).toEqual(0);

      this.furyLazyCall.exec();

      expect(this.spy1.calls.count()).toEqual(1);
      expect(this.spy2.calls.count()).toEqual(1);
      expect(this.spy2.calls.mostRecent()).toEqual({
        object: this,
        args: ['with arg'],
        returnValue: 'spy 2 return'
      });

      this.furyLazyCall.exec();

      expect(this.spy1.calls.count()).toEqual(1);
      expect(this.spy2.calls.count()).toEqual(1);
    });

  });

});
