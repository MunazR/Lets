$(document).ready(function() {
  auth();
  $("#retry-auth").on('click', function() {
    auth();
  });
});

function auth() {
  var ref = new Firebase("https://incandescent-torch-8518.firebaseio.com");
  ref.authWithOAuthPopup("facebook", function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
      $("#auth-failed").hide();
      init(ref, authData);
    }
  });
}

function init(ref, data) {
  var usersRef = ref.child('users');
  var userRef = usersRef.child(data.uid);

  var profile = data.facebook.cachedUserProfile;

  userRef.set(profile);

  $("#user-name").text(profile.first_name);
  $("#user-image").attr('src', profile.picture.data.url);
}
