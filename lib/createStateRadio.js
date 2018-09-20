
module.exports = function(json){
	
	var param = {
		device: {
			name: 'Sensor',
			protocol: '433Mhz',
			service: 'radioemitter',
			identifier: json.value
		},
		types: [
			{
				type: 'binary',
				identifier: '',
				sensor: true,
				min: 0,
				max: 1
			}
		]
	};

	var state = {
	  	value: 1
	};
	if(json.hasOwnProperty('Addr')) {
		param.device.identifier = parseInt(json.Addr) + `.` + parseInt(json.unit);
		param.device.protocol = `DIO`;
		state.value = json.value
	}
	// try to create the state
	return gladys.deviceState.createByIdentifier(param.device.identifier, param.device.service, param.types[0].type, state)
		.catch(() => {


			// if it fails to create the state, the device does not exist
			return gladys.device.create(param)
				.then(function(result) {

					// we create the state
					return gladys.deviceState.createByIdentifier(param.device.identifier, param.device.service, param.types[0].type, state);
				});
		});
};
