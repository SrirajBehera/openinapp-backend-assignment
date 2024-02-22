const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const db = require("./database");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

app.use(express.json());

require("./models/user");
db.model("User");

require("./models/task");
db.model("Task");

require("./models/subtask");
db.model("Subtask");

app.use(require("./routes/user"));
app.use(require("./routes/task"));
app.use(require("./routes/subtask"));

require("./cronjob/updateTaskPriorities");
require("./cronjob/simulateVoiceCalls");

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`The Server is running on port: ${process.env.PORT}`);
});
