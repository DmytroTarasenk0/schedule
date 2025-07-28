let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

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
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    title.textContent = `${day1.toLocaleString('en-US', { month: 'long' })} ${year}`;
    let html = days.map(d => `<div class="calendar-day calendar-day-header">${d}</div>`).join('');
    
    let weekDay1 = day1.getDay();
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = weekDay1 - 1; i >= 0; i--) {
        let day = new Date(year, month - 1, new Date(year, month, 0).getDate() - i).getDate();
        html += `<div class="calendar-day calendar-day-another-month">${day}</div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        let isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
        html += `<div class="calendar-day${isToday ? ' calendar-day-today' : ''}">${day}</div>`;
    }

    let totalCells = weekDay1 + daysInMonth;
    for (let i = 1; i <= 42 - totalCells; i++) {
        let day = new Date(year, month, new Date(year, month + 1, 0).getDate() + i).getDate();
        html += `<div class="calendar-day calendar-day-another-month">${day}</div>`;
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
