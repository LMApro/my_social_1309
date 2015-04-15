/*var crypto = require('crypto')
  , salt = '123456789_i_love_you'
  , plaintext = 'matn821309'
  , cipher = crypto.createCipher('aes-256-cbc', salt)
  , decipher = crypto.createDecipher('aes-256-cbc', salt);
  
cipher.update(plaintext, 'utf8', 'base64');
var hash = cipher.final('base64');

decipher.update(hash, 'base64', 'utf8');
var decryptedPassword = decipher.final('utf8');
console.log(decryptedPassword);
console.log(hash);
console.log(decipher.update(hash, 'base64', 'utf8').final('utf8'));*/
/*
if (hash === encryptedPassword) {
	console.log("password OK");
} else {
	console.log("invalid pass");
}*/
var crypto = require('crypto');
var salt = crypto.randomBytes(16).toString('hex');
function setPass(pass) {
	return crypto.pbkdf2Sync(pass, salt, 1000, 64).toString('hex');
}
var password = 'matn821309';
var hash1 = setPass(password);
function validPass(pass) {
	return hash1 == crypto.pbkdf2Sync(pass, salt, 1000, 64).toString('hex');
}


// console.log(hash1);
// console.log(validPass('matn821309'));
var hash2 = crypto.pbkdf2Sync('matn821309', '123456789abc123acde45ef', 1000, 64).toString('hex');
console.log(hash2);
 