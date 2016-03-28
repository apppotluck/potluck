var nodemailer = require('nodemailer'),
    Q = require('q');


module.exports = (function() {
    return {
        send: function(to, subject,text,html) {
        	var defered = Q.defer();
            var from = 'puneetsiet@gmail.com';
            // create reusable transporter object using the default SMTP transport
            var transporter = nodemailer.createTransport('smtps://puneetsiet@gmail.com:P@ssword123456@smtp.gmail.com');
            var mailOptions = {
                from: '"Potluck" <potluck@gmail.com>', // sender address
                to: to, // list of receivers
                subject: subject, // Subject line
                text: text, // plaintext body
                html: html // html body
            };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                	defered.reject(error);
                } else {
                defered.resolve('Message sent: ' + info.response)
                }
            });
            return defered.promise;
        }
    }
})();