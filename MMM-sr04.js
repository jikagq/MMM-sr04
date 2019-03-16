/* Magic Mirror
 * Module: MMM-SR04
 * 
 * By Jikagq
 * MIT Licensed
 */

Module.register("MMM-sr04", {
	defaults : {
	    echoPin: 17, //broche echo
	    triggerPin: 27, //broche trigger
	    timeout: 750, //temps maximal d'attente entre de pulse echo
	    delay: 60, 
	    rate: 10, //frequence de rafraichissement du capteur
		cstdist: 30, //constante distance limite
		relayPIN: 3,//broche de controle relais
		//cptnotif: 0,
		deepsleepstart: "23:59",
		deepsleepend: "7:00",
	},
	  
	  
	  
	start: function() {
		var self = this;
		Log.log("this is watchor start function");
		self.sendSocketNotification('WATCH', self.config);

	},
	
notificationReceived: function(notification, payload, sender) {
		var self = this;
		var deepsleep = false;
		
		var deepsleepst = moment(self.config.deepsleepstart,"HH:mm");   
		var deepsleepnd = moment(self.config.deepsleepend,"HH:mm");
		
		if (notification === "CALENDAR_EVENTS") {
			
			var heure = moment();
			
			
			
			if(){//si on est entre start et end alors actionne le relais
				Log.log("deepsleep on !");
				this.sendSocketNotification('DEEPSLEEP',deepsleep);
			}else{
				Log.log(deepsleep off !);
			}
			
			
			
			
			
			
		}
		
	},
	
	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		var self = this;
		/*if(notification === "REARM") {
		
		}*/
	},
	
	
	

});
