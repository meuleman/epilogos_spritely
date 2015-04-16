var bin_size = 30; 
var json_data = ''; 
var update_fq = 200; //ms
  
//read json
$.getJSON("images/plot_KL_00000000002.json").done(onSuccess).fail(onError); 
  
function onSuccess(json) {
  //console.log('OK'+json[0]);
  json_data = json;
}
  
function onError(error){
  //alert("ERROR"+error.status);
  console.log("ERROR " + error.status);
}
  
function changeSpeed() { 
  // get the current positon
  cursor_position = -parseFloat($._spritely.getBgX($('#epilogos')).replace('px','')); 
        
  //find the right bin in the json
  speed_bin = (cursor_position - (cursor_position % bin_size));
        
  //debug messages in the console
  //console.log('current_position: ' + cursor_position);
  //console.log('bin in the json: ' + speed_bin);
  //console.log('speed to set: ' + json_data[speed_bin]);
         
  //set the speed
  $('#epilogos').fps(json_data[speed_bin])
}
       
//main loop that change the speed  
setInterval(changeSpeed, update_fq);
  

