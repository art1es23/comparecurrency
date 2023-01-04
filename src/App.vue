<template>
  <div class="wrapper">
    <section class="ticker">
      <label for="ticker">Ticker</label>
      <input
        @keydown.enter="addNew"
        v-model="ticker"
        placeholder="Please input the currency.."
        type="text"
        id="ticker"
        class="ticker-input"
      />

      <button @click="addNew" class="ticker-btn">
        <span class="ticker-plus"></span>
        <span>Add new*</span>
      </button>
    </section>

    <dl v-show="arrayTickers.length" class="list-tickers">
      <div
        v-for="t in arrayTickers"
        :key="t.name"
        @click="chooseCurrency(t)"
        :class="{
          'ticker-card--active': currentCurrency === t,
        }"
        class="list-tickers__item ticker-card"
      >
        <dt class="ticker-card__caption">{{ t.name }} - USD</dt>
        <dd class="ticker-card__value">{{ t.value }}</dd>
        <button
          @click.stop="handlerRemove(t)"
          class="ticker-card-btn ticker-card-btn--remove"
        >
          <span class="icon-trash"></span>
          <span>Remove</span>
        </button>
      </div>
    </dl>

    <section v-if="currentCurrency" class="diagram">
      <h3 class="diagram-caption">{{ currentCurrency.name }} - USD</h3>
      <div class="diagram-content">
        <div
          v-for="(col, idx) in fixGraph()"
          :key="idx"
          :style="{ height: `${col}%` }"
          class="diagram-content__item"
        ></div>
      </div>
      <button class="diagram-btn diagram-btn--close">X</button>
    </section>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      ticker: "",
      arrayTickers: [],
      currentCurrency: null,
      arrGraph: [],
    };
  },

  methods: {
    addNew() {
      const currentTicker = {
        name: this.ticker,
        value: "-",
      };

      this.arrayTickers.push(currentTicker);

      setInterval(async () => {
        const result = await fetch(
          `https://min-api.cryptocompare.com/data/price?fsym=${currentTicker.name}&tsyms=USD&api_key=b74a6f2284f2ca3d69eeae5385f268de0af9b99c0da269612147bd1feb9e7556`
        );

        const data = await result.json();

        this.arrayTickers.find((t) => t.name === currentTicker.name).value =
          data.USD > 1 ? data.USD.toFixed(2) : data.USD.toPrecision(3);

        if (this.currentCurrency?.name === currentTicker.name) {
          this.arrGraph.push(data.USD);
        }
      }, 5000);

      this.ticker = "";
    },

    handlerRemove(current) {
      this.arrayTickers = this.arrayTickers.filter((t) => t !== current);
    },

    fixGraph() {
      const maxValue = Math.max(...this.arrGraph);
      const minValue = Math.min(...this.arrGraph);

      return this.arrGraph.map(
        (value) => 7.5 + ((value - minValue) * 92.5) / (maxValue - minValue)
      );
    },

    chooseCurrency(current) {
      this.currentCurrency = current;
      this.arrGraph = [];
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<style src="./app.css"></style>
