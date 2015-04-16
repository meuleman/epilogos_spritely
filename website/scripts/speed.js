var bin_size = 250; 
var json_data = ''; 
var update_fq = 2000; //ms
  
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
  cursor_position + ($('#epilogos').width)/2
        
  //find the right bin in the json
  fps_bin = (cursor_position - (cursor_position % bin_size));
        
  //debug messages in the console
  //console.log('cursor: ' + cursor_position + ", bin: " + fps_bin + ", fps: ", json_data[fps_bin]);
         
  //set the fps
  //$('#epilogos').spSpeed(json_data[fps_bin]/10)
  $('#epilogos').fps(json_data[fps_bin])
}
       
//main loop that change the fps  
setInterval(changeSpeed, update_fq);
  

