const bcrypt = require("bcrypt");

(async () => {
  const password = "admin123"; // change if you want
  const hash = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hash);
})();