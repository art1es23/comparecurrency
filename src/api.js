const API_KEY =
  "b74a6f2284f2ca3d69eeae5385f268de0af9b99c0da269612147bd1feb9e7556";

const tickersHandlers = new Map();
// TODO: refactor to use URL searchparams

const loadTickers = () => {
  if (!tickersHandlers.size) return;

  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickersHandlers.keys(),
    ].join(",")}&tsyms=USD&api_key=${API_KEY}`
  )
    .then((res) => res.json())
    .then((rawData) => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );

      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? [];

        handlers.forEach((fn) => fn(newPrice));
      });
    });
};

export const subscribeOnTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  //   const subscribers = tickersHandlers.get(ticker) || [];
  //   tickersHandlers.set(
  //     ticker,
  //     subscribers.filter((fn) => fn != cb)
  //   );
};

setInterval(loadTickers, 5000);

window.tickers = tickersHandlers;
