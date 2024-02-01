import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const datePickerInput = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const countdownElements = {
  days: document.querySelectorAll('.value[data-days]'),
  hours: document.querySelectorAll('.value[data-hours]'),
  minutes: document.querySelectorAll('.value[data-minutes]'),
  seconds: document.querySelectorAll('.value[data-seconds]'),
};

startButton.disabled = true;
let countdownInterval;

document.addEventListener('DOMContentLoaded', function () {
  Notify.init({ useIcon: false });

  const flCalendar = flatpickr(datePickerInput, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onOpen(selectedDates) {
      flCalendar.setDate(new Date(Date.now() + 30_000));
    },
    onClose([selectedDate]) {
      if (selectedDate - Date.now() < 0) {
        Notify.failure('✖️ Please choose a date in the future');
        startButton.disabled = true;
      } else {
        startButton.disabled = false;
      }
    },
  });

  startButton.addEventListener('click', function () {
    const selectedDate = flCalendar.selectedDates[0];
    if (selectedDate) {
      startCountdown(selectedDate);
    }
  });

  datePickerInput.addEventListener('click', function () {
    flCalendar._flatpickr.open();
  });
});

function startCountdown(targetDate) {
  clearInterval(countdownInterval);

  countdownInterval = setInterval(function () {
    const now = Date.now();
    const timeDifference = targetDate - now;

    if (timeDifference <= 0) {
      clearInterval(countdownInterval);
      setCountdownValues(0, 0, 0, 0); // Countdown completed
    } else {
      const remainingTime = convertMs(timeDifference);
      setCountdownValues(
        remainingTime.days,
        remainingTime.hours,
        remainingTime.minutes,
        remainingTime.seconds
      );
    }
  }, 1000);
}

function setCountdownValues(days, hours, minutes, seconds) {
  countdownElements.days.forEach(element => {
    element.textContent = addLeadingZero(days);
  });
  countdownElements.hours.forEach(element => {
    element.textContent = addLeadingZero(hours);
  });
  countdownElements.minutes.forEach(element => {
    element.textContent = addLeadingZero(minutes);
  });
  countdownElements.seconds.forEach(element => {
    element.textContent = addLeadingZero(seconds);
  });
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
