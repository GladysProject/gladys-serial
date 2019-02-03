var SerialPort = require('serialport');
var Readline = require('@serialport/parser-readline')
var shared = require('./shared.js');
var parseData = require('./parseData.js');
var Promise = require('bluebird');

module.exports = function() {

  // first we close all opened connection
  return shared.reset()
    .then(function(){
        
        // we get all devices from this service
        return gladys.device.getByService({ service: 'serial' });
    })
    .then(function(devices) {

      // foreach device
      return Promise.map(devices, function(device) {

        // we connect to the device
        var port = new SerialPort(device.identifier);
        var parser = port.pipe(new Readline({ delimiter: '\n'}));
        
        parser.on('error', function(err) {
          sails.log.warn('Gladys serial error : ', err.message);
        });

        // if we receive data, we parse it
        parser.on('data', parseData);

        // we add the port object to the shared list
        shared.addPort(port);

        return port;
      });
    });
};
