//slick params
$('.variable-width').slick({
  dots: false,
  infinite: false,
  speed: 450,
  centerMode: false,
  variableWidth: true,
  arrows: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
  accessibility: true
});

$(window).on('resize orientationchange', function() {
$('.js-slider').slick('resize');
});

//make dropdown
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

//make active links
$(function() {
  if (location.pathname !== '/') {
  $('div a[href^="/' + location.pathname.split("/")[1] + '"]').addClass('active');
  }
});

document.getElementById("myCarousel").focus();
