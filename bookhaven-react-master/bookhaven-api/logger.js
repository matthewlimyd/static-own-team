const { createLogger, transports, format} = require('winston');


const logPayment = createLogger({
    transports:[
        new transports.File({
            filename: 'payment.log',
            level: 'info',
            format: format.combine(format.timestamp(), format.json())
        }),
    ]
})




module.exports = logPayment;