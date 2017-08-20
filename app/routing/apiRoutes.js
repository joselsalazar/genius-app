var friendsList = require("../data/friendsList");


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  app.get("/api/friendsList", function(req, res) {
    res.json(friendsList);
  });

  app.post("/api/friendsList", function(req, res) {
    friendsList.push(req.body);
    res.json(true);
  });

  app.post("/api/clear", function() {
    // Empty out the arrays of data
    friendsList = [];

    console.log(friendsList);
  });
};
