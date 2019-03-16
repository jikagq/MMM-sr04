'use strict';

/* Magic Mirror
 * Module: MMM-SR04
 * 
 * By Jikagq
 * MIT Licensed
 */

const NodeHelper = require('node_helper');
const usonic = require('mmm-usonic');
const statistics = require('math-statistics');
const Gpio = require('onoff').Gpio;//on off gpio
var moment = require('moment');

var  presence=true;

const exec = require('child_process').exec;


//moment("2010-10-20 4:30",       "YYYY-MM-DD HH:mm");   // parsed as 4:30 local time



module.exports = NodeHelper.create({
	
	start: function () {
		const self = this;
		usonic.init(function (error) {
			if (error) {
				console.log(error);
			}else{
				self.initSensor();
            }
		});	
		console.log('Starting Module: ' + this.name);	
	},
	
	socketNotificationReceived: function (notification, payload) {
		var sensor;
		const self = this;
        var distances;// variable distance créer
		
		

		if (notification === 'WATCH') {
			
			if(self.sensor == null)
			{
			 console.log('null sensor');
			this.config=payload;
			self.sensor= usonic.createSensor(self.config.echoPin, self.config.triggerPin, self.config.timeout);
		    console.log('ini relias');
			if (this.config.relayPIN) {
			    this.relay = new Gpio(this.config.relayPIN, 'out');
			    //this.relay.writeSync(1);
		        //this.relay.writeSync(0);
		        setTimeout(function(){ self.relay.writeSync(0);}, 1000);
		  	    this.relay.writeSync(1); 
		  	    
			    }
			}
		    console.log('Config: ' + JSON.stringify(this.config));
            self.distances = [];      
            //console.log(self.sensor());
            var distest;
            distest=self.sensor();
            console.log(distest);
			(function measure() {
				//console.log('Bite my shiny metal ass '+self.distances);
				if (!self.distances || self.distances.length === self.config.rate) {
					if (self.distances) 
					{
						// ajouter un hystéresis
						var testpresence = statistics.median(self.distances);
						if(testpresence<=self.config.cstdist)
						{
							console.log("on !");
						}
						if(testpresence>self.config.cstdist)
						{
							console.log("off !");
					    }
					}
			self.distances = [];      
			}//fin du if
        
		
		
		
		setTimeout(function () {
	    self.distances.push(self.sensor());
	    if(self.distances.length>self.config.rate)//secu
	    {
	       console.log('overflow');
	        self.distances = [];      
	    }
	    measure();
	    }, self.config.delay);
    })();
///////////////////////////////////////////////
 } else if (notification === 'HARD') {
 

	 
 }
},
	
initSensor: function () {
	}
  
});






