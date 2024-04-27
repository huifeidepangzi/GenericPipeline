$(".lifecycle-collection-form").on("submit", function (e) {
  e.preventDefault()

  // Gets the underlying form element from the jQuery object
  var formData = new FormData($(this)[0]);
  const scanLifecycleInfoURL = 'collect-lifecycle-info/?variable_name=' + formData.get("variable_name");

  $.ajax({
    url: scanLifecycleInfoURL,
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      $(".scan-result-section").html(data.scan_results.join("<br/>"));
    }
  });
})