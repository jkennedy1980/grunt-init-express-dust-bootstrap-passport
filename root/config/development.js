( function(){

	module.exports = {
		anEnviromentSpecificValue: "Hey there development!",
		useMinifiedJs: false,
		renderStackTraces: true,
		email:{
			enabled: true,
			"service": "gmail",
			"debug": true,
			"auth":{
				"user": "jkennedy022@gmail.com",
				"pass": process.env.GMAIL_SMTP_TOKEN
			}
		}
	};

})();