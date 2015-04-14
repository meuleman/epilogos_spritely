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
          $('#epilogos').pan({fps: 30, speed: 3, dir: 'left', depth: 70});
          $('#epilogos').spRelSpeed(8);
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
              value: 8,
              min: -60,
              max: 60,
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
        if ($('#dragMe').css('display') == 'block') {
          if (!$.browser.msie) {
            $('#dragMe').fadeOut('slow');
          } else {
            $('#dragMe').hide();
          }
        }
        var sliderSpeed = val;
        if (sliderSpeed < 0) {
          var sliderSpeed = String(sliderSpeed).split('-')[1];
          $('#epilogos').spChangeDir('right');
        } else {
          $('#epilogos').spChangeDir('left');
        }
        $('#epilogos').spRelSpeed(sliderSpeed);
      },

    }, // end spritely

    contactForm: {

      init: function() {
        if ($('#contactForm').size() != 0) {
          $('#contactFormContainer').click(function () {
            return false;
          });
          $('#errorContainer').hide();
          $('.jsSubmit').show();
          $('.nojsSubmit').hide();

          $('#contactFormSubmit a').click(function () {
            if (window.app.contactForm.checkForm()) {
              $('#contactForm').submit();
            }
            return false;
          });

          if ($('#contactForm.errorOccurred').size() != 0) {
            window.app.contactForm.error('Please fill in the entire form.');
          } else if ($('#contactForm.captchaError').size() != 0) {
            window.app.contactForm.error('The verification text did not match the image.');
          }
        }
      },

      checkForm: function() {
        if ($('#f_name').val()=='') {
          window.app.contactForm.error('Please enter your name.');
          return false
        } else if ($('#f_email').val()=='') {
          window.app.contactForm.error('Please enter your email address.');
          return false
        } else if ($('#f_message').val()=='') {
          window.app.contactForm.error('Please enter a message.');
          return false
        }

        return true;

      },

      error: function(which) {
        var el = $("#errorContainer");

        if (el.css('display') == 'block') {
          el.fadeTo('fast', 0.1);
          el.fadeTo('fast', 1);
          el.fadeTo('fast', 0.1);
          el.fadeTo('fast', 1);
          el.fadeTo('fast', 0.1);
          el.fadeTo('fast', 1);
        } else {
          $("#errorContainer").html(which).slideDown('slow');
        }
      },

    }, // end contactForm

  }; // end window.app()


  $(document).ready(function() {
    window.app.init();
    window.app.spritely.init();
    window.app.contactForm.init();
  });

})(jQuery);


