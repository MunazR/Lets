$(document).ready(function() {
  auth();

  $("#retry-auth").on('click', function() {
    auth();
  });

  $("#create-event-link").on('click', function() {
    $("#create-event-form").show();
    google.maps.event.trigger(createEventMap, "resize");
    createEventMap.panTo(createEventMarker.position);
    $("#categories-container").hide();
  });

  $("#create-event-back").on('click', function() {
    $("#create-event-form").hide();
    $("#categories-container").show();
  });

  $("#events-back").on('click', function() {
    $("#events-container").hide();
    $("#categories-container").show();
  });

  $("#events-map-back").on('click', function() {
    $("#events-container").show();
    $("#events-map-container").hide();
  });

  $("#events-view-map").on('click', function() {
    $("#events-container").hide();
    $("#events-map-container").show();
    google.maps.event.trigger(eventsMap, "resize");
    eventsMap.panTo({
      lat: 43.4722854,
      lng: -80.5448576
    });
  });

  $("#detailed-event-back").on('click', function() {
    $("#detailed-event-container").hide();
    $("#events-container").show();
  });

  $("#create-event-confirm").on('click', function() {
    var name = $("#event-name").val();
    var description = $("#event-description").val();
    var location = createEventMarker.getPosition();
    var startdate = $("#event-start-date").val();
    var starttime = $("#event-start-time").val();
    var enddate = $("#event-end-date").val();
    var endtime = $("#event-end-time").val();
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

    if (!startdate) {
      return alert('Missing start date');
    }

    if (!starttime) {
      return alert('Missing start time');
    }

    if (!enddate) {
      return alert('Missing end date');
    }

    if (!endtime) {
      return alert('Missing end time');
    }

    var startDateTime = new Date(startdate + " " + starttime);
    var endDateTime = new Date(enddate + " " + endtime);

    var eventsRef = new Firebase("https://incandescent-torch-8518.firebaseio.com/events");
    var newEvent = {
      name: name,
      description: description,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      category: category,
      user: $("#user-info").data('user-id'),
      created: new Date()
    };

    var newEventRef = eventsRef.push(newEvent);
    var geoFire = new GeoFire(newEventRef);
    geoFire.set('location', [location.H, location.L]);
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

  $("#user-info").attr('data-user-id', data.uid);
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

    $(".category").on('click', function() {
      var category = $(this);
      var id = category.data('category-id');
      var title = category.find('.category-title').text();
      var template = Handlebars.compile($("#event-template").html());
      var eventsRef = ref.child('events');

      eventsRef.orderByChild('category').on('value', function(dataSnapshot) {
        $("#events").empty();
        var data = dataSnapshot.val();

        eventsMap = new google.maps.Map(document.getElementById('events-map'), {
          center: {
            lat: 43.4722854,
            lng: -80.5448576
          },
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoom: 15
        });

        for (var eventId in data) {
          var event = data[eventId];
          if (event.category !== id) {
            continue;
          }

          var endDate = new Date(event.end);
          var startDate = new Date(event.start);
          var curr = new Date();

          if (curr > endDate) {
            continue;
          }

          event.start = startDate.toLocaleString();
          event.end = endDate.toLocaleString();
          event.id = eventId;

          $("#events").append(template(event));

          var eventsMarker = new google.maps.Marker({
            position: {
              lat: event.l.location[0],
              lng: event.l.location[1]
            },
            map: eventsMap,
            title: event.name
          });
        }

        google.maps.event.trigger(eventsMap, "resize");
        eventsMap.panTo(eventsMap.center);

        $(".event").on('click', function() {
          var eventId = $(this).data("event-id");
          var eventRef = eventsRef.child(eventId);

          eventRef.on('value', function(dataSnapshot) {
            var event = dataSnapshot.val();

            var endDate = new Date(event.end);
            var startDate = new Date(event.start);
            event.start = startDate.toLocaleString();
            event.end = endDate.toLocaleString();
            event.id = eventId;

            var eventUserRef = usersRef.child(event.user);

            eventUserRef.on('value', function(dataSnapshot) {
              var user = dataSnapshot.val();
              var template = Handlebars.compile($("#detailed-event-template").html());

              event.username = user.first_name;
              event.userimage = user.picture.data.url;

              $("#detailed-event").html(template(event));

              var eventMap = new google.maps.Map(document.getElementById('event-map'), {
                center: {
                  lat: event.l.location[0],
                  lng: event.l.location[1]
                },
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoom: 17
              });

              var eventMarker = new google.maps.Marker({
                position: eventMap.getCenter(),
                map: eventMap,
                title: "Event Location"
              });

              $("#detailed-event-container").show();
              $("#events-container").hide();

              google.maps.event.trigger(eventMap, "resize");
              eventMap.panTo(eventMarker.position);
            });
          })

        });
      });

      $("#events-category-title").html(title);

      $("#events-container").show();
      $("#categories-container").hide();
    });

    $("#categories-container").show();
  });
}

var createEventMap;
var createEventMarker;
var eventsMap;

function initCreateEventMap() {
  createEventMap = new google.maps.Map(document.getElementById('create-event-map'), {
    center: {
      lat: 43.4722854,
      lng: -80.5448576
    },
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 17
  });

  createEventMarker = new google.maps.Marker({
    position: createEventMap.getCenter(),
    map: createEventMap,
    draggable: true,
    title: "Event Location"
  });
}
