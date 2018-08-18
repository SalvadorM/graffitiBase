$(document).ready(function(){
  let errCon = document.querySelectorAll("#errors");
  $.each(errCon, (e,val)=> {
    setTimeout(()=>{
     val.style.opacity = '1';
    }, 100 * (e+1));
  });
});
