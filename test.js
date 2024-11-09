function calculateRemainingDaysAndHours(targetDate) {
  // Create a Date object for the target date
  const targetDateTime = new Date(targetDate);

  // Get the current time
  const currentTime = new Date();

  // Calculate the time difference in milliseconds
  const timeDifferenceMs = targetDateTime - currentTime;

  // Convert milliseconds to seconds, minutes, hours, and days
  const timeDifferenceSeconds = Math.floor(timeDifferenceMs / 1000);
  const timeDifferenceMinutes = Math.floor(timeDifferenceSeconds / 60);
  const timeDifferenceHours = Math.floor(timeDifferenceMinutes / 60);
  const timeDifferenceDays = Math.floor(timeDifferenceHours / 24);   


  // Calculate remaining hours after accounting for days
  const remainingHours = timeDifferenceHours % 24;

  return {
    days: timeDifferenceDays,
    hours: remainingHours
  };
}

// console.log(calculateRemainingDaysAndHours('2024-10-28T18:30:00.000Z'));

function convertTimestampToDate(timestamp) {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

console.log('TS: ', convertTimestampToDate(1731177000000));

