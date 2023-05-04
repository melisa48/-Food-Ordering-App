// const crypto = require('crypto');
 
// //Only works during the current run. Does not work if you exist and do another npm start. Need to fix 
// const algorithm = 'aes-256-cbc';
 
// const key = crypto.randomBytes(32);
 
// let iv = crypto.randomBytes(16);
 
// function encryptData(text) {
//   let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
//   let encrypted = cipher.update(text);
 
//   encrypted = Buffer.concat([encrypted, cipher.final()]);
 
//   return iv.toString('hex') + ':' + encrypted.toString('hex');
//  }
 
 
// function decryptData(text) {
//   // delete require.cache[require.resolve('./templates/prd')];
//   let textParts = text.split(':');
//   let iv = Buffer.from(textParts.shift(), 'hex');
//   let encryptedText = Buffer.from(textParts.join(':'), 'hex');
//   let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
//   let decrypted = decipher.update(encryptedText);
 
//   decrypted = Buffer.concat([decrypted, decipher.final()]);
 
//   return decrypted.toString();
//  }

// // var salt = crypto.randomBytes(16).toString('hex');


// // function encryptData(text){
  
// // }

// // function decryptData(text){
 
// // }
// var bcrypt = require('bcryptjs');

// var salt = bcrypt.genSaltSync(10);
// function encryptData(text){
//   var hashedpassword = bcrypt.hashSync(text, salt);
//   return hashedpassword;
// }

// function decryptData(text){
//   var 
// }
// module.exports = { encryptData, decryptData };