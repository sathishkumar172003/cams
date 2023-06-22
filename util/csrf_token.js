const { doubleCsrf } = require("csrf-csrf");


const doubleCsrfUtilities = doubleCsrf({
    getSecret: () => "Secret",
  });

module.exports = doubleCsrfUtilities;
