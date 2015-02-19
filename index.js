var hue = require("node-hue-api"),
	HueApi = hue.HueApi,
	lightState = hue.lightState,
	username = "38ab17cc31b0760fd6543a419088da7",
	hostname = "hue.chlan",
	api = new HueApi(hostname, username);

var light_ids = [],
	light_timer = [],
	update_interval = 3600, //seconds
	first = true,
	d = new Date();

var sky_rgb_per_hour = {
	5: [57, 91, 157],
	6: [88, 128, 189],
	7: [125, 169, 216],
	8: [176, 212, 240],
	9: [210, 233, 249],
	10: [194, 221, 243],
	11: [183, 213, 239],
	12: [176, 205, 236],
	13: [154, 186, 228],
	14: [144, 173, 215],
	15: [124, 154, 200],
	16: [122, 135, 192],
	17: [103, 120, 181],
	18: [61, 79, 157],
	19: [41, 55, 109],
	20: [25, 32, 64],
	21: [18, 24, 51],
	22: [17, 20, 37],
	23: [18, 18, 25],
	0: [18, 18, 25],
	1: [15, 22, 40],
	2: [18, 30, 51],
	3: [26, 42, 70],
	4: [41, 59, 107]
}

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

// Get the id's of the lights (though they are probably just 1, 2 and 3)
var setLightIds = function(result) {
	light_ids = result['lights'].map(function(light){ return light.id; });
}

var startTimer = function() {
	changeLights();
	light_timer = setInterval(changeLights, update_interval*1000);
}

var changeLights = function() {
	var rgb = getRGBValueForCurrentTime();
	var state = lightState.create().on().bri(255).rgb(rgb);

	// Make sure lights don't take an hour to fade from black to the first state
	if(!first) {
		state.transitiontime(update_interval*1000);
		first = false;
	}

	light_ids.forEach(function(light_id) {
			api.setLightState(light_id, state);
	});
}

var getRGBValueForCurrentTime = function() {
	var n = getHours();
	return sky_rgb_per_hour[n];
}

// var counter = 22;

var getHours = function() {
	// var h =counter++ % 24;
	// console.log("Hours",h);
	// return h;
	return d.getHours();
}

api.lights()
    .then(setLightIds)
    .then(startTimer)
    .done();