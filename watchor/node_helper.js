'use strict';

/* Magic Mirror
 * Module: Watchor
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
var hard=true;
const exec = require('child_process').exec;
var firstoff=false;
var firston=false;
var inhib=false;


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
		//this.buff = payload;
		//this.config=payload;
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
           	//console.log('aaaaaaaaaaaaaaaaaaaaaaaa'+self.distances); 
 
			(function measure() {
				//console.log('Bite my shiny metal ass '+self.distances);
				if (!self.distances || self.distances.length === self.config.rate) {
                //console.log('bbbbbbbbbbbbbbbbbbbb');  
                if (self.distances) 
                {
                    //console.log('ccccccccccccccccccccccccccccccccc');        
                    //print(distances);
                    // ajouter un hystéresis
                    var testpresence = statistics.median(self.distances);
                    if(testpresence<=self.config.cstdist)
                    {
                        presence=true;
                        console.log(presence);
                        self.config.delay=1000;//10s
                        if(firston==false)
                        {
                            firston=true;
                            firstoff=false;
							console.log('ecran on');
                            //exec("/opt/vc/bin/tvservice -s").stdout.on('data', function(data) {
							//if (data.indexOf("0x120002") !== -1)
							//exec("/opt/vc/bin/tvservice --preferred && chvt 6 && chvt 7", null);
							//});
							//exec("/opt/vc/bin/tvservice --preferred && sudo chvt 6 && sudo chvt 7", null);//ajouter une ligne pour controller les sortie des gpio pour le relai
							
							if(hard==false)//exeption lorsqye que l'on revient avant l'heure théorique
							{
								console.log('reveil de l ecran + allumage hdmi');
								console.log('hard on node helper');
								setTimeout(function(){ self.relay.writeSync(0);}, 1000);
		  	                    self.relay.writeSync(1); 
								hard=true
								self.sendSocketNotification("INHIB");
							}
						}
                    }
                    if(testpresence>self.config.cstdist)
                    {
                        presence=false;
                        console.log(presence);
                        self.config.delay=500;//5s
                        if(firstoff==false)
                        {
                            console.log('ecran off');
                            //exec("/opt/vc/bin/tvservice -o", null);
							firstoff=true;
                            firston=false;
							
                        }
                   }
           }
           self.distances = [];      
       }//fin du if
        setTimeout(function () {
	    self.distances.push(self.sensor());
	    //console.log(self.config.rate+'ffffffffffffff '+ self.distances.length);
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
 
	//changer et mettre des impulsions + un seul passage
	if(payload == false )
	{
		hard=payload;
		console.log('hard off node helper');
	    setTimeout(function(){ self.relay.writeSync(0);}, 1000);
		this.relay.writeSync(1); 
		//self.sendSocketNotification("REARM");
	}
	if(payload == true )
	{  
		hard=payload;
		console.log('hard on node helper');
		setTimeout(function(){ self.relay.writeSync(0);}, 1000);
		this.relay.writeSync(1); 
		//self.sendSocketNotification("REARM");
	}
	 
 }
},
	
initSensor: function () {
	}
  
});






