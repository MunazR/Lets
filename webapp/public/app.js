$(document).ready(function() {
  auth();

  $("#retry-auth").on('click', function() {
    auth();
  });

  $("#create-event-link").on('click', function() {
    $("#create-event-form").show();
    $("#categories-container").hide();
  });

  $("#create-event-back").on('click', function() {
    $("#create-event-form").hide();
    $("#categories-container").show();
  });

  $("#create-event-confirm").on('click', function() {
    var name = $("#event-name").val();
    var description = $("#event-description").val();
    var location = $("#event-location").val();
    var date = $("#event-date").val();
    var time = $("#event-time").val();
    var category = $("#event-category").val();

    if (!name) {
      return alert('Missing event name');
    }

    if (!description) {
      return alert('Missing event description');
    }

    if (!location) {
      return alert('Missing event location');
    }

    if (!date) {
      return alert('Missing event date');
    }

    if (!time) {
      return alert('Missing event time');
    }

    var eventsRef = new Firebase("https://incandescent-torch-8518.firebaseio.com/events");
    var newEvent = {
      name: name,
      description: description,
      location: location,
      date: date,
      time: time,
      category: category
    };
    eventsRef.push(newEvent);

    alert('Event created!');
    $("#create-event-form").hide();
    $("#categories-container").show();
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
  $("#user-info").show();

  var categoriesRef = ref.child('categories');

  categoriesRef.on('value', function(dataSnapshot) {
    var data = dataSnapshot.val();
    var template = Handlebars.compile($("#category-template").html());
    var category;

    $("#categories").empty();

    for (var categoryId in data) {
      category = data[categoryId];
      category.id = categoryId;
      $("#categories").append(template(category));
    }

    $("#categories-container").show();
  });

  console.log('categories', categoriesRef);
}
