'use strict';


$(function() {

  // Init ScrollMagic Controller
  var scrollMagicController = new ScrollMagic.Controller({
    globalSceneOptions: {
      triggerHook: 0.08
    }
  });



/////////////////////////////////////////////////////////
//        frame 0
/////////////////////////////////////////////////////////


  var scene_animation00 = new ScrollMagic.Scene({
    triggerElement: '#scene0'
  })
  .setClassToggle("#scene_marker0", "active")
  .addTo(scrollMagicController);

  var scene_animation01 = new ScrollMagic.Scene({
    triggerElement: '#new_videos_header'
  })
  .setClassToggle("#scene_marker01", "active")
  .addTo(scrollMagicController);



  var tl_call_to_action = new TimelineMax();

    var tween_call_to_action = TweenMax.fromTo('#call_to_action', 1, {backgroundPosition: "100% 30%", ease: Linear.easeNone},{backgroundPosition: "100% 100%", ease: Linear.easeNone});


    tl_call_to_action
      .add(tween_call_to_action)
      ;

    var scene_call_to_action = new ScrollMagic.Scene({
      triggerElement: '#scene0',
      duration: '100%'
    })
    // .setPin("#call_to_action")
    .setTween(tl_call_to_action)
    .addTo(scrollMagicController);




/////////////////////////////////////////////////////////
//        frame 1
/////////////////////////////////////////////////////////

    var scene_animation1 = new ScrollMagic.Scene({
      triggerElement: '#scene1'
    })
    .setClassToggle("#scene_marker1", "active")
    .addTo(scrollMagicController);



/////////////////////////////////////////////////////////
//        frame 2
/////////////////////////////////////////////////////////
    var scene_animation1 = new ScrollMagic.Scene({
      triggerElement: '#scene1'
    })
    .setClassToggle("#scene_marker1", "active")
    .addTo(scrollMagicController);


    var scene_animation2 = new ScrollMagic.Scene({
      triggerElement: '#video_solo_cont'
    })
    .setClassToggle("#scene_marker2", "active")
    .addTo(scrollMagicController);

    var scene_animation2 = new ScrollMagic.Scene({
      triggerElement: '#problem_sets_cont'
    })
    .setClassToggle("#scene_marker3", "active")
    .addTo(scrollMagicController);

    var scene_animation2 = new ScrollMagic.Scene({
      triggerElement: '#calc_cont'
    })
    .setClassToggle("#scene_marker4", "active")
    .addTo(scrollMagicController);

    var scene_animation2 = new ScrollMagic.Scene({
      triggerElement: '#cpi_tool_cont'
    })
    .setClassToggle("#scene_marker5", "active")
    .addTo(scrollMagicController);




/////////////////////////////////////////////////////////
//        frame 3
/////////////////////////////////////////////////////////

  var tl_3 = new TimelineMax();

    tl_3

    var scene_animation3 = new ScrollMagic.Scene({
      triggerElement: '#scene3'
    })
    .setTween(tl_3)
    .setClassToggle("#scene_marker6", "active")
    .addTo(scrollMagicController);





/////////////////////////////////////////////////////////
//        anchor link scrolling
/////////////////////////////////////////////////////////

  // build tween
  var tween_anchor = TweenMax.from("#pic0", 0.5, {});

  // build scene
  var scene_anchor = new ScrollMagic.Scene({triggerElement: "a#scene0", duration: 200, triggerHook: "onLeave"})
          .setTween(tween_anchor)
          .addTo(scrollMagicController);

  // change behaviour of controller to animate scroll instead of jump
  scrollMagicController.scrollTo(function (new_position) {
    TweenMax.to(window, 0.5, {scrollTo: {y: new_position - 45}});
  });

  //  bind scroll to anchor links
  $(document).on("click", "a[href^='#']", function (e) {
    var id = $(this).attr("href");

    if ($(id).length > 0) {

      e.preventDefault();

      // trigger scroll
      scrollMagicController.scrollTo(id);

        // if supported by the browser we can even update the URL.
      if (window.history && window.history.pushState) {
        history.pushState("", document.title, id);
      }
    }
  });





  // // Add target & scene (begin/end) indicators
  // scene_animation0.addIndicators();
  // scene_animation00.addIndicators();
  // scene_animation1.addIndicators();
  // scene_animation2.addIndicators();
  // scene_animation3.addIndicators();
  // scene_call_to_action.addIndicators();

});






































