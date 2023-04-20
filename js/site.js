//seed objects
var bookings = [
    {
        clientName: 'John Doe',
        people: 4,
        date: '06/01/2023',
        time: '4:00 PM',
    },
    {
        clientName: 'Olivia Smith',
        people: 2,
        date: '06/05/2023',
        time: '6:00 PM',
    },
    {
        clientName: 'Isabella Rodriguez',
        people: 6,
        date: '06/01/2023',
        time: '10:00 PM',
    },
    {
        clientName: 'James Wllson',
        people: 2,
        date: '06/03/2023',
        time: '8:00 PM',
    },
    {
        clientName: 'Lucas J. Willson',
        people: 2,
        date: '06/03/2023',
        time: '8:00 PM',
    },
]

//Create & Retive Database
function getBookingData() {
    //Gets all current booking data from local database

    let data = localStorage.getItem('vinoRuraleData');

    if (data == null) {

        let identifiedBookings = bookings.map(booking => {
            booking.id = generateId();
            return booking;
        });

        localStorage.setItem('vinoRuraleData', JSON.stringify(identifiedBookings));
        data = localStorage.getItem('vinoRuraleData');
    };

    let currentBookings = JSON.parse(data);

    if (currentBookings.some(booking => booking.id == undefined)) {

        currentBookings.forEach(booking => booking.id = generateId());

        localStorage.setItem('vinoRuraleData', JSON.stringify(currentBookings));
    };

    return currentBookings;
}

//Display Bookings
function displayBookings() {

    //get booking data
    let bookingData = getBookingData();

    //reset page
    const bookingsCards = document.getElementById('bookingsCards');
    bookingsCards.innerHTML = '';

    //get template for cards
    const template = document.getElementById('bookingCardTemplate');

    //use template on each booking
    for (let i = 0; i < bookingData.length; i++) {
        const booking = bookingData[i];
        const card = document.importNode(template.content, true);

        card.querySelector('[data-id="clientName"]').textContent = booking.clientName;
        card.querySelector('[data-id="people"]').textContent = booking.people;
        card.querySelector('[data-id="date"]').textContent = booking.date;
        card.querySelector('[data-id="time"]').textContent = booking.time;
        card.querySelector('div').setAttribute('data-booking-id', booking.id);

        //display card on page
        bookingsCards.appendChild(card);
    };

}

//New Booking
function saveNewBooking() {

    //get inputs from page
    let clientName = document.getElementById('newBookingClientName').value;

    let people = parseInt(document.getElementById('newBookingPeople').value);

    let date = document.getElementById('newBookingDate').value;
    date = new Date(date).toLocaleDateString();

    let timeSelect = document.getElementById('newBookingTime');
    let timeIndex = timeSelect.selectedIndex;
    let time = timeSelect.options[timeIndex].text;

    //create new booking object
    let newBooking = {
        id: generateId(),
        clientName: clientName,
        people: people,
        date: date,
        time: time
    }

    //add booking to database
    let bookingsData = getBookingData();
    bookingsData.push(newBooking);
    localStorage.setItem('vinoRuraleData', JSON.stringify(bookingsData));

    //refresh page with new bookings
    displayBookings();
}

//Edit Booking - Fill form
function editBooking(bookingCard) {

    //get booking data
    let bookingData = getBookingData();

    //find booking card with id
    let bookingId = bookingCard.getAttribute('data-booking-id');
    let booking = bookingData.find(booking => booking.id == bookingId);

    //set booking info on modal form
    document.getElementById('editBookingId').value = booking.id;

    document.getElementById('editBookingClientName').value = booking.clientName;

    document.getElementById('editBookingPeople').value = booking.people;

    let bookingDate = new Date(booking.date);
    let bookingDateString = bookingDate.toISOString();
    let bookingDateArray = bookingDateString.split('T');
    let bookingDateFormated = bookingDateArray[0];
    document.getElementById('editBookingDate').value = bookingDateFormated;

    let bookingSelect = document.getElementById('editBookingTime');
    let optionsArray = [...bookingSelect.options];
    let index = optionsArray.findIndex(option => option.text == booking.time);
    bookingSelect.selectedIndex = index;
}

//Edit Booking - Save
function saveEditBooking() {

    //get inputs from page
    let bookingId = document.getElementById('editBookingId').value;

    let clientName = document.getElementById('editBookingClientName').value;

    let people = parseInt(document.getElementById('editBookingPeople').value);

    let date = document.getElementById('editBookingDate').value;
    date = new Date(date).toLocaleDateString();

    let timeSelect = document.getElementById('editBookingTime');
    let timeIndex = timeSelect.selectedIndex;
    let time = timeSelect.options[timeIndex].text;

    //create updated booking
    let newBooking = {
        id: bookingId,
        clientName: clientName,
        people: people,
        date: date,
        time: time
    }

    //get booking database
    let bookingsData = getBookingData();

    //find the location of the old event with this id
    let index = bookingsData.findIndex(booking => booking.id == bookingId);

    //replace that booking with newId
    bookingsData[index] = newBooking;

    //save it in local storage
    localStorage.setItem('vinoRuraleData', JSON.stringify(bookingsData));

    //refresh page bookings
    displayBookings();

}

//Delete Booking
function deleteBooking() {

    //get the booking in local storage
    let bookingsData = getBookingData();

    //filter out booking with id
    let bookingId = document.getElementById('editBookingId').value;
    let filteredBookings = bookingsData.filter(booking => booking.id != bookingId);

    //save that array to local storage
    localStorage.setItem('vinoRuraleData', JSON.stringify(filteredBookings));

    //Update stats and events tabel
    displayBookings();
}

//Generate Id
function generateId() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
