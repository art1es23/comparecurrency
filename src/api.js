const API_KEY =
  "b74a6f2284f2ca3d69eeae5385f268de0af9b99c0da269612147bd1feb9e7556";

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

const AGGREGATE_INDEX = "5";

socket.addEventListener("message", (e) => {
  console.log(e);
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
  } = JSON.parse(e.data);
  if (type !== AGGREGATE_INDEX) return;

  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach((fn) => fn(newPrice));
});

const tickersHandlers = new Map();
// TODO: refactor to use URL searchparams

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener("open", () => socket.send(stringifiedMessage), {
    once: true,
  });
}

function subscribeToTickerOnWebSocket(ticker) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

function unsubscribeFromTickerOnWebSocket(ticker) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

export const subscribeOnTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWebSocket(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerOnWebSocket(ticker);
  //   const subscribers = tickersHandlers.get(ticker) || [];
  //   tickersHandlers.set(
  //     ticker,
  //     subscribers.filter((fn) => fn != cb)
  //   );
};

window.tickers = tickersHandlers;

// const loadTickers = () => {
//   if (!tickersHandlers.size) return;

//   fetch(
//     `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
//       ...tickersHandlers.keys(),
//     ].join(",")}&tsyms=USD&api_key=${API_KEY}`
//   )
//     .then((res) => res.json())
//     .then((rawData) => {
//       const updatedPrices = Object.fromEntries(
//         Object.entries(rawData).map(([key, value]) => [key, value.USD])
//       );

//       Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
//         const handlers = tickersHandlers.get(currency) ?? [];

//         handlers.forEach((fn) => fn(newPrice));
//       });
//     });
// };
