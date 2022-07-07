const bcrypt = require('bcrypt');

const pw = "supersecretpassword"

bcrypt.hash(pw, 6, (err, hashedPw) => {
  console.log(`Password: ${pw}`)
  console.log(`Hash: ${hashedPw}`)
})
