const daysOfWeek = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];

function deserializeHabitsFromStorage() {
    var habits = localStorage.getItem('habits');
    if (!habits) {
        localStorage.setItem('habits', JSON.stringify({}));
    }
    return habits ? JSON.parse(habits) : {};
}

function getTodaysHabits() {
    var today = new Date();
}

function showHabitForm() {
    document.getElementById('habit-form-wrapper').style.display = 'flex';
}

function closeHabitForm() {
    document.getElementById('habit-form-wrapper').style.display = 'none';
    clearHabitForm();
}

function validateAndSubmitHabitForm() {
    if (validateHabitForm()) {
        var fd = new FormData(document.forms["habit-form"])
        addHabit(fd);
        closeHabitForm();
    }
}

function validateHabitForm() {
    return true;
}

function clearHabitForm() {
    document.forms["habit-form"].reset();
}

function getTodaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
}

function addHabit(fd) {
    var allHabits = deserializeHabitsFromStorage();
    const action = fd.get('action');

    daysOfWeek.forEach(day => {
        if (fd.get(day) == '1') {
            var daysHabits = allHabits[day];
            if (!daysHabits) {
                allHabits[day] = [];
            }
            allHabits[day].push(action);
        }
    })

    localStorage.setItem('habits', JSON.stringify(allHabits));
}

function showHabitList() {
    var habits = deserializeHabitsFromStorage();
    daysOfWeek.forEach(day => {
        var daysHabits = habits[day];
        if (daysHabits) {
            var habitList = document.querySelector('#habit-list #' + day + ' ul');
            habitList.innerHTML = '';
            daysHabits.forEach(habit => {
                var li = document.createElement('li');
                li.innerText = habit;
                habitList.appendChild(li);
            })
        }
    })

    document.getElementById('habit-list').style.display = 'flex';
}

function updateDateTime() {
    const dateTime = document.getElementById('date-time');
    const dateTimeStr = new Date().toLocaleString();
    dateTime.innerText = dateTimeStr;
}

function updateCoins() {
    const coins = document.getElementById('coins');
    var coinsAmt = localStorage.getItem('coins');

    if (!coinsAmt) {
        localStorage.setItem('coins', 0);
        coinsAmt = 0;
    }
    coins.innerText = coinsAmt + ' coins';
}

function updateStreak() {
    const streak = document.getElementById('streak');
    var streakAmt = localStorage.getItem('streak');

    if (!streakAmt) {
        localStorage.setItem('streak', 0);
        streakAmt = 0;
    }
    var streakText = streakAmt + ' day streak';
    if (streakAmt > 7) {
        streakText = streakAmt + '!';
    }
    streak.innerText = streakText;

}

updateDateTime();
updateCoins();
updateStreak();

