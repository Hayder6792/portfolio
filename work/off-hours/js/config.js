/* ============================================================
   OFF HOURS, site config
   This is the ONE file you edit most. No coding knowledge needed:
   just change the text between the quotes.
   ============================================================ */

window.OFFHOURS_CONFIG = {

  /* Where guest list and RSVP submissions are sent.
     Leave "" to run in DEMO MODE (forms look like they work but save
     nothing, good for testing the look). To go live for real, create a
     FREE Formspree form at https://formspree.io and paste the endpoint
     here, e.g. "https://formspree.io/f/abcdwxyz". See README.md for the
     full guide and the free Google Sheet alternative. */
  formEndpoint: "",

  /* Your Instagram. Replace with the real handle and URL once live. */
  instagram:       "https://instagram.com/offhours",
  instagramHandle: "@offhours",

  /* Where the "Contact" link points. */
  contactEmail: "hello@offhours.club"
};

/* Admin settings live in js/admin-config.js (loaded only by admin.html) so
   they never ship in the public site bundle. */
