const app = require("./app");

app.listen(process.env.PORT, () =>
  console.log(`Listening at http://localhost:${process.env.PORT}`)
);
