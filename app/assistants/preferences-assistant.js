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

function PreferencesAssistant() {

}

PreferencesAssistant.prototype.setup = function() {
	var cookie2 = new Mojo.Model.Cookie("WTDonate");
	var Prefs2 = cookie2.get();
	if(Prefs2 != null)
	{
		this.donate = Prefs2.donate;
	} else {
		this.donate = true;
	}

	this.appMenuModel = {
		visible: true,
		items: []
	};

	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
	
	tdattr = {trueLabel: 'yes', falseLabel: 'no'};
	tdModel = {value: this.donate, disabled: false};
	
	this.controller.setupWidget('donatetoggle', tdattr, tdModel);
	Mojo.Event.listen(this.controller.get('donatetoggle'),Mojo.Event.propertyChange,this.togglePressed.bind(this));
}

PreferencesAssistant.prototype.togglePressed = function(event) {
	var cookie2 = new Mojo.Model.Cookie("WTDonate");
	cookie2.put({
		donate: tdModel.value,
	});
}

PreferencesAssistant.prototype.activate = function(event) {

}

PreferencesAssistant.prototype.deactivate = function(event) {

}

PreferencesAssistant.prototype.cleanup = function(event) {

}
