# grunt-init-express-dust-bootstrap-passport

Start a node.js server app with [grunt-init][]

Includes and connects:
- Express
- Dust
- Bootstrap
- Mongoose
- Passport
- Mocha
- ESlint.

[grunt-init]: http://gruntjs.com/project-scaffolding

## Installation
First, be sure you have grunt-init installed [grunt-init][].

Next, clone this repo into your grunt init templates folder using the following command:
```
git clone https://github.com/jkennedy1980/grunt-init-express-dust-bootstrap-passport.git ~/.grunt-init/grunt-init-express-dust-bootstrap-passport
```

_(Windows users, see [the documentation][grunt-init] for the correct destination directory path)_

Then, run the following command in the empty root folder for your project:

```
grunt-init grunt-init-express-dust-bootstrap-passport
```

## Initial Accounts

You will be prompted to configure your server's first admin account (email and password). 
These credentials will be written into a config file (_config/intitial-users.js_). Be sure
to remove this configuration file before deploying your project.

## Setting up SMTP to send email
By default, your app will be configured to use GMAIL as an SMTP relay. In order to use GMAIL, you'll need to get an app password from Google.
 
*App Passwords are available once you have turned on 2-Step-Verification*

To get an app password go to https://myaccount.google.com
- In the 'Signing In' section click the 'App Passwords' link (or first click 2-Step-Verification)
- Click the 'Select App' and choose 'Other'. 
- Enter a memorable name for your app and click 'GENERATE'.
 
Add your App Password and email address to your environment
- Set GMAIL_SMTP_EMAIL to your email address
- Set GMAIL_SMTP_APP_PASSWORD to the password just generated

To use another SMTP provider you'll need to configure an SMTP transport for nodemailer in the 'lib/emailer.js' file. 
