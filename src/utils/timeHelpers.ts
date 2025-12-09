export const getGreetingKey = (): string => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return 'dashboard.greeting_morning';
  } else if (currentHour < 18) {
    return 'dashboard.greeting_day';
  } else {
    return 'dashboard.greeting_evening';
  }
};