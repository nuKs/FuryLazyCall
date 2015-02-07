(function() {
  'use strict';

  function CallMethod(object, name, fn) {
    this.object = object;
    this.name = name;
    this.fn = object[name];
  }
  CallMethod.prototype.exec = function(args) {
    this.fn.apply(this.object, args);
  };
  CallMethod.prototype.replaceWith = function(newFn) {
    this.object[this.name] = newFn;
  };
  CallMethod.prototype.revert = function() {
    this.object[this.name] = this.fn;
  };
  CallMethod.prototype.equals = function(method) {
    return this.object === method.object && this.name === method.name;
  };

  function CallObject(method, args) {
    this.method = method;
    this.arguments = Array.prototype.slice.call(args);
  }
  CallObject.prototype.exec = function() {
    this.method.exec(this.arguments);
  };

  /**
   * [FuryLazyCall]
   */
  function FuryLazyCall() {
    this._isLoaded = false;
    this._methods = [];
    this._callQueue = [];
  }

  /**
   * [exec]
   */
  FuryLazyCall.prototype.exec = function() {
    this._isLoaded = true;
    this._revertAllMethods();
    this._makeCalls();
  };

  /**
   * [last]
   */
  FuryLazyCall.prototype.last = function(object, methodName) {
    if (this._isLoaded) {
      // do nothing
      return;
    }

    var _this = this,
        method = new CallMethod(object, methodName);

    method.replaceWith(function() {
      var callObject = _this._getCallObject(method);
      if(callObject) {
        // replace call args
        callObject.arguments = arguments;
      }
      else {
        // create new call
        var methodCall = new CallObject(method, arguments);

        _this._callQueue.push(methodCall);
      }
    });

    this._methods.push(method);
  };

  FuryLazyCall.prototype._getCallObject = function(method) {
    for(var i in this._callQueue) {
      var callObject = this._callQueue[i];
      if(method.equals(callObject.method)) {
        return callObject;
      }
    }
    return false;
  };
  FuryLazyCall.prototype._makeCalls = function() {
    this._callQueue.forEach(function(callObject) {
      callObject.exec();
    });
    this._callQueue = [];
  };
  FuryLazyCall.prototype._revertAllMethods = function() {
    this._methods.forEach(function(method) {
      method.revert();
    });
    this._methods = [];
  };

  if(typeof exports !== 'undefined') {
    exports = FuryLazyCall;
  }
  else {
    window.FuryLazyCall = FuryLazyCall;
  }

})();
//# sourceMappingURL=FuryLazyCall.js.map