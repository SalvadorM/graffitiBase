$(document).ready(function(){
  let errCon = document.querySelectorAll("#errors");
  $.each(errCon, (e,val)=> {
    setTimeout(()=>{
     val.style.opacity = '1';
    }, 100 * (e+1));
  });


  //handle DELETE request
  $('.delete-btn').on('click', function(e){
    const id = e.target.dataset.id;
      console.log(id)
    $.ajax({
      type:'DELETE',
      url:'/tag/' + id,
      success: function(response){
        window.location.href='/';
      },
    error: function(error){
      console.log(error);
    }
    });
  });

  //show the image
  $('#file').on('change' , function() {
            var image_holder = $("#showImage");
            var reader = new FileReader();
            reader.readAsDataURL($(this)[0].files[0]);
            reader.onloadend = function () {
              image_holder.attr('src', reader.result);
              image_holder.css({'display':'block', 'width' : '250px'});
            }

  });

  //show the edit form
  $('#showEdit').on('click', function(){
    $('#displayEdit').fadeToggle();
  });
});
