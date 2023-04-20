export const wait = (time = 1000) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const range = (min, max) => {
  const result = [];

  if (min > max) {
    return [];
  }

  for (let i = min; i <= max; i++) {
    result.push(i);
  }
  return result;
};
