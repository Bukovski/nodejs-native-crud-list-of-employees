const path = require('path');
const fs = require('fs');


const helpers = {};
const publicDir = path.join(__dirname,'/../public/');


// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str) {
  try{
    const obj = JSON.parse(str);
    
    return obj;
  } catch(e){
    return {};
  }
};


helpers.arrayRemove = function (arr, id) {
  return arr.filter(function (worker) {
    return worker.id !== id;
  });
}

helpers.isNumber = function (num) {
  return !isNaN(parseFloat(num)) && isFinite(num);
}

// Get the contents of a static (public) asset
helpers.getStaticAsset = function(fileName, callback) {
  fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;
  if (fileName) {
    fs.readFile(publicDir + fileName, function(err, data) {
      if (!err && data) {
        callback(false, data);
      } else {
        callback('No file could be found');
      }
    });
  } else {
    callback('A valid file name was not specified');
  }
};

module.exports = helpers;
