// Progressive enhancement only — every page works fully with this file
// absent or blocked. This just adds a confirm dialog on delete buttons that
// don't already have one inline, as a small UX nicety.
document.addEventListener("DOMContentLoaded", function () {
  var deleteForms = document.querySelectorAll("form[data-confirm]");
  deleteForms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      if (!confirm(form.getAttribute("data-confirm"))) {
        event.preventDefault();
      }
    });
  });
});
