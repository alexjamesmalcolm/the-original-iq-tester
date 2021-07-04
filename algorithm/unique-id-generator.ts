let idTicker = 0;
const uniqueIdGenerator = (): string => {
  idTicker += 1;
  return idTicker.toString();
};

export default uniqueIdGenerator;
