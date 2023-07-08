const daysOfWeek = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];

function deserializeHabitsFromStorage() {
    var habits = localStorage.getItem('habits');
    if (!habits) {
        localStorage.setItem('habits', JSON.stringify({}));
    }
    return habits ? JSON.parse(habits) : {};
}

function deserializeDaysHabitsFromStorage() {
    var daysHabits = localStorage.getItem('daysHabits');
    var habits = deserializeHabitsFromStorage();

    if (!daysHabits) {
        localStorage.setItem('daysHabits', JSON.stringify({}));
        daysHabits = {}
    }
    if (!habits) {
        localStorage.setItem('habits', JSON.stringify({}));
        habits = {};
    }

    daysHabits = JSON.parse(daysHabits);

    var deserialized = {}

    for (var day in daysHabits) {
        var ids = daysHabits[day];
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            if (habits[id]) {
                if (deserialized[day]) {
                    deserialized[day].push({id: habits[id].id, action: habits[id].action});
                } else {
                    deserialized[day] = [{id: habits[id].id, action: habits[id].action}];
                }
            }
        }
    }

    return deserialized;
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
    const action = fd.get('action');

    var nextHabitId = 0;
    if (fd.get("id")) {
        nextHabitId = fd.get("id");
    } else {
        nextHabitId = localStorage.getItem('nextHabitId') || 0;
    }

    var newHabit = {
        id: nextHabitId,
        action: action,
        frequency: []
    }

    daysOfWeek.forEach(day => {
        if (fd.get(day)) {
            newHabit.frequency.push(day);
        }
    })

    var habits = deserializeHabitsFromStorage();
    habits[newHabit.id] = newHabit;

    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('nextHabitId', parseInt(nextHabitId) + 1);

    buildDaysHabits()
}

function buildDaysHabits() {
    var daysHabits = {
        "Mon": [],
        "Tues": [],
        "Wed": [],
        "Thurs": [],
        "Fri": [],
        "Sat": [],
        "Sun": []
    };

    var habits = deserializeHabitsFromStorage();

    for (var habitId in habits) {
        var habit = habits[habitId];
        var freq = habit.frequency;
        for (var i = 0; i < freq.length; i++) {
            var day = freq[i];
            daysHabits[day].push(habit.id);
        }
    }

    localStorage.setItem('daysHabits', JSON.stringify(daysHabits));
}

function showHabitList() {
    var daysHabits = deserializeDaysHabitsFromStorage();

    daysOfWeek.forEach(day => {
        var habitDay = daysHabits[day];
        var habitList = document.querySelector('#habit-list #' + day + ' ul');
        habitList.innerHTML = '';

        if (habitDay) {
            for (var habit of habitDay) {
                var li = document.createElement('li');
                var sp = document.createElement('span');

                sp.innerText = habit.action;
                sp.setAttribute('onclick', 'editHabit(' + habit.id + ')');
                li.appendChild(sp);

                var delBtn = document.createElement('button');
                delBtn.innerText = 'X';
                delBtn.setAttribute('onclick', 'removeHabit(' + habit.id + ', "' + day + '")');
                li.appendChild(delBtn);

                habitList.appendChild(li);
            }
        }
    })

    document.getElementById('habit-list').style.display = 'flex';
}

function hideHabitList() {
    document.getElementById('habit-list').style.display = 'none';
}

function editHabit(habitId) {
    var habits = deserializeHabitsFromStorage();
    var habit = habits[habitId];

    document.getElementById('id').value = habitId;
    document.getElementById('action').value = habit.action;
    daysOfWeek.forEach(day => {
        document.getElementById(day).checked = habit.frequency.includes(day);
    });

    hideHabitList();
    showHabitForm();
}

function removeHabit(habitId, day) {
    var habits = deserializeHabitsFromStorage();
    delete habits[habitId];
    localStorage.setItem('habits', JSON.stringify(habits));
    buildDaysHabits();
    hideHabitList();
    showHabitList();
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
setInterval(updateDateTime, 60000);
updateCoins();
updateStreak();

