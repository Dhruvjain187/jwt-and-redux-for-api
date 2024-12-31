const express = require("express")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
const userRoute = require("./route/userRoute")
const dotenv = require("dotenv");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use("/api/users", userRoute)

app.get("/", (req, res) => {
    res.send("server is ready")
})

app.use(notFound);
app.use(errorHandler)

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("done")
}

app.listen(port, () => {
    console.log(`listening at port ${port}`)
})