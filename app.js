var clientId = '671184303843-s4aki11rvf7go9qbkp6uqbuvc6gbu66s.apps.googleusercontent.com';
var apiKey = 'AIzaSyBE4KEVpdbfTDzcO3f3w7zdv7cHXU-SlcU';
var calendarId  = "77bb5df8d2f80f3b6825279374fed2165eb429fe8554fe9c4a7ecd32055b6564@group.calendar.google.com";
var scopes = 'https://www.googleapis.com/auth/calendar.readonly';


function start() {
    gapi.load('client', function() {
        initClient();
    });
}

function initClient() {
    gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
    }).then(function () {
        calendarPull();
    }, function(error) {
        console.error("Error loading GAPI client for API", error);
    });
}

function calendarPull() {
    var today = new Date();
    today.setDate(today.getDate() - 1);
    gapi.client.calendar.events.list({
        'calendarId': calendarId,
        'singleEvents': true,
        'timeMin': today.toISOString(),
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function(response) {
        var events = response.result.items;
        console.log(events);
        displayEvents(events);
    }).catch(function(error) {
        console.error("Error fetching events", error);
    });
}

function displayEvents(events) {
    const eventsContainer = document.getElementById('events');
    eventsContainer.innerHTML = ''; // Clear previous entries

    if (events.length === 0) {
        // No events found, display a message
        const noEventsMessage = document.createElement('h1');
        noEventsMessage.textContent = "No upcoming events at the moment";
        noEventsMessage.style.color = "white"; // Example style, adjust as needed
        eventsContainer.appendChild(noEventsMessage);
    } else {
        // Events exist, display them in the container
        events.forEach(function(event) {
            const eventColumn = document.createElement('div');
            eventColumn.className = 'event-column'; // Apply CSS for styling

            const eventName = document.createElement('h2');
            eventName.textContent = event.summary;

            const eventDate = document.createElement('p');
            const dateTime = event.start.dateTime || event.start.date;
            eventDate.textContent = `Date & Time: ${formatDate(dateTime)}`;

            const eventLocation = document.createElement('p');
            eventLocation.textContent = `Location: ${event.location || 'No location provided'}`;

            const eventDescription = document.createElement('p');
            eventDescription.textContent = `Details: ${event.description || 'No description provided'}`;

            eventColumn.appendChild(eventName);
            eventColumn.appendChild(eventDate);
            eventColumn.appendChild(eventLocation);
            eventColumn.appendChild(eventDescription);

            eventsContainer.appendChild(eventColumn);
        });
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) +
           ' at ' + date.toLocaleTimeString(undefined, { timeStyle: 'short' });
}



document.addEventListener('DOMContentLoaded', start);