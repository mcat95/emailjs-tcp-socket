'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ramda = require('ramda');

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _tls = require('tls');

var _tls2 = _interopRequireDefault(_tls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TCPSocket = function () {
  _createClass(TCPSocket, null, [{
    key: 'open',
    value: function open(host, port) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return new TCPSocket({ host: host, port: port, options: options });
    }
  }]);

  function TCPSocket(_ref) {
    var _this = this;

    var host = _ref.host,
        port = _ref.port,
        options = _ref.options;

    _classCallCheck(this, TCPSocket);

    this.host = host;
    this.port = port;
    this.ssl = (0, _ramda.propOr)(false, 'useSecureTransport')(options);
    this.bufferedAmount = 0;
    this.readyState = 'connecting';
    this.binaryType = (0, _ramda.propOr)('arraybuffer', 'binaryType')(options);

    if (this.binaryType !== 'arraybuffer') {
      throw new Error('Only arraybuffers are supported!');
    }

    this._socket = this.ssl ? _tls2.default.connect({
      port: this.port,
      host: this.host,
      minVersion: options.minTLSVersion || _tls2.default.DEFAULT_MIN_VERSION,
      maxVersion: options.maxTLSVersion || _tls2.default.DEFAULT_MAX_VERSION,
      servername: this.host // SNI
    }, function () {
      return _this._emit('open');
    }) : _net2.default.connect(this.port, this.host, function () {
      return _this._emit('open');
    });

    // add all event listeners to the new socket
    this._attachListeners();
  }

  _createClass(TCPSocket, [{
    key: '_attachListeners',
    value: function _attachListeners() {
      var _this2 = this;

      this._socket.on('data', function (nodeBuf) {
        return _this2._emit('data', nodeBuffertoArrayBuffer(nodeBuf));
      });
      this._socket.on('error', function (error) {
        // Ignore ECONNRESET errors. For the app this is the same as normal close
        if (error.code !== 'ECONNRESET') {
          _this2._emit('error', error);
        }
        _this2.close();
      });

      this._socket.on('end', function () {
        return _this2._emit('close');
      });
    }
  }, {
    key: '_removeListeners',
    value: function _removeListeners() {
      this._socket.removeAllListeners('data');
      this._socket.removeAllListeners('end');
      this._socket.removeAllListeners('error');
    }
  }, {
    key: '_emit',
    value: function _emit(type, data) {
      var target = this;
      switch (type) {
        case 'open':
          this.readyState = 'open';
          this.onopen && this.onopen({ target: target, type: type, data: data });
          break;
        case 'error':
          this.onerror && this.onerror({ target: target, type: type, data: data });
          break;
        case 'data':
          this.ondata && this.ondata({ target: target, type: type, data: data });
          break;
        case 'drain':
          this.ondrain && this.ondrain({ target: target, type: type, data: data });
          break;
        case 'close':
          this.readyState = 'closed';
          this.onclose && this.onclose({ target: target, type: type, data: data });
          break;
      }
    }

    //
    // API
    //

  }, {
    key: 'close',
    value: function close() {
      this.readyState = 'closing';
      this._socket.end();
    }
  }, {
    key: 'send',
    value: function send(data) {
      // convert data to string or node buffer
      this._socket.write(arrayBufferToNodeBuffer(data), this._emit.bind(this, 'drain'));
    }
  }, {
    key: 'upgradeToSecure',
    value: function upgradeToSecure() {
      var _this3 = this;

      if (this.ssl) return;

      this._removeListeners();
      this._socket = _tls2.default.connect({ socket: this._socket }, function () {
        _this3.ssl = true;
      });
      this._attachListeners();
    }
  }]);

  return TCPSocket;
}();

exports.default = TCPSocket;


var nodeBuffertoArrayBuffer = function nodeBuffertoArrayBuffer(buf) {
  return Uint8Array.from(buf).buffer;
};
var arrayBufferToNodeBuffer = function arrayBufferToNodeBuffer(ab) {
  return Buffer.from(new Uint8Array(ab));
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9ub2RlLXNvY2tldC5qcyJdLCJuYW1lcyI6WyJUQ1BTb2NrZXQiLCJob3N0IiwicG9ydCIsIm9wdGlvbnMiLCJzc2wiLCJidWZmZXJlZEFtb3VudCIsInJlYWR5U3RhdGUiLCJiaW5hcnlUeXBlIiwiRXJyb3IiLCJfc29ja2V0IiwidGxzIiwiY29ubmVjdCIsIm1pblZlcnNpb24iLCJtaW5UTFNWZXJzaW9uIiwiREVGQVVMVF9NSU5fVkVSU0lPTiIsIm1heFZlcnNpb24iLCJtYXhUTFNWZXJzaW9uIiwiREVGQVVMVF9NQVhfVkVSU0lPTiIsInNlcnZlcm5hbWUiLCJfZW1pdCIsIm5ldCIsIl9hdHRhY2hMaXN0ZW5lcnMiLCJvbiIsIm5vZGVCdWZmZXJ0b0FycmF5QnVmZmVyIiwibm9kZUJ1ZiIsImVycm9yIiwiY29kZSIsImNsb3NlIiwicmVtb3ZlQWxsTGlzdGVuZXJzIiwidHlwZSIsImRhdGEiLCJ0YXJnZXQiLCJvbm9wZW4iLCJvbmVycm9yIiwib25kYXRhIiwib25kcmFpbiIsIm9uY2xvc2UiLCJlbmQiLCJ3cml0ZSIsImFycmF5QnVmZmVyVG9Ob2RlQnVmZmVyIiwiYmluZCIsIl9yZW1vdmVMaXN0ZW5lcnMiLCJzb2NrZXQiLCJVaW50OEFycmF5IiwiZnJvbSIsImJ1ZiIsImJ1ZmZlciIsImFiIiwiQnVmZmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0lBRXFCQSxTOzs7eUJBQ05DLEksRUFBTUMsSSxFQUFvQjtBQUFBLFVBQWRDLE9BQWMsdUVBQUosRUFBSTs7QUFDckMsYUFBTyxJQUFJSCxTQUFKLENBQWMsRUFBRUMsVUFBRixFQUFRQyxVQUFSLEVBQWNDLGdCQUFkLEVBQWQsQ0FBUDtBQUNEOzs7QUFFRCwyQkFBc0M7QUFBQTs7QUFBQSxRQUF2QkYsSUFBdUIsUUFBdkJBLElBQXVCO0FBQUEsUUFBakJDLElBQWlCLFFBQWpCQSxJQUFpQjtBQUFBLFFBQVhDLE9BQVcsUUFBWEEsT0FBVzs7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QUFLLE9BQUw7QUFDRSxlQUFLeEIsVUFBTCxHQUFrQixRQUFsQjtBQUNBLGVBQUs4QixPQUFMLElBQWdCLEtBQUtBLE9BQUwsQ0FBYSxFQUFFTCxjQUFGLEVBQVVGLFVBQVYsRUFBZ0JDLFVBQWhCLEVBQWIsQ0FBaEI7QUFDQTtBQWpCSjtBQW1CRDs7QUFFRDtBQUNBO0FBQ0E7Ozs7NEJBRVM7QUFDUCxXQUFLeEIsVUFBTCxHQUFrQixTQUFsQjtBQUNBLFdBQUtHLE9BQUwsQ0FBYTRCLEdBQWI7QUFDRDs7O3lCQUVLUCxJLEVBQU07QUFDVjtBQUNBLFdBQUtyQixPQUFMLENBQWE2QixLQUFiLENBQW1CQyx3QkFBd0JULElBQXhCLENBQW5CLEVBQWtELEtBQUtYLEtBQUwsQ0FBV3FCLElBQVgsQ0FBZ0IsSUFBaEIsRUFBc0IsT0FBdEIsQ0FBbEQ7QUFDRDs7O3NDQUVrQjtBQUFBOztBQUNqQixVQUFJLEtBQUtwQyxHQUFULEVBQWM7O0FBRWQsV0FBS3FDLGdCQUFMO0FBQ0EsV0FBS2hDLE9BQUwsR0FBZUMsY0FBSUMsT0FBSixDQUFZLEVBQUUrQixRQUFRLEtBQUtqQyxPQUFmLEVBQVosRUFBc0MsWUFBTTtBQUFFLGVBQUtMLEdBQUwsR0FBVyxJQUFYO0FBQWlCLE9BQS9ELENBQWY7QUFDQSxXQUFLaUIsZ0JBQUw7QUFDRDs7Ozs7O2tCQTdGa0JyQixTOzs7QUFnR3JCLElBQU11QiwwQkFBMEIsU0FBMUJBLHVCQUEwQjtBQUFBLFNBQU9vQixXQUFXQyxJQUFYLENBQWdCQyxHQUFoQixFQUFxQkMsTUFBNUI7QUFBQSxDQUFoQztBQUNBLElBQU1QLDBCQUEwQixTQUExQkEsdUJBQTBCLENBQUNRLEVBQUQ7QUFBQSxTQUFRQyxPQUFPSixJQUFQLENBQVksSUFBSUQsVUFBSixDQUFlSSxFQUFmLENBQVosQ0FBUjtBQUFBLENBQWhDIiwiZmlsZSI6Im5vZGUtc29ja2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHJvcE9yIH0gZnJvbSAncmFtZGEnXG5pbXBvcnQgbmV0IGZyb20gJ25ldCdcbmltcG9ydCB0bHMgZnJvbSAndGxzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUQ1BTb2NrZXQge1xuICBzdGF0aWMgb3BlbiAoaG9zdCwgcG9ydCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBUQ1BTb2NrZXQoeyBob3N0LCBwb3J0LCBvcHRpb25zIH0pXG4gIH1cblxuICBjb25zdHJ1Y3RvciAoeyBob3N0LCBwb3J0LCBvcHRpb25zIH0pIHtcbiAgICB0aGlzLmhvc3QgPSBob3N0XG4gICAgdGhpcy5wb3J0ID0gcG9ydFxuICAgIHRoaXMuc3NsID0gcHJvcE9yKGZhbHNlLCAndXNlU2VjdXJlVHJhbnNwb3J0Jykob3B0aW9ucylcbiAgICB0aGlzLmJ1ZmZlcmVkQW1vdW50ID0gMFxuICAgIHRoaXMucmVhZHlTdGF0ZSA9ICdjb25uZWN0aW5nJ1xuICAgIHRoaXMuYmluYXJ5VHlwZSA9IHByb3BPcignYXJyYXlidWZmZXInLCAnYmluYXJ5VHlwZScpKG9wdGlvbnMpXG5cbiAgICBpZiAodGhpcy5iaW5hcnlUeXBlICE9PSAnYXJyYXlidWZmZXInKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgYXJyYXlidWZmZXJzIGFyZSBzdXBwb3J0ZWQhJylcbiAgICB9XG5cbiAgICB0aGlzLl9zb2NrZXQgPSB0aGlzLnNzbFxuICAgICAgPyB0bHMuY29ubmVjdCh7XG4gICAgICAgIHBvcnQ6IHRoaXMucG9ydCxcbiAgICAgICAgaG9zdDogdGhpcy5ob3N0LFxuICAgICAgICBtaW5WZXJzaW9uOiBvcHRpb25zLm1pblRMU1ZlcnNpb24gfHwgdGxzLkRFRkFVTFRfTUlOX1ZFUlNJT04sXG4gICAgICAgIG1heFZlcnNpb246IG9wdGlvbnMubWF4VExTVmVyc2lvbiB8fCB0bHMuREVGQVVMVF9NQVhfVkVSU0lPTixcbiAgICAgICAgc2VydmVybmFtZTogdGhpcy5ob3N0IC8vIFNOSVxuICAgICAgfSwgKCkgPT4gdGhpcy5fZW1pdCgnb3BlbicpKVxuICAgICAgOiBuZXQuY29ubmVjdCh0aGlzLnBvcnQsIHRoaXMuaG9zdCwgKCkgPT4gdGhpcy5fZW1pdCgnb3BlbicpKVxuXG4gICAgLy8gYWRkIGFsbCBldmVudCBsaXN0ZW5lcnMgdG8gdGhlIG5ldyBzb2NrZXRcbiAgICB0aGlzLl9hdHRhY2hMaXN0ZW5lcnMoKVxuICB9XG5cbiAgX2F0dGFjaExpc3RlbmVycyAoKSB7XG4gICAgdGhpcy5fc29ja2V0Lm9uKCdkYXRhJywgbm9kZUJ1ZiA9PiB0aGlzLl9lbWl0KCdkYXRhJywgbm9kZUJ1ZmZlcnRvQXJyYXlCdWZmZXIobm9kZUJ1ZikpKVxuICAgIHRoaXMuX3NvY2tldC5vbignZXJyb3InLCBlcnJvciA9PiB7XG4gICAgICAvLyBJZ25vcmUgRUNPTk5SRVNFVCBlcnJvcnMuIEZvciB0aGUgYXBwIHRoaXMgaXMgdGhlIHNhbWUgYXMgbm9ybWFsIGNsb3NlXG4gICAgICBpZiAoZXJyb3IuY29kZSAhPT0gJ0VDT05OUkVTRVQnKSB7XG4gICAgICAgIHRoaXMuX2VtaXQoJ2Vycm9yJywgZXJyb3IpXG4gICAgICB9XG4gICAgICB0aGlzLmNsb3NlKClcbiAgICB9KVxuXG4gICAgdGhpcy5fc29ja2V0Lm9uKCdlbmQnLCAoKSA9PiB0aGlzLl9lbWl0KCdjbG9zZScpKVxuICB9XG5cbiAgX3JlbW92ZUxpc3RlbmVycyAoKSB7XG4gICAgdGhpcy5fc29ja2V0LnJlbW92ZUFsbExpc3RlbmVycygnZGF0YScpXG4gICAgdGhpcy5fc29ja2V0LnJlbW92ZUFsbExpc3RlbmVycygnZW5kJylcbiAgICB0aGlzLl9zb2NrZXQucmVtb3ZlQWxsTGlzdGVuZXJzKCdlcnJvcicpXG4gIH1cblxuICBfZW1pdCAodHlwZSwgZGF0YSkge1xuICAgIGNvbnN0IHRhcmdldCA9IHRoaXNcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ29wZW4nOlxuICAgICAgICB0aGlzLnJlYWR5U3RhdGUgPSAnb3BlbidcbiAgICAgICAgdGhpcy5vbm9wZW4gJiYgdGhpcy5vbm9wZW4oeyB0YXJnZXQsIHR5cGUsIGRhdGEgfSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgICAgdGhpcy5vbmVycm9yICYmIHRoaXMub25lcnJvcih7IHRhcmdldCwgdHlwZSwgZGF0YSB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgIHRoaXMub25kYXRhICYmIHRoaXMub25kYXRhKHsgdGFyZ2V0LCB0eXBlLCBkYXRhIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdkcmFpbic6XG4gICAgICAgIHRoaXMub25kcmFpbiAmJiB0aGlzLm9uZHJhaW4oeyB0YXJnZXQsIHR5cGUsIGRhdGEgfSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ2Nsb3NlJzpcbiAgICAgICAgdGhpcy5yZWFkeVN0YXRlID0gJ2Nsb3NlZCdcbiAgICAgICAgdGhpcy5vbmNsb3NlICYmIHRoaXMub25jbG9zZSh7IHRhcmdldCwgdHlwZSwgZGF0YSB9KVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIC8vXG4gIC8vIEFQSVxuICAvL1xuXG4gIGNsb3NlICgpIHtcbiAgICB0aGlzLnJlYWR5U3RhdGUgPSAnY2xvc2luZydcbiAgICB0aGlzLl9zb2NrZXQuZW5kKClcbiAgfVxuXG4gIHNlbmQgKGRhdGEpIHtcbiAgICAvLyBjb252ZXJ0IGRhdGEgdG8gc3RyaW5nIG9yIG5vZGUgYnVmZmVyXG4gICAgdGhpcy5fc29ja2V0LndyaXRlKGFycmF5QnVmZmVyVG9Ob2RlQnVmZmVyKGRhdGEpLCB0aGlzLl9lbWl0LmJpbmQodGhpcywgJ2RyYWluJykpXG4gIH1cblxuICB1cGdyYWRlVG9TZWN1cmUgKCkge1xuICAgIGlmICh0aGlzLnNzbCkgcmV0dXJuXG5cbiAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcnMoKVxuICAgIHRoaXMuX3NvY2tldCA9IHRscy5jb25uZWN0KHsgc29ja2V0OiB0aGlzLl9zb2NrZXQgfSwgKCkgPT4geyB0aGlzLnNzbCA9IHRydWUgfSlcbiAgICB0aGlzLl9hdHRhY2hMaXN0ZW5lcnMoKVxuICB9XG59XG5cbmNvbnN0IG5vZGVCdWZmZXJ0b0FycmF5QnVmZmVyID0gYnVmID0+IFVpbnQ4QXJyYXkuZnJvbShidWYpLmJ1ZmZlclxuY29uc3QgYXJyYXlCdWZmZXJUb05vZGVCdWZmZXIgPSAoYWIpID0+IEJ1ZmZlci5mcm9tKG5ldyBVaW50OEFycmF5KGFiKSlcbiJdfQ==