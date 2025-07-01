const hasExpired = (name, date, expDate) => {
  if (date < expDate) {
    console.log(`${name} has not expired. ${new Date(date)}`);
  } else {
    console.log(`${name} has expired. ${new Date(date)}`);
  }
};

const compareDate = () => {
  const currentDate = new Date();
  const expDate = new Date().setMinutes(new Date().getMinutes() + 15);

  const expired = new Date().setMinutes(new Date().getMinutes() + 20);
  const notExpired = new Date().setMinutes(new Date().getMinutes() + 10);

  console.log(`Date is ${currentDate}`);
  console.log(`Expiring Date is ${new Date(expDate)}`);
  hasExpired("New Token", notExpired, expDate);
  hasExpired("Old Token", expired, expDate);
};

compareDate();
