// Header Sticky
function stickyFunction() {
	var header = document.getElementById("site-header");
	var sticky = header.offsetHeight;
	if (window.pageYOffset > 0) {
		header.classList.add("fixed");
	} else {
		header.classList.remove("fixed");
	}
}

// LeftNav Sticky
window.onscroll = function() {
	var scrollposition = $(window).scrollTop();
	var headerheight = $('.header').outerHeight();
	if(scrollposition > 0 && scrollposition < $('.site-footer').offset().top - $('.leftnav-listing').outerHeight() - headerheight){
		$('.leftnav-listing').addClass('leftnav-fixed')
	}else{
		$('.leftnav-listing').removeClass('leftnav-fixed')
	}
	stickyFunction();
	onScrollHighlighted();
};

// LeftNav onscroll Highlight
function onScrollHighlighted() {
   var leftNavHeight = 0;
   var scrollHeight = $(document).height();
   var scrollPosition = $(window).height() + $(window).scrollTop();
   var contentnavArray = [] ;
   var scrollPos = $(document).scrollTop();  
   var header_height = $('.header').outerHeight();

    $('.leftnav-listing li a').each(function () {
        var currLink = $(this);
        var refElement = currLink.attr('href').replace('#', '');
        contentnavArray.push(refElement);
    }); 

   $.each(contentnavArray, function (i, val) {
       var refElement = $('section#' + val);
       var currLink = $('*[href=\'#' + val + '\']');
       var nextrefElement;       
       if (contentnavArray.length > i + 1) {
           nextrefElement = $('section#' + contentnavArray[i + 1]);
       } else {
           nextrefElement = $('footer');
       }
       if (0 !== refElement.length) {
           if (refElement.offset().top - header_height <= scrollPos && nextrefElement.offset().top > scrollPos) {    
               $('.leftnav-listing li').removeClass('is_visiable_section');
               currLink.parents('.leftnav-listing li').addClass('is_visiable_section');
           } else if (0 === (scrollHeight - scrollPosition) / scrollHeight) { 
               currLink.parents('.leftnav-listing li').removeClass('is_visiable_section');
               currLink.parents('.leftnav-listing li').addClass('is_visiable_section');
           } else { 
               currLink.parents('.leftnav-listing li').removeClass('is_visiable_section');
           }
       }
   });
}

// leftnav on click scroll
$(document).on('click', '.leftnav-listing li > a', function(){
	var getattr = ($(this).attr('href')).trim();
	var headmrg = ($('[id="' + getattr.substr(1) + '"]').css('margin-top')).slice(0,-2);
	$('html, body').animate({
		scrollTop: $('[id="' + getattr.substr(1) + '"]').offset().top - /*$('.header').outerHeight()*/ - headmrg
	}, 1000);
});
 

$(document).ready(function(){
	var w_width = $( window ).width();
	
	/*Menu toggle Button*/
	$('.nav-button').click(function() {
		$('body').toggleClass('show_menu');
		$('.nav-wrap ul.top_nav').slideToggle();
	});

	/*Append down-arrow Span*/
	$('ul.top_nav > li:has(ul)').addClass('has-submenu').append('<span class="down-arrow"></span>');
	$('li.has-submenu ul > li:has(ul)').addClass('has-submenu').append('<span class="down-arrow"></span>');

	/*Navigation Menu */

 	/*Multi level*/
    $("ul.top_nav li span.down-arrow").on("click",function(e){  
		if($(this).parents(".has-submenu").hasClass("submenu-active") && (!($(this).parent().hasClass("submenu-active")) ) ){ 
			$(this).parent().siblings().removeClass("submenu-active");
			$(this).parent().addClass("submenu-active");
			$(this).parent().siblings(".has-submenu").children(".sub-nav").slideUp(400);
			$(this).siblings(".sub-nav").slideDown(400); 
		}	
		else if($(this).parents(".has-submenu").hasClass("submenu-active") && $(this).parent().hasClass("submenu-active")){
			$(this).parent().removeClass("submenu-active");
			$(this).siblings(".sub-nav").slideUp(400); 
		} 
		else{
			$(".has-submenu > .title").parent().removeClass("submenu-active");
			$(this).parent().addClass("submenu-active");
			$(".has-submenu > .sub-nav").slideUp(400);
			$(this).siblings(".sub-nav").slideDown(400);
		}
	});
	
	/*First Level*/
	/*$('ul.top_nav li span.down-arrow').click(function(e) {   
	   $(this).parent().siblings().removeClass('submenu-active');
	   $(this).parent().toggleClass('submenu-active');
	   $('.sub-nav').not($(this).siblings() && $(this).parents('.sub-nav')).slideUp();
	   $(this).siblings('.sub-nav').slideToggle();
	   e.stopPropagation();
	});*/

	onScrollHighlighted();

})

$(window).resize( function(){
	var w_width = $( window ).width();
	if(w_width > 919){
		$('.nav-wrap ul.top_nav').show();			
		$('.nav-wrap ul.top_nav ul').removeAttr("style");;			
	}

	onScrollHighlighted();

});

