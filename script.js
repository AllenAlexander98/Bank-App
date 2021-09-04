'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [
    { value: 230, date: '2021-08-18T21:31:17.178Z' },
    { value: 480, date: '2021-08-19T07:42:02.383Z' },
    { value: -400, date: '2021-08-20T09:15:04.904Z' },
    { value: 3000, date: '2021-08-21T10:17:24.185Z' },
    { value: -650, date: '2021-08-25T14:11:59.604Z' },
    { value: -130, date: '2021-08-28T17:01:17.194Z' },
    { value: 70, date: '2021-08-29T23:36:17.929Z' },
    { value: 1300, date: '2021-08-29T10:51:36.790Z' },
  ],
  interestRate: 1.2, // %
  pin: 1111,
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [
    { value: 5000, date: '2021-08-01T13:15:33.035Z' },
    { value: 3400, date: '2021-08-30T09:48:16.867Z' },
    { value: -150, date: '2021-08-25T06:04:23.907Z' },
    { value: -790, date: '2021-08-25T14:18:46.235Z' },
    { value: -3210, date: '2021-08-05T16:33:06.386Z' },
    { value: -1000, date: '2021-08-10T14:43:26.374Z' },
    { value: 8500, date: '2021-08-25T18:49:59.371Z' },
    { value: -30, date: '2021-08-26T12:01:20.894Z' },
  ],
  interestRate: 1.5,
  pin: 2222,
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  movements: [
    { value: 200, date: '2021-08-01T13:15:33.035Z' },
    { value: -200, date: '2021-08-30T09:48:16.867Z' },
    { value: 340, date: '2021-08-25T06:04:23.907Z' },
    { value: -300, date: '2021-08-25T14:18:46.235Z' },
    { value: -20, date: '2021-08-05T16:33:06.386Z' },
    { value: 50, date: '2021-08-10T14:43:26.374Z' },
    { value: 400, date: '2021-08-25T18:49:59.371Z' },
    { value: -460, date: '2021-08-26T12:01:20.894Z' },
  ],
  interestRate: 0.7,
  pin: 3333,
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  movements: [
    { value: 430, date: '2021-08-01T13:15:33.035Z' },
    { value: 1000, date: '2021-08-30T09:48:16.867Z' },
    { value: 700, date: '2021-08-25T06:04:23.907Z' },
    { value: 50, date: '2021-08-25T14:18:46.235Z' },
    { value: 90, date: '2021-08-05T16:33:06.386Z' },
    { value: -700, date: '2021-08-10T14:43:26.374Z' },
    { value: 500, date: '2021-08-25T18:49:59.371Z' },
    { value: -30, date: '2021-08-26T12:01:20.894Z' },
  ],
  interestRate: 1,
  pin: 4444,
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Global variable
let currentAccount, timer;

// Add username for every account
const calcUsername = function (name) {
  return name
    .toLowerCase()
    .split(' ')
    .map(mov => mov[0])
    .join('');
};

accounts.forEach(acc => (acc.username = calcUsername(acc.owner)));
console.log(accounts);

// Calc DateTime Movements
const calcDaysPassed = (date1, date2) =>
  Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

const formatMovementDate = function (date, locale) {
  const now = new Date();

  const daysPassed = calcDaysPassed(now, date);

  if (daysPassed === 0) {
    return 'Today';
  }
  if (daysPassed === 1) {
    return 'Yesterday';
  }
  if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  }

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Display movements Function
const displayMovements = function (acc, ordered = false) {
  const movs = !ordered
    ? acc.movements
    : acc.movements.slice().sort((a, b) => a.value - b.value);
  // Clear Movements table
  containerMovements.innerHTML = '';

  // Add Movement rows to Movements table
  movs.forEach(function (mov, i) {
    const type = mov.value > 0 ? 'deposit' : 'withdrawal';
    const displayValue = formatCurrency(mov.value, acc.locale, acc.currency);
    const displayDays = formatMovementDate(new Date(mov.date), acc.locale);

    const html = document.createElement('div');
    html.classList.add('movements__row');
    html.innerHTML = `<div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDays}</div>
          <div class="movements__value">${displayValue}</div>`;

    containerMovements.prepend(html);
  });
};

// Calc Display Balance Function
const calcDisplayBalance = function (acc) {
  const movs = acc.movements.map(mov => mov.value);
  const balance = movs.reduce((acc, mov) => acc + mov, 0);

  acc.balance = balance;

  labelBalance.textContent = formatCurrency(balance, acc.locale, acc.currency);
};

// Calc Display Summary Function
const calcDisplaySummary = function (acc) {
  const movs = acc.movements.map(mov => mov.value);

  const income = movs.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);

  const outcome = movs
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  const interest = acc.movements
    .filter(mov => mov.value > 0)
    .map(deposit => (deposit.value * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumIn.textContent = formatCurrency(income, acc.locale, acc.currency);
  labelSumOut.textContent = formatCurrency(
    Math.abs(outcome),
    acc.locale,
    acc.currency
  );
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

// Display Welcome Function
const displayWelcome = function (acc) {
  const now = new Date();

  labelWelcome.textContent = `Good ${
    now.getHours() >= 6 && now.getHours() <= 18 ? 'Morning' : 'Night'
  }, ${acc.owner.split(' ')[0]}!`;
};

// Update UI Function
const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc);

  // Display Balance
  calcDisplayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);

  // Display Welcome
  displayWelcome(acc);
};

// Log out function
const logOut = function () {
  containerApp.style.opacity = 0;
  labelWelcome.textContent = `Log in to get started`;
};

// Start Log Out Timer Function
const startLogOutTimer = function () {
  let time = 5 * 60; // 5 minutes

  const tick = function () {
    const minute = String(Math.trunc(time / 60)).padStart(2, '0');
    const second = String(time % 60).padStart(2, '0');

    // Display Timer
    labelTimer.textContent = `${minute}:${second}`;

    // When timer = 0, Logout
    if (time === 0) logOut();

    // Decrease time
    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

// -----------------FAKE LOGIN---------------------
// currentAccount = account1;
// containerApp.style.opacity = 100;
// updateUI(currentAccount);

// // display current time
// const options = {
//   year: 'numeric',
//   month: 'numeric',
//   day: 'numeric',
//   hour: 'numeric',
//   minute: 'numeric',
// };
// labelDate.textContent = new Intl.DateTimeFormat(
//   currentAccount.locale,
//   options
// ).format(new Date());

// displayWelcome(currentAccount);

//================================================

// Login Button
btnLogin.addEventListener('click', function (e) {
  // prevent default behavior
  e.preventDefault();

  const name = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);

  currentAccount = accounts.find(acc => acc.username === name);

  if (currentAccount?.pin === pin) {
    containerApp.style.opacity = 100;

    console.log(currentAccount);

    // Display current time
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(new Date());

    // Start Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }

  // Clear placeholder
  inputLoginUsername.value = inputLoginPin.value = '';

  // Clear focus
  inputLoginUsername.blur();
  inputLoginPin.blur();
});

// Sort Button
let ordered = false;
btnSort.addEventListener('click', function () {
  displayMovements(currentAccount, !ordered);
  ordered = !ordered;
});

// Transfer Button
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const receiverName = inputTransferTo.value;
  const amount = Math.floor(Number(inputTransferAmount.value));

  const receiverAccount = accounts.find(acc => acc.username === receiverName);

  if (
    receiverAccount &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAccount.username !== currentAccount.username
  ) {
    const nowISO = new Date().toISOString();

    currentAccount.movements.push({
      value: -amount,
      date: nowISO,
    });

    receiverAccount.movements.push({
      value: amount,
      date: nowISO,
    });

    // Reset Timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }

  // Update UI
  updateUI(currentAccount);

  // Clear placeholder
  inputTransferTo.value = inputTransferAmount.value = '';

  // Clear focus
  inputTransferTo.blur();
  inputTransferAmount.blur();
});

// Loan Button
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  const nowISO = new Date().toISOString();

  if (
    amount > 0 &&
    currentAccount.movements.some(mov => mov.value >= amount * 0.1)
  ) {
    // Accept Loan after 5 seconds
    setTimeout(function () {
      currentAccount.movements.push({
        value: amount,
        date: nowISO,
      });

      // Update UI
      updateUI(currentAccount);
    }, 5000);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }

  // Clear placeholder
  inputLoanAmount.value = '';

  // Clear focus
  inputLoanAmount.blur();
});

// Close Button
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const closeName = inputCloseUsername.value;
  const closePin = Number(inputClosePin.value);

  if (
    currentAccount.username === closeName &&
    currentAccount.pin === closePin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);

    // Log out
    logOut();
  }

  // Clear placeholder
  inputCloseUsername.value = inputClosePin.value = '';

  // Clear focus
  inputCloseUsername.blur();
  inputClosePin.blur();
});
