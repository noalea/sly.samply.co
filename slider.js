var slider = (function () {

  var lefts = [];

  function boxes() {
    var boxes, boxItems;
    boxes = document.querySelectorAll('.box');
    boxItems = [].slice.call(boxes);
    return boxItems;
  };

  function numberSlidePressed(e) {
    var theActive, id, nums, num, b, width, translate, space, minus, condition;
    condition = e.keyCode == 37 || e == 'arrow-left' || e == 'swipe-right' ||
                e.keyCode == 39 || e == 'arrow-right' || e == 'swipe-left' ||
                e.srcElement == undefined || e.srcElement.id != '';
    if (condition) {
      if (e.keyCode == 37 || e == 'arrow-left' || e == 'swipe-right') {
        theActive = document.querySelector('.active');
        id = theActive.id;
        nums = id.split('_');
        num = nums[1];
        if (num != 1) {
          num -= 1;
          activeSlide('slide_' + num);
        }
      } else if (e.keyCode == 39 || e == 'arrow-right' || e == 'swipe-left') {
        theActive = document.querySelector('.active');
        id = theActive.id;
        nums = id.split('_');
        num = nums[1];
        b = boxes();
        if (num != b.length) {
          num = parseFloat(num) + 1;
          activeSlide('slide_' + num);
        }
      } else if (e.srcElement == undefined) { // window size change
        id = e;
        nums = e.split('_');
        num = nums[1];
        activeSlide(e);
      } else if (e.srcElement.id != '') { // number slide pressed
        id = e.srcElement.id.split('_');
        num = id[1];
        activeSlide(e.srcElement.id);
      }

      width = document.querySelectorAll('.box')[0].clientWidth;
      if (num == 1) {
        $('#arrow-left').addClass('invisible');
        $('#arrow-right').removeClass('invisible');
        translate = 'translateX(0px)';
        document.querySelector('.slider').style.transform = translate;
      } else {
        if (num == 6) {
          $('#arrow-right').addClass('invisible');
        } else {
          $('#arrow-right').removeClass('invisible');
        }
        $('#arrow-left').removeClass('invisible');
        space = ((window.innerWidth / 2) + (width / 3) - width);
        minus = (space + (width / 6)); // - (space + quarter of box width)

        translate = 'translateX(-' + (lefts[num - 1] - minus) + 'px)';
        // document.querySelector('.slider').style.transform = translate;
        $('.slider').css({
          '-webkit-transform' : translate,
          '-moz-transform'    : translate,
          '-ms-transform'     : translate,
          '-o-transform'      : translate,
          'transform'         : translate
        });
      }
    }
  };

  function setupBoxes() {
    var boxItems, width, px, translate, active, i, currBox, w;
    boxItems = boxes();
    w = $('#' + boxItems[0].id).attr('class');
    if (~w.indexOf('expand')) {
      width = document.querySelectorAll('.box')[1].clientWidth;
    } else {
      width = document.querySelectorAll('.box')[0].clientWidth;
    }
    px = (window.innerWidth / 2) - (width / 2);
    translate;
    active = document.querySelector('.active');
    lefts = [];
    for (i = 0; i < boxItems.length; i++) {

      translate = px + 'px';
      document.getElementById(boxItems[i].id).style.left = translate;
      lefts.push(px);
      if (window.innerWidth > 480) {
        px += (window.innerWidth / 2) + (width / 3);
      } else {
        px += (window.innerWidth / 2) + (width);
      }

      currBox = $('#' + boxItems[i].id).attr('class');
      if (~currBox.indexOf('expand')) {
        left = lefts[i] - ((window.innerWidth - width) / 2);
        id = '#' + boxItems[i].id;
        $(id).css('left', left);
      }
    }
    numberSlidePressed(active.id);
  };

  function setupEventListeners() {
    var slideNums, slideNumItems, arrowLeft, arrowRight;
    window.addEventListener('resize', setupBoxes);
    slideNums = document.querySelectorAll('.slide');
    slideNumItems = [].slice.call(slideNums);
    slideNumItems.forEach(function (item, idx) {
        item.addEventListener('click', numberSlidePressed);
    });
    arrowLeft = document.getElementById('arrow-left');
    arrowLeft.addEventListener('click', function () {
      numberSlidePressed('arrow-left');
    });
    arrowRight = document.getElementById('arrow-right');
    arrowRight.addEventListener('click', function () {
      numberSlidePressed('arrow-right');
    });
    document.addEventListener('keydown', numberSlidePressed);
    $(".box").swipe({
      //Generic swipe handler for all directions
      swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
        if (direction == 'left' || direction == 'right') {
          numberSlidePressed('swipe-' + direction);
        }
      }
    });
    $('.main-image').click(expandBox);
    $('.close').click(shrinkBox);
    $('.menu-toggle').click(function () {
      $('.close').toggleClass('invisible');
      $('.menu').toggleClass('menu-show');
      $('.line-one').toggleClass('line-one_transform');
      $('.line-two').toggleClass('line-two_transform');
      $('.line-three').toggleClass('none');
    });
  };

  function expandBox(e) {
    var width, num, left, l, id;
    width = document.querySelectorAll('.box')[0].clientWidth;
    $('#' + e.target.parentNode.id).addClass('expand');
    num = e.target.parentNode.id.split('_');
    num = num[1];
    l = getLeftPosition(num - 1);
    left = l - ((window.innerWidth - width) / 2);
    id = '#' + e.target.parentNode.id;
    $(id).css('left', left);
    $('.arrow').addClass('behind');
    $('.slide-numbers').addClass('behind');
    $('.' + e.target.id).css('pointerEvents', 'none');
    $('.close').addClass('close-show');
  };

  function shrinkBox(e) {
    var id, num, left, box, boxItems;
    $('.box').scrollTop(0);
    setupBoxes();
    boxItems = boxes();
    for (var i = 0; i < boxItems.length; i++) {
      box = $('#' + boxItems[i].id).attr('class');
      if (~box.indexOf('expand')) {
        num = i + 1;
      }
    }
    id = '#box_' + num;
    $(id).removeClass('expand');
    left = lefts[num-1];
    $(id).css('left', left);
    $('.arrow').removeClass('behind');
    $('.slide-numbers').removeClass('behind');
    $('.close').removeClass('close-show');
    $('.' + $(id).find('#main-image')[0].id).css('pointerEvents', 'auto');
  };

  function getLeftPosition(i) {
    var theBoxes, left;
    theBoxes = boxes();
    left = document.getElementById(theBoxes[i].id).offsetLeft;
    return left;
  };

  function activeSlide(slideID) {
    var slideNums, slideNumItems, i;
    slideNums = document.querySelectorAll('.slide');
    slideNumItems = [].slice.call(slideNums);
    for (i = 0; i < slideNumItems.length; i++) {
      if (slideID === slideNumItems[i].id) {
        document.getElementById(slideNumItems[i].id).classList.add('active');
      } else {
        document.getElementById(slideNumItems[i].id).classList.remove('active');
      }
    }
  };

  return {
    init: function() {
      console.log("App has started.");
      setupBoxes();
      setupEventListeners();
    }
  };

})();

slider.init();
