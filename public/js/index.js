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
});
