Date.prototype.getWeek = function() {
    var jan1 = new Date(this.getFullYear(), 0, 1);
    var jan1Day = jan1.getDay() === 0 ? 7 : jan1.getDay(); // Su is 7 for now(no longer 0)
    var weekStart = new Date(jan1);
    weekStart.setDate(jan1.getDate() - (jan1Day - 1));

    var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
    var diff = today - weekStart;
    return 1 + Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
}

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
    var jan1 = new Date(year, 0, 1);
    var jan1Day = jan1.getDay() === 0 ? 7 : jan1.getDay();
    var weekStart = new Date(jan1);
    weekStart.setDate(jan1.getDate() - (jan1Day - 1) + (week - 1) * 7);
    return weekStart;
}

function renderWeekGrid(year, week) {
    const title = document.getElementById('week-num');
    const grid = document.getElementById('week-grid');
    const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    const weekStart = getWeekStartDate(year, week);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    title.textContent = `Week ${week}: 
    from ${weekStart.getDate().toString().padStart(2, '0')}.${(weekStart.getMonth() + 1).toString().padStart(2, '0')} 
    to ${weekEnd.getDate().toString().padStart(2, '0')}.${(weekEnd.getMonth() + 1).toString().padStart(2, '0')}`;

    let html = days.map((d, i) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        return `<div class="week-date-header">${d} ${date.getDate().toString().padStart(2, '0')}</div>`;
    }).join('');
    grid.innerHTML = html;
}

document.getElementById('prev-week').onclick = () => {
    currentWeek--;
    if (currentWeek < 1) {
        currentYear--;
        let lastDayPrevYear = new Date(currentYear, 11, 31);
        let lastWeek = lastDayPrevYear.getWeek();
        let lastWeekStart = getWeekStartDate(currentYear, lastWeek);
        let nextJan1 = new Date(currentYear + 1, 0, 1);
        
        if (
            nextJan1 >= lastWeekStart &&
            nextJan1 < new Date(lastWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
        ) {
            currentWeek = lastWeek - 1;
        } else {
            currentWeek = lastWeek;
        }
    }
    let weekStart = getWeekStartDate(currentYear, currentWeek);
    currentMonth = weekStart.getMonth();
    renderWeekGrid(currentYear, currentWeek);
    renderMiniCalendar(currentYear, currentMonth);
};

document.getElementById('next-week').onclick = () => {
    let lastDayOfYear = new Date(currentYear, 11, 31);
    let maxWeek = lastDayOfYear.getWeek();
    let maxWeekStart = getWeekStartDate(currentYear, maxWeek);
    let nextJan1 = new Date(currentYear + 1, 0, 1);
    
    if (
        nextJan1 >= maxWeekStart &&
        nextJan1 < new Date(maxWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
    ) {
        maxWeek = maxWeek - 1;
    }
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
