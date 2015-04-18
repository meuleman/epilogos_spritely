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

        $('#epilogos_logo').click(function() { 
          $('#epilogos').spToggle();
        });

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
 
      checkSpeed: function() { 
        if (dynspeed) {
          window.app.gauge.changeSpeed()
        } else {
          var sliderSpeed = Math.abs($('#slider').slider('value'));
          $('#epilogos').spRelSpeed(sliderSpeed);
          data.setValue(0, 1, sliderSpeed);
          chart.draw(data, options);
        }
      },

      onSuccess: function(json) {
        json_data = json;
      },
   
      onError: function(error){
        //alert("ERROR"+error.status);
        console.log("ERROR " + error.status);
      },
   
      changeSpeed: function() { 
        // get the current positon
        cursor_position = -parseFloat($._spritely.getBgX($('#epilogos')).replace('px','')); 
        if (cursor_position < 0) cursor_position = imgwidth + cursor_position;
        cursor_position = (cursor_position + ($('#epilogos').width())/2) % imgwidth;
              
        //find the right bin in the json
        speed_bin = (cursor_position - (cursor_position % bin_size));
              
        //debug messages in the console
        console.log('cursor: ' + cursor_position + ", bin: " + speed_bin + ", speed: ", json_data[speed_bin]);

        //set the speed
        $('#epilogos').spRelSpeed(json_data[speed_bin])

        data.setValue(0, 1, json_data[speed_bin]);
        chart.draw(data, options);
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


