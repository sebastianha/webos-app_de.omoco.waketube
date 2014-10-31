/*
WakeTube - Wake up with a random YouTube video.
Version 1.0.5 (01. Apr 2010)

Copyright (C) 2010 Sebastian Hammerl (E-Mail: waketube@omoco.de)

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of
the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, see <http://www.gnu.org/licenses/>.
*/

function MainAssistant() {

}

MainAssistant.prototype.setup = function() {
	this.appMenuModel = {
		visible: true,
		items: [
			Mojo.Menu.editItem,
			{ label: $L("About"), command: 'about' },
			{ label: $L("Help"), command: 'tutorial' },
			{ label: $L("Preferences"), command: 'preferences' }
		]
	};
	
	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
	
	AdMob.ad.initialize({
		pub_id: 'a14c3591cf7b263',
		bg_color: '#ccc',
		text_color: '#333',
		test_mode: false
	});
	
	AdMob.ad.request({
		onSuccess: (function (ad) {
			this.controller.get('admob_ad').insert(ad);
		}).bind(this),
		onFailure: (function () {}).bind(this),
	});
	
	this.newadauto.bind(this).delay(60);
	
	//Mojo.Log.error("### SETUP #######################");
	
	var initialTime = new Date()
	
	this.Conoff = false;
	this.Ckeywords = "";
	this.Calarmts = initialTime.getTime()  - (initialTime.getHours()*1000*60*60) - (initialTime.getMinutes()*60*1000) - (initialTime.getSeconds()*1000) + 8*1000*60*60;
	
	var cookie = new Mojo.Model.Cookie("WakeTube");
	var Prefs = cookie.get();
	if(Prefs != null)
	{
		//Mojo.Log.error("##### Cookie found");
		this.Conoff = Prefs.onoff;
		this.Ckeywords = Prefs.keywords;
		this.Calarmts = Prefs.alarmts;
	} else {
		//Mojo.Log.error("##### NO Cookie found");
		Mojo.Controller.getAppController().getStageController('main').pushScene("tutorial");
	}
	
	//Mojo.Log.error("##### LOAD: " + this.Conoff + " " + this.Ckeywords + " " + this.Calarmts);
	
	var keywordsattr = {
		hintText: '',
		textFieldName: 'name', 
		modelProperty: 'original', 
		multiline: false,
		focus: false, 
		maxLength: 100,
	};
	keywordsmodel = {
		'original' : this.Ckeywords,
		disabled: false
	};
	this.controller.setupWidget('keywords', keywordsattr, keywordsmodel);

	var timepickerattr = {
		modelProperty: 'time',
		minuteInterval: 1,
		labelPlacement: Mojo.Widget.labelPlacementLeft
	};
	timepickermodel = {
		time: new Date(parseInt(this.Calarmts))
	}
	this.controller.setupWidget("timepicker", timepickerattr, timepickermodel); 
	
	tattr = {trueLabel: 'On', falseLabel: 'Off'};
	tModel = {value: this.Conoff, disabled: false};
	
	this.controller.setupWidget('onofftoggle', tattr, tModel);
	Mojo.Event.listen(this.controller.get('onofftoggle'),Mojo.Event.propertyChange,this.togglePressed.bind(this));
	Mojo.Event.listen(this.controller.get('timepicker'),Mojo.Event.propertyChange,this.togglePressed.bind(this));
	
	this.controller.listen(this.controller.get('test'),Mojo.Event.tap, this.testButtonPressed.bind(this));
	
	if(PLAY == true && this.Conoff == true)
	{
		PLAY = false;
		this.play(this.Ckeywords);
	}
	
	/*var launchParams = {};
    try {
		launchParams = PalmSystem.launchParams.evalJSON(true);
		if(launchParams.alarmnow != null && this.Conoff == true)
		{
			this.play(this.Ckeywords);
		}
	} 
	catch (err) {}*/


	var cookie2 = new Mojo.Model.Cookie("WTDonate");
	var Prefs2 = cookie2.get();
	if(Prefs2 != null)
	{
		//Mojo.Log.error("##### Donate Cookie found");
		if(Prefs2.donate)
			this.controller.get('donatemessage').style.display = "block";
	} else {
		//Mojo.Log.error("##### NO Donate Cookie found");
		this.controller.get('donatemessage').style.display = "block";
	}
	

}

MainAssistant.prototype.newadauto = function(event) {
	AdMob.ad.request({
		onSuccess: (function(ad){
			this.controller.get('admob_ad').childElements()[0].replace(ad);
		}).bind(this),
		onFailure: (function(){}).bind(this),
	});
	
	this.newadauto.bind(this).delay(60);
}

MainAssistant.prototype.setAndSave = function(){
	var currentTime = new Date();
	
	ts = timepickermodel.time.getTime();
	while(currentTime.getTime() < ts) {
		ts = ts - (60*60*24*1000);
	}

	// >= ??!!
	while(currentTime.getTime() > ts) {
		ts = ts + (60*60*24*1000);
	}
	
	if(tModel.value == true) {
		var newAlarmTime = new Date(ts);
	
		var newAlarmDate = "";
		var Aday = newAlarmTime.getUTCDate();
		if(Aday.toString().length < 2)
			Aday = "0" + Aday;
		var Amonth = newAlarmTime.getUTCMonth()+1;
		if(Amonth.toString().length < 2)
			Amonth = "0" + Amonth;
		var Ayear = newAlarmTime.getUTCFullYear();
		var Ahours = newAlarmTime.getUTCHours();
		if(Ahours.toString().length < 2)
			Ahours = "0" + Ahours;
		var Aminutes = newAlarmTime.getUTCMinutes();
		if(Aminutes.toString().length < 2)
			Aminutes = "0" + Aminutes;
	
		newAlarmDate = Amonth + "/" + Aday + "/" + Ayear + " " + Ahours + ":" + Aminutes + ":00";
	
		//Mojo.Controller.errorDialog(newAlarmDate + "  -  " + newAlarmTime.toString());
		//Mojo.Log.error(newAlarmDate + "  -  " + newAlarmTime.toString());
		
		this.controller.serviceRequest('palm://com.palm.power/timeout', {
			method: "set",
 			parameters: {
				"wakeup": true,
				"key": "com.de.omoco.waketube.timer",
				"uri": "palm://com.palm.applicationManager/open",
				"params": { 'id': 'de.omoco.waketube', 'params': {'alarmnow': '1'}},
				"at": newAlarmDate
			},
			onSuccess: function(response){},
			onFailure: function(response){
				Mojo.Controller.errorDialog("Error setting timer: " + response.errorText);
			}
 		});
	} else {
		this.controller.serviceRequest('palm://com.palm.power/timeout', {
			method: "clear",
 			parameters: { "key" : "com.de.omoco.waketube.timer" }
		});
	}
	
	//Mojo.Log.error("##### SAVE: " + tModel.value + " " + keywordsmodel['original'] + " " + ts);
	
	var cookie = new Mojo.Model.Cookie("WakeTube");
	cookie.put({
		onoff: tModel.value,
		keywords: keywordsmodel['original'],
		alarmts: ts
	});
}

MainAssistant.prototype.togglePressed = function() {
	this.setAndSave();
}

MainAssistant.prototype.testButtonPressed = function(event) {
	this.play(keywordsmodel['original']);
}

MainAssistant.prototype.play = function(keywords) {
	if (keywords.split("?")[0].toLowerCase() == "http://www.youtube.com/watch" || keywords.split("?")[0].toLowerCase() == "http://youtube.com/watch") {
		this.controller.serviceRequest('palm://com.palm.applicationManager', {
			method: 'launch',
			parameters: {
				id: "com.palm.app.youtube",
				params: {
					"direct": true,
					"target": keywords
				}
			}
		});
	} else if (keywords == "") {
		//var url = "http://www.youtube.com/music?nomobile=1";
		//var url = "http://m.youtube.com/music";
		/* Youtube seems to block ajax request directly from the palm pre.
		 * In the emulator all seems fine but does not work on the device.
		 * So I have to redirect it through a server.
		 */
		var url = "http://kirjava.arrowsoft.de/waketube/";
		var request = new Ajax.Request(url, {
			method: 'get',
			onSuccess: this.request1Success.bind(this),
			onFailure: this.request1Failure.bind(this)
		});
	} else {
		//var url = "http://www.youtube.com/results?nomobile=1&search_query=" + keywords;
		//var url = "http://m.youtube.com/results?q=" + keywords;
		var url = "http://kirjava.arrowsoft.de/waketube/?q="  + keywords;
		var request = new Ajax.Request(url, {
			method: 'get',
			onSuccess: this.request1Success.bind(this),
			onFailure: this.request1Failure.bind(this)
		});
	}
}

MainAssistant.prototype.request1Success = function(response) {
	urls = response.responseText.split("href=\"/watch?v=");
	for(i=0; i<urls.length; i++) {
		urls[i] = urls[i].split("\"")[0];
	}
	
	var vnumber = 1 + parseInt( Math.random() * ( urls.length-1 ) )

	var url = urls[vnumber].split("&")[0];

	//this.controller.get('debug').innerHTML = vnumber + " : " + urls.length + "<br>" + url + "<br>" + urls[vnumber];

	this.controller.serviceRequest('palm://com.palm.applicationManager', {
		method: 'launch',
		parameters: {
			id: "com.palm.app.youtube",
			params: {
				"direct": true,
				"target": "http://youtube.com/watch?v=" + urls[vnumber]
			}
		}
	});
}

MainAssistant.prototype.request1Failure = function(response) {
	Mojo.Controller.errorDialog("Error1");
}

MainAssistant.prototype.activate = function(event) {
	//Mojo.Log.error("### ACTIVATED #######################");
}

MainAssistant.prototype.deactivate = function(event) {

}

MainAssistant.prototype.cleanup = function(event) {
	this.setAndSave();
}

MainAssistant.prototype.handleCommand = function(event){
    if(event.type == Mojo.Event.command) {	
		switch (event.command) {
			case 'about':
				this.setAndSave();
				Mojo.Controller.getAppController().getStageController('main').pushScene("about");
				break;
			case 'tutorial':
				this.setAndSave();
				Mojo.Controller.getAppController().getStageController('main').pushScene("tutorial");
				break;
			case 'preferences':
				this.setAndSave();
				Mojo.Controller.getAppController().getStageController('main').pushScene("preferences");
				break;
		}
	}
}
