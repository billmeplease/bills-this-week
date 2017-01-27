document.addEventListener("DOMContentLoaded",function(){
	var gl = navigator.geolocation;
  if (gl) {
		gl.getCurrentPosition(function (position) {
      console.log(position)
    })
  }
})
