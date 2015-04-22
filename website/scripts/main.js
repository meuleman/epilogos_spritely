var data;
var chart;
var options = {
  width: 66, height: 66,
  redFrom: 90, redTo: 100,
  yellowFrom:75, yellowTo: 90,
  greenFrom:0, greenTo: 20,
  minorTicks: 5
};
var dynspeed=false;
    
var bin_size = 100; 
var json_data = ''; 
var update_fq = 500; //ms
var imgwidth = 30240;
var speed_bin;
var cursor_position;

var json_state_info = '{' +
  '"0":{"nam":"","col":"#000000"},' +
  '"1":{"nam":"Active TSS","col":"#ff0000"},' +
  '"2":{"nam":"Flanking Active TSS","col":"#ff4500"},' +
  '"3":{"nam":"Transcr at gene 5\' and 3\'","col":"#32cd32"},' +
  '"4":{"nam":"Strong transcription","col":"#008000"},' +
  '"5":{"nam":"Weak transcription","col":"#006400"},' +
  '"6":{"nam":"Genic enhancers","col":"#c2e105"},' +
  '"7":{"nam":"Enhancers","col":"#ffff00"},' +
  '"8":{"nam":"ZNF genes & repeats","col":"#66cdaa"},' +
  '"9":{"nam":"Heterochromatin","col":"#8a91d0"},' +
  '"10":{"nam":"Bivalent/Poised TSS","col":"#cd5c5c"},' +
  '"11":{"nam":"Flanking Bivalent TSS/Enh","col":"#e9967a"},' +
  '"12":{"nam":"Bivalent Enhancer","col":"#bdb76b"},' +
  '"13":{"nam":"Repressed PolyComb","col":"#808080"},' +
  '"14":{"nam":"Weak Repressed PolyComb","col":"#c0c0c0"},' +
  '"15":{"nam":"Quiescent/Low","col":"#ffffff"}' +
'}';
var state_info = JSON.parse(json_state_info);

(function($) {

  window.app = {

    init: function() {
      this.is_ipad = navigator.userAgent.indexOf('iPad') > -1;
      this.is_iphone = navigator.userAgent.indexOf('iPhone') > -1;
      return true;
    },

    spritely: {
      init: function() {
        if ($('#epilogos').length){
          $('#epilogos').pan({fps: 30, speed: 10, dir: 'left', depth: 30});
          $('#epilogos').spRelSpeed(10);
        }

        $('#playpause').click(function() { 
          $('#epilogos').spToggle();
        });

        //$('#epilogos_logo').click(function() { 
        //  $('#epilogos').spToggle();
        //});

        //$('html').flyToTap();
        if (!window.app.is_ipad && document.location.hash.indexOf('iphone') > -1 ) {
          // iPhone/iPad
          $('body').addClass('platform-iphone');
          if (document.location.hash.indexOf('iphone') > -1) {
            $('body').addClass('platform-iphone');
          }
        }
        if (window.app.is_ipad) {
          $('#dragMe, .ui-slider-handle').hide();
          $('#noFlash').css({
            'top': '185px',
            'right': '20px'
          });
          $('#sprite_up').css({
            'top': '300px',
            'left': '30px'
          });
          $('#container, .stage').css({
            'min-width': '768px'
          });
        } else {
          if (window.app.is_iphone|| document.location.hash.indexOf('iphone') > -1) {
            $('#container, .stage').css({
              'min-width': '300px'
            });
          } else {
            $('#container, .stage').css({
              'min-width': '900px'
            });
          }

          var $slider = $('#slider');
          $slider
            .show()
            .slider({
              value: 10,
              min: -100,
              max: 100,
              slide: function() {
                window.app.spritely.sliderChange($slider.slider('value'));
              },
              change: function() {
                window.app.spritely.sliderChange($slider.slider('value'));
              }
            });
        }
      },

      sliderChange: function(val) {
        dynspeed=false;

        if ($('#dragMe').css('display') == 'block') {
          if (!$.browser.msie) {
            $('#dragMe').fadeOut('slow');
          } else {
            $('#dragMe').hide();
          }
        }

        var sliderSpeed = val;
        if (sliderSpeed < 0) {
          //var sliderSpeed = String(sliderSpeed).split('-')[1];
          var sliderSpeed = Math.abs(sliderSpeed);
          $('#epilogos').spChangeDir('right');
        } else {
          $('#epilogos').spChangeDir('left');
        }
        $('#epilogos').spRelSpeed(sliderSpeed);
      },

    }, // end spritely

    menu: {
      init: function() {
        $('#contentdiv').load('home.html');

        $('#nav-home').click(function() { 
          $('#contentdiv').load('home.html');
          $('#nav-home').addClass('active');
          $('#nav-examples').removeClass('active');
          $('#nav-movies').removeClass('active');
          $('#nav-browser').removeClass('active');
          $('#nav-method').removeClass('active');
          $('#nav-applications').removeClass('active');
          $('#nav-credits').removeClass('active');
        });
        $('#nav-examples').click(function() { 
          $('#contentdiv').load('examples.html');
          $('#nav-home').removeClass('active');
          $('#nav-examples').addClass('active');
          $('#nav-movies').removeClass('active');
          $('#nav-browser').removeClass('active');
          $('#nav-method').removeClass('active');
          $('#nav-applications').removeClass('active');
          $('#nav-credits').removeClass('active');
        });
        $('#nav-movies').click(function() { 
          $('#contentdiv').load('movies.html');
          $('#nav-home').removeClass('active');
          $('#nav-examples').removeClass('active');
          $('#nav-movies').addClass('active');
          $('#nav-browser').removeClass('active');
          $('#nav-method').removeClass('active');
          $('#nav-applications').removeClass('active');
          $('#nav-credits').removeClass('active');
        });
        $('#nav-browser').click(function() { 
          $('#contentdiv').load('browser.html');
          $('#nav-home').removeClass('active');
          $('#nav-examples').removeClass('active');
          $('#nav-movies').removeClass('active');
          $('#nav-browser').addClass('active');
          $('#nav-method').removeClass('active');
          $('#nav-applications').removeClass('active');
          $('#nav-credits').removeClass('active');
        });
        $('#nav-credits').click(function() { 
          $('#contentdiv').load('credits.html');
          $('#nav-home').removeClass('active');
          $('#nav-examples').removeClass('active');
          $('#nav-movies').removeClass('active');
          $('#nav-browser').removeClass('active');
          $('#nav-method').removeClass('active');
          $('#nav-applications').removeClass('active');
          $('#nav-credits').addClass('active');
        });

      },

    },

    gauge: {
      init: function() {
        //read json
        $.getJSON("images/plot_KL_00000000002.json").done(window.app.gauge.onSuccess).fail(window.app.gauge.onError); 

        google.setOnLoadCallback(window.app.gauge.drawChart);
     
        $('#gauge').click(function() { 
          dynspeed=!dynspeed; // toggle dynamic speed change

          if ($('#clickMe').css('display') == 'block') {
            if (!$.browser.msie) {
              $('#clickMe').fadeOut('slow');
            } else {
              $('#clickMe').hide();
            }
          }
        });

        setInterval(window.app.gauge.checkSpeed, update_fq);
      },
 
      onSuccess: function(json) {
        json_data = json;
      },
   
      onError: function(error){
        //alert("ERROR"+error.status);
        console.log("ERROR " + error.status);
      },

      checkSpeed: function() { 
        // get the current positon
        cursor_pos_raw = -parseFloat($._spritely.getBgX($('#epilogos')).replace('px','')); 
        cursor_position = imgwidth + cursor_pos_raw;

        if ($('#slider').slider('value') > 0) {
          cursor_position = cursor_position + (bin_size/2);
        } else {
          cursor_position = cursor_position - (bin_size/2);
        }

        //cursor_position = (cursor_position + ($('#epilogos').width())/2) % (imgwidth - (imgwidth % bin_size));
        cursor_position = (cursor_position + (($('#epilogos').width())/2)) % imgwidth;
              
        //find the right bin in the json
        speed_bin = (cursor_position - (cursor_position % bin_size));

        //debug messages in the console
        console.log('raw cursor: ' + cursor_pos_raw + 
                    ', cursor: ' + cursor_position + ', bin: ' + speed_bin + 
                    ', speed: ', json_data[speed_bin]["speed"] + 
                    ', state: ', json_data[speed_bin]["state"]);

        window.app.gauge.showStateLabel();

        if (dynspeed) {
          window.app.gauge.changeSpeed()
        } else {
          var sliderSpeed = Math.abs($('#slider').slider('value'));
          $('#epilogos').spRelSpeed(sliderSpeed);
          data.setValue(0, 1, sliderSpeed);
          chart.draw(data, options);
        }
      },
  
      changeSpeed: function() { 
        //set the speed
        $('#epilogos').spRelSpeed(json_data[speed_bin]["speed"])

        data.setValue(0, 1, json_data[speed_bin]["speed"]);
        chart.draw(data, options);
      },
             
      showStateLabel: function() { 
        //set the speed
        var state = json_data[speed_bin]["state"];
        $('#epilogos_label span').text(state_info[json_data[speed_bin]["state"]]["nam"]);
        $('#epilogos_label span').css({'color':state_info[json_data[speed_bin]["state"]]["col"]});
      },
             
      drawChart: function() {
        data = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ['speed', 0]
        ]);
      
        chart = new google.visualization.Gauge(document.getElementById('gauge'));
        //google.visualization.events.addListener(chart, 'click', selectHandler);
      
        data.setValue(0, 1, Math.abs($('#slider').slider('value')));
        chart.draw(data, options);
      },
    },

  }; // end window.app()


  $(document).ready(function() {
    window.app.init();
    window.app.menu.init();
    window.app.spritely.init();
    window.app.gauge.init();
  });

})(jQuery);


