var bar1 = new ProgressBar.Circle(category_percentage, {
    color: ' #087e8e ',
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 4,
    trailWidth: 1,
    easing: 'easeInOut',
    duration: 1400,
    text: {
      autoStyleContainer: true
    },
    from: { color: ' #2edaf2 ', width: 1 },
    to: { color: ' #21a6b9 ', width: 4 },
    // Set default step function for all animate calls
    step: function(state, circle) {
      circle.path.setAttribute('stroke', state.color);
      circle.path.setAttribute('stroke-width', state.width);
  
      var value = Math.round(circle.value() * 100);
      if (value === 0) {
        circle.setText('');
      } else {
        circle.setText(value);
      }
  
    }
  }); 
bar1.text.style.fontSize = '2rem';

var bar2 = new ProgressBar.Circle(pose_percentage, {
  color: ' #087e8e ',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: true
  },
  from: { color: ' #2edaf2 ', width: 1 },
  to: { color: ' #21a6b9 ', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value2 = Math.round(circle.value() * 100);
    if (value2 === 0) {
      circle.setText('');
    } else {
      circle.setText(value2);
    }

  }
}); 
bar2.text.style.fontSize = '2rem';

var bar3 = new ProgressBar.Circle(color_percentage, {
  color: ' #087e8e ',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: true
  },
  from: { color: ' #2edaf2 ', width: 1 },
  to: { color: '  #21a6b9  ', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value3 = Math.round(circle.value() * 100);
    if (value3 === 0) {
      circle.setText('');
    } else {
      circle.setText(value3);
    }

  }
}); 
bar3.text.style.fontSize = '2rem';

$(document).ready(function () {
    // Init
    $('.image-section').hide();
    $('.loader').hide();

    $('#result_category_label').hide();
    $('#result_pose_label').hide();
    $('#result_color_label').hide();

    $('.category').hide();
    $('.pose').hide();
    $('.color').hide();

    
    
    
    // Upload Preview
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imageUpload").change(function () {
        $('.image-section').show();
        $('#btn-predict').show();
        $('#result_category_label').text('');
        $('.category').hide();
        bar1.animate(0);

        $('#result_pose_label').text('');
        $('.pose').hide();
        bar2.animate(0);

        $('#result_color_label').text('');
        $('.color').hide();
        bar3.animate(0);

        readURL(this);
    });

    // Predict
    $('#btn-predict').click(function () {
        var form_data = new FormData($('#upload-file')[0]);

        // Show loading animation
        $(this).hide();
        $('.loader').show();

        // Make prediction by calling api /predict
        $.ajax({
            type: 'POST',
            url: '/predict',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
                // Get and display the result
                var fields = data.split('-'); 
                var category = fields[0];
                var pose = fields[1] ;
                var color = fields[2] ;

                var category_fields = category.split(',') ;
                var category_label = category_fields[0] ;
                var category_percentage = category_fields[1] ;

                var pose_fields = pose.split(',') ;
                var pose_label = pose_fields[0] ;
                var pose_percentage = pose_fields[1] ; 
                
                var color_fields = color.split(',') ;
                var color_label = color_fields[0] ;
                var color_percentage = color_fields[1] ;

                $('.loader').hide();

                $('.category').show();
                $('.pose').show();
                $('.color').show();

                $('#result_category_label').fadeIn(600);
                $('#result_category_label').text(category_label);

                $('#result_pose_label').fadeIn(600);
                $('#result_pose_label').text(pose_label)

                $('#result_color_label').fadeIn(600);
                $('#result_color_label').text(color_label);
                
                bar1.animate(category_percentage);
                bar2.animate(pose_percentage)
                bar3.animate(color_percentage)
                console.log('Success!');
            },
        });
    });
    

});

var input = 'john smith~123 Street~Apt 4~New York~NY~12345'; 
var fields = input.split('~'); 
var name = fields[0]; 
var street = fields[1]


//bar.animate(0.53);  // Number from 0.0 to 1.0

