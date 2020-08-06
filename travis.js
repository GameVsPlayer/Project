const {
    exec
} = require("child_process");
const path = require("path");

exec("tsc", {
    cwd: path.join(__dirname + "bot")
}, function (err, stdout, stdin) {
    if (err) throw new Error(err);
    console.log(stdout);
});


exec("npm run test", {
    cwd: path.join(__dirname + "bot")
}, function (err, stdout, stdin) {
    if (err) throw new Error(err);
    console.log(stdout);
});


exec("tsc", {
    cwd: path.join(__dirname + "backend")
}, function (err, stdout, stdin) {
    if (err) throw new Error(err);
    console.log(stdout);
});

exec("tsc", {
    cwd: path.join(__dirname + "backend")
}, function (err, stdout, stdin) {
    if (err) throw new Error(err);
    console.log(stdout);
});