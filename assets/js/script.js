const audio = new Audio('assets/audio/siren.m4a');

$(document).ready(function(){
    
    setInterval(function() {
        var url = "http://localhost/InfoExam_Back/public/api/"+1;
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'JSON',
            contentType: false,
            cache: false,
            processData: false,
            success:function(response)
            {
                if(response.alertes != null)
                {
                    audio.play();
                    //$('#alerte-modal').modal('show');
                    if (window.confirm("ALERLERLLERR")) {
                        audio.pause();
                    }
                }
                
            },
            error: function(response) {
            }
        });
      }, 10000);

});
