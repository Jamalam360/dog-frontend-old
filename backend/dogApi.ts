export const getRandomDogImage = async (): Promise<string> => {
  const response = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await response.json();
  return data.message;
};
