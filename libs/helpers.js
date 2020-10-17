const path = require('path');
const fs = require('fs');


const helpers = {};
const publicDir = path.join(__dirname,'/../public/');
const templatesDir = path.join(__dirname,'/../templates/');


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

// Get the string content of a template, and use provided data for string interpolation
helpers.getTemplate = function(templateName, data, callback) {
  templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
  data = typeof(data) == 'object' && data !== null ? data : {};
  
  if (templateName) {
    fs.readFile(templatesDir + templateName + '.html', 'utf8', function(err, str) {
      if (!err && str && str.length > 0) {
        callback(false, str);
      } else {
        callback('No template could be found');
      }
    });
  } else {
    callback('A valid template name was not specified');
  }
};

module.exports = helpers;
