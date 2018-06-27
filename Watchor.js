/* Magic Mirror
 * Module: Watchor
 * 
 * By Jikagq
 * MIT Licensed
 */

Module.register("Watchor", {
	defaults : {
	    echoPin: 17, //broche echo
	    triggerPin: 27, //broche trigger
	    timeout: 750, //temps maximal d'attente entre de pulse echo
	    delay: 60, 
	    rate: 10, //frequence de rafraichissement du capteur
		cstdist: 30, //constante distance limite
		relayPIN: 3,//broche de controle relais
		cptnotif: 0,
		inhib: false,
		
	},
	  
	start: function() {
		var self = this;
		//self.sendSocketNotification('INIT', self.config);
		
		Log.log("this is watchor start function");
		
		self.sendSocketNotification('WATCH', self.config);
		//var now = moment();
		//Log.log("heure actuelle avec watchor"+now.format("YYYY-MM-DD HH:mm"));

	},
	
notificationReceived: function(notification, payload, sender) {
		var self = this;
					
		
		if (notification === "CALENDAR_EVENTS") {
			Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name + "payload: "+ payload);
			Log.log(payload.length);
			var taille = payload.length;
		    var listedevents = [];
			var testcalendrier = true;
			listedevents = payload;
		    
			Log.log("testcalendrier "+testcalendrier );
			Log.log("self.config.inhib"+self.config.inhib);
			if(self.config.inhib == true)
			{
				var heure = moment();
				if((heure.hour() < 19))
				{
				//toujours en inhib	
				testcalendrier = false;
				}else{
				//sortie d'inhib
				self.config.inhib = false;
				testcalendrier = true;
				}
			}
			
			
			if(testcalendrier == true)//test inhibition du calendrier
			{
				if(listedevents.length == 0 )
				{
					Log.log("null");
				}else{
					var now = moment();
					var listedebut = [];
					var listefin = [];
					var i;
					var hard = true;
					for(i=0;i<listedevents.length;i++)
					{
						var bufferdebut;
						var bufferfin;
						bufferdebut=moment.unix(listedevents[i].startDate/1000);
						bufferfin=moment.unix(listedevents[i].endDate/1000);
						if(bufferdebut.isSame(now, 'day') && bufferfin.isSame(now, 'day'))
						{
							listedebut.push(bufferdebut);
							listefin.push(bufferfin);
						}
					}
					//Log.log(listedebut.length);
					//Log.log(listefin.length);
					self.config.cptnotif++;//a activer lorque il y a 2 calendrier
					Log.log("cpt notif"+ self.config.cptnotif);
							
					
					if(self.config.cptnotif == 2)
					{
					 self.config.cptnotif=0;
						if(listedebut.length == 0 || listefin.length == 0  )//secu pour eviter de tester un array vide
						{
							Log.log("aucun event dans la journée");
							Log.log("hard on");//hard on
							hard = true;
							this.sendSocketNotification('HARD',hard);
						}else{
							Log.log("un envent prevu a ");
							Log.log(listedebut[0].format("DD MMM YYYY HH:mm"));
							Log.log(listefin[listefin.length-1].format("DD MMM YYYY HH:mm"));
							if(now.isAfter(listedebut[0]))
							{
								Log.log("hard off");//hard off
								hard = false;
								this.sendSocketNotification('HARD',hard);
							}
						/**if(now.isAfter(listefin[listefin.length-1]))
						{
							Log.log("hard on");//hard on
							hard = true;
							this.sendSocketNotification('HARD',hard);
						}**/
						}
					}	
				}	
			}else{
			Log.log("calendrier en inhibition");
			//self.sendSocketNotification('WATCH', self.config);
			}
			
			
			
			
		
		
		}
	},
	
	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		var self = this;
		if(notification === "REARM") {
		self.sendSocketNotification('WATCH', self.config);
		Log.log("rearmed!!");
		
		}else if(notification === "INHIB"){
		self.config.inhib=true;
		Log.log("inhib true");
		Log.log("hard on");
		}
	},
	
	
	

});
