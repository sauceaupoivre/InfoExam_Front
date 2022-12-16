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
                    alert("prout");
                }
                
            },
            error: function(response) {
            }
        });
      }, 60000);

});
