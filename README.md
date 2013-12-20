Angular SWFObject
=================

Angular.js binding for SWFObject

Installation
------------
	bower install angular-swfobject --save

Example usage
-------------
Include the script in your HTML page:

	<!-- Include AngularJS and SWFObject -->
	<script src="libs/angular/angular.min.js"></script>
	<script src="libs/swfobject/swfobject.js"></script>
	<script src="libs/angular-swfobject/angular-swfobject.min.js"></script>


Inject the module in your main application module:

	angular.module('YourApp', [ 'angular-swfobject' ]);


Use the directive in your HTML-code:

	<swf-object
		url="path/to/your.swf"
		flashvars="{{flashvars}}"
		params="{{params}}"
		width="300px"
		height="400px"
		callback="onCallback(event)">
	</swf-object>

Supported attributes
--------------------
* url
* width
* height
* express-install
* params
* flashvars
* attributes
* callback
