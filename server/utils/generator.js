/**
 * Created by Tundaey on 4/22/2016.
 */
module.exports = function(){
    var code = Math.round((Math.random()* 9000) + 1000);
    var hospital_number = 'HN' + '/'  + code;
    return hospital_number;
}