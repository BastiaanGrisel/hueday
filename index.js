var hue = require("node-hue-api"),
	HueApi = hue.HueApi,
	lightState = hue.lightState,
	username = "38ab17cc31b0760fd6543a419088da7",
	hostname = "hue.chlan",
	api = new HueApi(hostname, username);

var light_ids = [],
	light_timer = [],
	update_interval = 30 * 60 * 1000,
	today = new Date(),
	hue = Math.round(Math.random()*65535);

// Get the id's of the lights (though they are probably just 1, 2 and 3)
var setLightIds = function(result) {
	light_ids = result['lights'].map(function(light){ return light.id; });
}

var startTimer = function() {
	changeLights();
	light_timer = setInterval(changeLights, update_interval);
}

var changeLights = function() {
	var state = lightState.create().transitiontime(10).bri(255).hue(getHue());

	light_ids.forEach(function(light_id) {
		console.log("set light", light_id, state);
		api.setLightState(light_id, state);
	});
}

var getHue = function() {
	var d = new Date();

	if(today.getDate() != d.getDate()) {
		today = d;
		hue = Math.round(Math.random()*65535);
	}

	return hue;
}

api.lights()
    .then(setLightIds)
    .then(startTimer)
    .done();