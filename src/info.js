function elementLoaded(el, cb) {
    if ($(el).length) {
      // Element is now loaded.
      cb($(el));
    } else {
      // Repeat every 500ms.
      setTimeout(function() {
        elementLoaded(el, cb)
      }, 500);
    }
  };

  elementLoaded('#info-a', function(el) {
    // Element is ready to use.
    $("#info-a").addClass("active");
  });
