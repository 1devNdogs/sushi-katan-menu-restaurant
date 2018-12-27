jQuery(document).ready(function ($) {
  //open/close lateral filter
  $(".cd-filter-trigger").on("click", function () {
    triggerFilter(true);
  });
  $(".cd-filter .cd-close").on("click", function () {
    triggerFilter(false);
  });

  function triggerFilter($bool) {
    var elementsToTrigger = $([
      $(".cd-filter-trigger"),
      $(".cd-filter"),
      $(".cd-tab-filter"),
      $(".cd-gallery")
    ]);
    elementsToTrigger.each(function () {
      $(this).toggleClass("filter-is-visible", $bool);
    });
  }

  var linkEl = $(".cd-filter-trigger");
  linkEl.click();

  //mobile version - detect click event on filters tab
  var filter_tab_placeholder = $(".cd-tab-filter .placeholder a"),
    filter_tab_placeholder_default_value = "Selecciona",
    filter_tab_placeholder_text = filter_tab_placeholder.text();

  $(".cd-tab-filter li").on("click", function (event) {
    //detect which tab filter item was selected
    var selected_filter = $(event.target).data("type");

    //check if user has clicked the placeholder item
    if ($(event.target).is(filter_tab_placeholder)) {
      filter_tab_placeholder_default_value == filter_tab_placeholder.text() ?
        filter_tab_placeholder.text(filter_tab_placeholder_text) :
        filter_tab_placeholder.text(filter_tab_placeholder_default_value);
      $(".cd-tab-filter").toggleClass("is-open");

      //check if user has clicked a filter already selected
    } else if (filter_tab_placeholder.data("type") == selected_filter) {
      filter_tab_placeholder.text($(event.target).text());
      $(".cd-tab-filter").removeClass("is-open");
    } else {
      //close the dropdown and change placeholder text/data-type value
      $(".cd-tab-filter").removeClass("is-open");
      filter_tab_placeholder
        .text($(event.target).text())
        .data("type", selected_filter);
      filter_tab_placeholder_text = $(event.target).text();

      //add class selected to the selected filter item
      $(".cd-tab-filter .selected").removeClass("selected");
      $(event.target).addClass("selected");
    }
  });

  //close filter dropdown inside lateral .cd-filter
  $(".cd-filter-block h4").on("click", function () {
    $(this)
      .toggleClass("closed")
      .siblings(".cd-filter-content")
      .slideToggle(300);
  });

  //fix lateral filter and gallery on scrolling
  $(window).on("scroll", function () {
    !window.requestAnimationFrame ?
      fixGallery() :
      window.requestAnimationFrame(fixGallery);
  });

  function fixGallery() {
    var offsetTop = $(".cd-main-content").offset().top,
      scrollTop = $(window).scrollTop();
    scrollTop >= offsetTop ?
      $(".cd-main-content").addClass("is-fixed") :
      $(".cd-main-content").removeClass("is-fixed");
  }

  /************************************
  MitItUp filter settings
  More details: 
  https://mixitup.kunkalabs.com/
  or:
  http://codepen.io/patrickkunka/
*************************************/

  buttonFilter.init();
  $(".cd-gallery ul").mixItUp({
    controls: {
      enable: false
    },
    callbacks: {
      onMixStart: function () {
        $(".cd-fail-message").fadeOut(200);
      },
      onMixFail: function () {
        $(".cd-fail-message").fadeIn(200);
      }
    }
  });

  //search filtering
  //credits http://codepen.io/edprats/pen/pzAdg
  var inputText;
  var $matching = $();

  var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  $(".cd-filter-content input[type='search']").keyup(function () {
    // Delay function invoked to make sure user stopped typing
    delay(function () {
      inputText = $(".cd-filter-content input[type='search']")
        .val()
        .toLowerCase();
      // Check to see if input field is empty
      if (inputText.length > 0) {
        $(".mix").each(function () {
          var $this = $(this);
          // get all words in inputText
          var res = inputText.replace(/ +(?= )/g, "").split(" ");
          for (var i = 0; i < res.length; i++) {
            // add item to be filtered out if input text matches items inside the title
            if (
              res[i].length > 0 &&
              $this
                .attr("class")
                .toLowerCase()
                .includes(" " + res[i].trim() + " ")
            ) {
              $matching = $matching.add(this);
            } else {
              // removes any previously matched item
              $matching = $matching.not(this);
            }
          }
        });
        $(".cd-gallery ul").mixItUp("filter", $matching);
      } else {
        // resets the filter to show all item if input is empty
        $(".cd-gallery ul").mixItUp("filter", "all");
      }
    }, 200);
  });
});

/*****************************************************
MixItUp - Define a single object literal 
to contain all filter custom functionality
*****************************************************/
var buttonFilter = {
  // Declare any variables we will need as properties of the object
  $filters: null,
  groups: [],
  outputArray: [],
  outputString: "",

  // The "init" method will run on document ready and cache any jQuery objects we will need.
  init: function () {
    var self = this; // As a best practice, in each method we will asign "this" to the variable "self" so that it remains scope-agnostic. We will use it to refer to the parent "buttonFilter" object so that we can share methods and properties between all parts of the object.

    self.$filters = $(".cd-main-content");
    self.$container = $(".cd-gallery ul");

    self.$filters.find(".cd-filters").each(function () {
      var $this = $(this);

      self.groups.push({
        $inputs: $this.find(".filter"),
        active: "",
        tracker: false
      });
    });

    self.bindHandlers();
  },

  // The "bindHandlers" method will listen for whenever a button is clicked.
  bindHandlers: function () {
    var self = this;

    self.$filters.on("click", "a", function (e) {
      self.parseFilters();
    });
    self.$filters.on("change", function (e) {
      console.log(e)

      if (e.originalEvent.target) {
        console.log(e.originalEvent)
        if (e.originalEvent.target.placeholder === "Ej: Palta salmon queso crema...") {
          return
        } else {
          self.parseFilters();
        }
      } else {
        console.log("else")
        self.parseFilters();
      }

    });
  },

  parseFilters: function () {
    var self = this;

    // loop through each filter group and grap the active filter from each one.
    for (var i = 0, group;
      (group = self.groups[i]); i++) {
      group.active = [];
      group.$inputs.each(function () {
        var $this = $(this);
        if (
          $this.is('input[type="checkbox"]')
        ) {
          if ($this.is(":checked")) {
            group.active.push($this.attr("data-filter"));
          }
        } else if ($this.is("select")) {
          group.active.push($this.val());
        } else if ($this.find(".selected").length > 0) {
          group.active.push($this.attr("data-filter"));
        }
      });
    }
    self.concatenate();
  },

  concatenate: function () {
    var self = this;

    self.outputString = ""; // Reset output string

    for (var i = 0, group;
      (group = self.groups[i]); i++) {
      self.outputString += group.active;
    }

    // If the output string is empty, show all rather than none:
    !self.outputString.length && (self.outputString = "all");

    // Send the output string to MixItUp via the 'filter' method:
    if (self.$container.mixItUp("isLoaded")) {
      self.$container.mixItUp("filter", self.outputString);
    }
  }
};

function mobilecheck() {
  var check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

function copyToClipboard(element) {
  if (mobilecheck()) {
    document.location.href = "tel:225511374";
  } else {
    var temp = jQuery("<input>");
    jQuery("body").append(temp);
    temp.val("+569123123123").select();
    document.execCommand("copy");
    temp.remove();
    alert("Copiado al portapapeles.");
  }
}