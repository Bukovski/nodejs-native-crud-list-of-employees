const helpers = {};

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


module.exports = helpers;
