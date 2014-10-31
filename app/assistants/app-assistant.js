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

function AppAssistant() {
}


 PLAY = false;
AppAssistant.prototype.setup = function() {
}

AppAssistant.prototype.handleLaunch = function(launchParams){
   var appController = Mojo.Controller.getAppController();
   var cardStageController = appController.getStageController('main');
   
   if (!launchParams) {
   		//Mojo.Log.error(" ********** NO PARAMS ***********");
		if (cardStageController) {
			//Mojo.Log.error(" ********** ACTIVATE ***********");
			cardStageController.activate();
		}
		else {
			//Mojo.Log.error(" ********** PUSH ***********");
			var pushMainScene = function(stageController){
				stageController.pushScene('main');
			}
			var stageArgs = {
				name: 'main',
        	    lightweight: true
        	};
        	this.controller.createStageWithCallback(stageArgs, pushMainScene.bind(this), 'card');
		}
	} else {
   		//Mojo.Log.error(" ********** PARAMS ***********");
		
	    try {
			if(launchParams.alarmnow != null)
			{
				//Mojo.Log.error(" ********** PLAY ***********");
				PLAY = true;
			}
		} 
		catch (err) {}
		
		if (cardStageController) {
			//Mojo.Log.error(" ********** ACTIVATE ***********");
			cardStageController.activate();
			cardStageController.popScene('main');
			cardStageController.pushScene('main');
		}
		else {
			//Mojo.Log.error(" ********** PUSH ***********");
			var pushMainScene = function(stageController){
				stageController.pushScene('main');
			}
			var stageArgs = {
				name: 'main',
        	    lightweight: true
        	};
        	this.controller.createStageWithCallback(stageArgs, pushMainScene.bind(this), 'card');
		}
	}
}