export const BASE_URL = "https://api.thewpl.xyz"

export const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const website_regex = /^(?:https?:\/\/)?(?:www\.)?(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,6}(?:\/\S*)?$/i;

export const discord_server_link_regex = /^(https?:\/\/)?(www\.)?(discord\.(gg|com)\/(invite\/)?([a-zA-Z0-9-]+))$/i;
export const telegram_channel_link_regex = /^(https?:\/\/)?(www\.)?(t\.me\/([a-zA-Z0-9_]+))$/i;

export function isValidStarkNetAddress(address) {
  // Check if the address starts with '0x'
  if (!address.startsWith('0x')) {
    return false;
  }

  // Remove the '0x' prefix
  const addressWithoutPrefix = address.slice(2);

  // Check if the rest of the address is a valid hexadecimal string
  const hexRegex = /^[0-9a-fA-F]+$/;
  if (!hexRegex.test(addressWithoutPrefix)) {
    return false;
  }

  // Check if the address length is valid
  if (addressWithoutPrefix.length > 64 || addressWithoutPrefix.length === 0) {
    return false;
  }

  return true;
}

export const isValidLink = (link) => {
 const regex = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/.*)?$/;
  return regex.test(link);
}

export function getTimestampFromNow(deliveryTime, timeUnit, starts_in) {
    // const [number, unit] = input.split(' '); // Split the input into number and unit
    const duration = parseInt(deliveryTime, 10); // Convert the number to an integer
    // const now = new Date(); // Get the current date
    const now = new Date(starts_in)

    switch (timeUnit?.toLowerCase()) {
        case 'day':
        case 'days':
            now.setDate(now.getDate() + duration);
            break;
        case 'week':
        case 'weeks':
            now.setDate(now.getDate() + duration * 7); // 7 days in a week
            break;
        case 'month':
        case 'months':
            now.setMonth(now.getMonth() + duration);
            break;
        default:
            throw new Error('Invalid time unit. Please use "day", "week", or "month".');
    }

    return now.getTime(); // Return the timestamp in milliseconds
}

export const calcDaysUntilDate = (startDate, futureDate) => {
    const startDateObj = new Date(startDate);
    
    const differenceInMilliseconds = new Date(futureDate) - startDateObj;
    const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    // if (differenceInDays%30 == 0) {
    //     return { timeUnit: 'Months', deliveryTime: Math.floor(differenceInDays / 30) };
    // } else 
    if (differenceInDays%7 == 0) {
        return { timeUnit: 'Weeks', deliveryTime: Math.floor(differenceInDays / 7) };
    } else {
        return { timeUnit: 'Days', deliveryTime: differenceInDays };
    }
}

export function calculateRemainingDaysAndHours(startDate, targetDate) {
    // Create a Date object for the target date
    const targetDateTime = new Date(targetDate);
  
    // Get the current time
    const currentTime = new Date(startDate);
  
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

export function calculateRemainingDaysHoursAndMinutes(startDate, targetDate) {
  // Create a Date object for the target date
  const targetDateTime = new Date(targetDate);

  // Get the current time
  const currentTime = new Date(startDate);

  // Calculate the time difference in milliseconds
  const timeDifferenceMs = targetDateTime - currentTime;

  // Ensure the target date is in the future
  if (timeDifferenceMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
    };
  }
  
    // Convert milliseconds to seconds, minutes, hours, and days
    const timeDifferenceSeconds = Math.floor(timeDifferenceMs / 1000);
    const timeDifferenceMinutes = Math.floor(timeDifferenceSeconds / 60);
    const timeDifferenceHours = Math.floor(timeDifferenceMinutes / 60);
    const timeDifferenceDays = Math.floor(timeDifferenceHours / 24);
  
    // Calculate remaining hours after accounting for days
    const remainingHours = timeDifferenceHours % 24;
  
    // Calculate remaining minutes after accounting for hours
    const remainingMinutes = timeDifferenceMinutes % 60;
  
    return {
      days: timeDifferenceDays,
      hours: remainingHours,
      minutes: remainingMinutes,
    };
}

export function convertTimestampToDate(timestamp) {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

export const generateUsername = (name) => {
  let username;
  if (!name) {
    username = `wpl_user_${Math.floor(Math.random() * 1000)}`; 
  } else {
    username = name.replace(/\s+/g, '').toLowerCase(); 
    username = username.replace(/[^a-zA-Z0-9_]/g, ''); 
  }
  return username;
} 

export const ROLES = [
  "Backend Developer",
  "Smart contract / blockchain",
  "Frontend Developer",
  "Design",
  "Content writing",
  "Social",
  "Video",
  "Research",
]

export const SKILLS = [
  "Frontend",
  "Backend",
  "Fullstack",
  "DevOps",
  "Data Science",
  "Machine Learning",
  "Software Development",
  "QA",
  "UI/UX",
  "Project Management",
  "Business Analysis",
]

export const SIGNUP_CHOICE = 'SIGNUP_CHOICE'
export const APPLY_AS_CHOICE = 'APPLY_AS_CHOICE'
export const PROFILE_DETAILS_CHOICE = 'PROFILE_DETAILS_CHOICE'