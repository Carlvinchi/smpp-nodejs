const smpp = require('smpp');
const session = new smpp.Session({host: '172.17.9.38', port: 3010});

let isConnected = false
session.on('connect', () => {
  isConnected = true;

  session.bind_transmitter({
      system_id: 'univisiontech',
      password: 'uni@2022',
      interface_version: 1,
      //system_type: '380666000600',
      //address_range: '+380666000600',
      addr_ton: 1,
      addr_npi: 1,
  }, (pdu) => {
    if (pdu.command_status == 0) {
        console.log('Successfully bound')
    }

  })
})

session.on('close', () => {
  console.log('smpp is now disconnected') 
   
  if (isConnected) {        
    session.connect();    //reconnect again
  }
})

session.on('error', error => { 
  console.log('smpp error', error)   
  isConnected = false;
});


function sendSMS(from, to, text) {
    from = `+${from}`  
    
 // this is very important so make sure you have included + sign before ISD code to send sms
    
    to = `+${to}`
   
   session.submit_sm({
       source_addr:      from,
       destination_addr: to,
       short_message:    text
   }, function(pdu) {
       if (pdu.command_status == 0) {
           // Message successfully sent
           console.log(pdu.message_id);
       }
   });
 }
 