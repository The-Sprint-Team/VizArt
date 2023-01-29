export const convertTime = (time: Date) => {
  let date = time.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthStr = monthNames[time.getMonth()];
  let year = time.getFullYear();

  let hour = time.getHours();
  let minute = time.getMinutes();
  let second = time.getSeconds();
  let ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12;
  let minuteStr = minute < 10 ? "0" + minute : minute;
  let secondStr = second < 10 ? "0" + second : second;

  let strTime =
    monthStr +
    " " +
    date +
    " " +
    year +
    ", " +
    hour +
    ":" +
    minuteStr +
    ":" +
    secondStr +
    " " +
    ampm;
  return strTime;
};

export const secondsToMinutesSeconds: (seconds: number) => string = (
  seconds
) => {
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};
