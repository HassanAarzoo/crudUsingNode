const bodyParser = require('body-parser')
const fs = require('fs');
const express = require("express");
const app = express();


function validateJson(data) {
    if (!(data['address'] && data['address'].trim())) {
        return 'Address data should be filled in'
    }

    if(!(data['username'] && data['username'].trim())) {
        return 'Username should be filled in'
    }

    if(!(data['password'] && data['password'].trim())) {
        return 'Password should be filled in'
    }

    if (!(data.hasOwnProperty('port') && Number.isInteger(data['port']))) {
        return "Input a valid port number"
    }

    return true
}

app.use(function (req, res, next) {
  if (req.headers.authorization){
    var username_password_combo = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString().split(':');
  } else {
    return res.status(401).send('User Authentication not present')
  }

  if (username_password_combo[0] === 'admin' && username_password_combo[1] === 'admin'){
    next()
  } else {
    return res.status(401).send('User not Authenticated')
  }

});


app.post('/create', bodyParser.json(), (req, res, next) => {
        let validate_data = validateJson(req.body);
        if (validate_data !== true){
            return res.status(422).send(validate_data);
         };

        if (fs.existsSync('config_file.json')){
            return res.status(400).send("Please delete the existing file to create a new file");
        }

        fs.writeFile('./config_file.json', JSON.stringify(req.body), (err) => {
            if (!err) {
                console.log('Config json file generated successfully');
            } else {
                return res.status(409).send(err);
            }
        });

         res.status(201).send("Config json file generated successfully");
});

app.get('/read', (req, res, next) => {
    fs.readFile('config_file.json', (err, data) => {
        if (err) {
           if (err.code === 'ENOENT'){
                return res.status(409).send('File not Found. Please create a configuration file first');
           };
            return res.status(409).send(err);
        };
        res.status(200).send(JSON.parse(data));
    });
});

app.post('/update', (req, res, next) => {
    fs.readFile('config_file.json', 'utf8', (err, data) => {
      if (err) {
           if (err.code === 'ENOENT'){
                return res.status(409).send('File not Found. Please create a configuration file first');
           };
            return res.status(409).send(err);
      };

      var obj = JSON.parse(data);
      var to_be_updated = req.body;

      for (key in to_be_updated){
        obj[key] = to_be_updated[key];
      }
       var validate_data = validateJson(obj);

        if (validate_data !== true){
            return res.status(422).send(validate_data);
        };

        fs.writeFile('config_file.json', JSON.stringify(obj), (err) => {
             console.log(err || 'Update config file successfully');
             if (err){
                return res.status(409).send(err);
             }

          });
        res.status(200).send("Updated Config file");
    });

});

app.post('/delete', bodyParser.json(), (req, res, next) => {
    if (!fs.existsSync('config_file.json')) {
        return res.status(403).send("File does not exist");
    }

    fs.unlinkSync('config_file.json')
    res.status(200).send("File deleted successfully");
});


app.listen(3000, () =>{
    console.log("Server running on 3000");
});