Date.prototype.getWeek = function () {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    var week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let currentWeek = new Date().getWeek();

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('live-timer').textContent = timeString;
}
setInterval(updateClock, 1000);

function renderMiniCalendar(year, month) {
    const title = document.getElementById('calendar-title');
    const grid = document.getElementById('calendar-grid');

    const day1 = new Date(year, month, 1);
    const today = new Date();
    const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    title.textContent = `${day1.toLocaleString('en-US', { month: 'long' })} ${year}`;
    let html = days.map(d => `<div class="calendar-day calendar-day-header">${d}</div>`).join('');

    let weekDay1 = (day1.getDay() + 6) % 7;
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = weekDay1 - 1; i >= 0; i--) {
        let day = new Date(year, month - 1, new Date(year, month, 0).getDate() - i);
        let isToday = today.getFullYear() === day.getFullYear() && 
        today.getMonth() === day.getMonth() && 
        today.getDate() === day.getDate();

        html += `<div class="calendar-day${isToday ? ' calendar-day-today' : ' calendar-day-another-month'}">${day.getDate()}</div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        let isToday = today.getFullYear() === year && 
        today.getMonth() === month && 
        today.getDate() === day;

        html += `<div class="calendar-day${isToday ? ' calendar-day-today' : ''}">${day}</div>`;
    }

    let totalCells = weekDay1 + daysInMonth;
    for (let i = 1; i <= 42 - totalCells; i++) {
        let day = new Date(year, month, new Date(year, month + 1, 0).getDate() + i);
        let isToday = today.getFullYear() === day.getFullYear() && 
        today.getMonth() === day.getMonth() && 
        today.getDate() === day.getDate();

        html += `<div class="calendar-day${isToday ? ' calendar-day-today' : ' calendar-day-another-month'}">${day.getDate()}</div>`;
    }
    grid.innerHTML = html;
}

document.getElementById('prev-month').onclick = () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderMiniCalendar(currentYear, currentMonth);
};

document.getElementById('next-month').onclick = () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderMiniCalendar(currentYear, currentMonth);
};

renderMiniCalendar(currentYear, currentMonth);

function getWeekStartDate(year, week) {
    let simple = new Date(year, 0, 4);
    let dayOfWeek = (simple.getDay() + 6) % 7;
    let monday = new Date(simple);
    monday.setDate(simple.getDate() - dayOfWeek);
    monday.setDate(monday.getDate() + (week - 1) * 7);
    return monday;
}

function renderWeekGrid(year, week) {
    const title = document.getElementById('week-num');
    const grid = document.getElementById('week-grid');
    const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    const today = new Date();
    const weekStart = getWeekStartDate(year, week);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    title.textContent = `Week ${week}: 
    from ${weekStart.getDate().toString().padStart(2, '0')}.${(weekStart.getMonth() + 1).toString().padStart(2, '0')} 
    to ${weekEnd.getDate().toString().padStart(2, '0')}.${(weekEnd.getMonth() + 1).toString().padStart(2, '0')}`;

    let timeZone = today.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ')[2];
    let html = `<div class="time-zone">${timeZone}</div>`;
    
    html += days.map((d, i) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        let isToday = today.getFullYear() === date.getFullYear() && 
        today.getMonth() === date.getMonth() && 
        today.getDate() === date.getDate();

        return `<div class="week-date-header ${isToday ? ' week-date-today' : ' '}">${d} ${date.getDate().toString().padStart(2, '0')}</div>`;
    }).join('');

    for (let i = 0; i < 192; i++) {
        if (i % 8 === 0) {
            let row = Math.floor(i / 8);
            let isNow = today.getHours() === row;
            html += `<div class="hour-name ${isNow ? ' hour-now' : ' '}">${row.toString().padStart(2, '0')}:00</div>`;
        } else {
            html += `<div class="hour-cell" id="hour-cell-${i}"></div>`;
        }
    }

    grid.innerHTML = html;
}

document.getElementById('prev-week').onclick = () => {
    currentWeek--;
    if (currentWeek < 1) {
        currentYear--;

        let dec28 = new Date(currentYear, 11, 28);
        currentWeek = dec28.getWeek();
    }

    let weekStart = getWeekStartDate(currentYear, currentWeek);
    currentMonth = weekStart.getMonth();
    renderWeekGrid(currentYear, currentWeek);
    renderMiniCalendar(currentYear, currentMonth);
};

document.getElementById('next-week').onclick = () => {
    let dec28 = new Date(currentYear, 11, 28);
    let maxWeek = dec28.getWeek();

    currentWeek++;
    if (currentWeek > maxWeek) {
        currentWeek = 1;
        currentYear++;
        currentMonth = 0;
    } else {
        let weekStart = getWeekStartDate(currentYear, currentWeek);
        currentMonth = weekStart.getMonth();
    }
    renderWeekGrid(currentYear, currentWeek);
    renderMiniCalendar(currentYear, currentMonth);
};

renderWeekGrid(currentYear, currentWeek);

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("modal");
    const form = document.getElementById("event-form");

    document.getElementById('add-event').onclick = () => {
        modal.classList.add("show-modal");
    };

    document.getElementById('close').onclick = () => {
        modal.classList.remove("show-modal");
    };

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const eventName = document.getElementById('event-name').value.trim();
        const eventDate = document.getElementById('event-date').value;
        const eventTime = document.getElementById('event-time').value;

        const eventData = { name: eventName, date: eventDate, time: eventTime };

        fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        })
        .then(res => res.json())
        .then(data => {
            console.log('Saved:', data.message);
            modal.classList.remove("show-modal");
            form.reset();
        })
        .catch(err => {
            console.error('Error:', err);
        });
    });
});