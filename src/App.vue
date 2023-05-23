<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <!-- <div
      class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center"
    >
      <svg
        class="animate-spin -ml-1 mr-3 h-12 w-12 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div> -->
    <div class="container">
      <section>
        <div class="flex">
          <div class="max-w-xs">
            <label for="wallet" class="block text-sm font-medium text-gray-700"
              >Тикер</label
            >
            <div class="mt-1 relative rounded-md shadow-md">
              <input
                @keydown.enter="addAndUpdate"
                v-model.trim="ticker"
                type="text"
                name="wallet"
                id="wallet"
                class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                placeholder="Например DOGE"
              />
            </div>
            <div
              v-if="filterCurrencies.length"
              class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
            >
              <span
                v-for="cur in filterCurrencies"
                :key="cur"
                @click="selectTicker(cur)"
                class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
              >
                {{ cur }}
              </span>
            </div>
            <div v-if="isExist" class="text-sm text-red-600">
              Такой тикер уже добавлен
            </div>
            <div v-if="isEmpty" class="text-sm text-red-600">
              Введите свою валюту
            </div>
          </div>
        </div>
        <button
          @click="addAndUpdate"
          type="button"
          class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <!-- Heroicon name: solid/mail -->
          <svg
            class="-ml-0.5 mr-2 h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#ffffff"
          >
            <path
              d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            ></path>
          </svg>
          Добавить
        </button>
      </section>

      <template v-if="arrayTickers.length">
        <div class="flex items-center gap-2">
          <label for="filter">Filter:</label>
          <input
            type="text"
            name="filter"
            v-model.trim="filterTickers"
            id="filter"
            class="block pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
          />
          <button
            @click="page--"
            v-if="page > 1"
            class="my-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back
          </button>
          <button
            @click="page++"
            v-if="hasNextPage"
            class="my-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Next
          </button>
        </div>
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="t in paginatedTickers"
            :key="t.name"
            @click="chooseCurrency(t)"
            :class="{
              'border-purple-800': selectedTicker === t,
              'border-solid': selectedTicker === t,
              'border-4': selectedTicker === t,
            }"
            class="bg-white overflow-hidden shadow rounded-lg cursor-pointer"
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ t.name }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ formatPrice(t.price) }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="handlerRemove(t)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
            >
              Удалить
            </button>
          </div>
        </dl>

        <hr class="w-full border-t border-gray-600 my-4" />
      </template>

      <section v-if="selectedTicker" class="relative">
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
          {{ selectedTicker.name.toUpperCase() }} - USD
        </h3>
        <div class="flex items-end border-gray-600 border-b border-l h-64">
          <div
            v-for="(col, idx) in fixedGraph"
            :key="idx"
            :style="{ height: `${col}%` }"
            class="bg-purple-800 border w-10"
          ></div>
        </div>
        <button
          @click="closeGraph"
          type="button"
          class="absolute top-0 right-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:svgjs="http://svgjs.com/svgjs"
            version="1.1"
            width="30"
            height="30"
            x="0"
            y="0"
            viewBox="0 0 511.76 511.76"
            style="enable-background: new 0 0 512 512"
            xml:space="preserve"
          >
            <g>
              <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
              ></path>
            </g>
          </svg>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
import { subscribeOnTicker, unsubscribeFromTicker } from "./api";

export default {
  name: "App",
  data() {
    return {
      ticker: "",
      filterTickers: "",
      isEmpty: false,

      arrayTickers: [],
      selectedTicker: null,

      arrGraph: [],

      page: 1,

      coinsList: null,
      isExist: false,
    };
  },

  watch: {
    ticker(value) {
      this.isExist = this.ticker !== value;
      this.isEmpty = false;
    },

    arrayTickers() {
      localStorage.setItem("crypto-list", JSON.stringify(this.arrayTickers));
    },

    filterTickers() {
      this.page = 1;
    },

    pageStateOptions(value) {
      const { pathname } = window.location;

      window.history.pushState(
        null,
        document.title,
        `${pathname}?filter=${value.filterTickers}&page=${value.page}`
      );
    },

    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page--;
      }
    },

    selectedTicker() {
      this.arrGraph = [];
    },
  },

  computed: {
    filterCurrencies: {
      get() {
        return this.coinsList && this.ticker.length
          ? Object.keys(this.coinsList)
              .filter((name) => name.indexOf(this.ticker.toUpperCase()) > -1)
              .slice(0, 4)
          : [];
      },
      set(value) {
        return value;
      },
    },

    startIndex() {
      return (this.page - 1) * 6;
    },
    endIndex() {
      return this.page * 6;
    },

    filteredListTickers() {
      return this.arrayTickers.filter((ticker) =>
        ticker.name.includes(this.filterTickers.toUpperCase())
      );
    },

    paginatedTickers() {
      return this.filteredListTickers.slice(this.startIndex, this.endIndex);
    },

    hasNextPage() {
      return this.filteredListTickers.length > this.endIndex;
    },

    fixedGraph() {
      const maxValue = Math.max(...this.arrGraph);
      const minValue = Math.min(...this.arrGraph);

      if (maxValue === minValue) {
        return this.arrGraph.map(() => 50);
      }

      return this.arrGraph.map(
        (value) => 5 + ((value - minValue) * 95) / (maxValue - minValue)
      );
    },

    pageStateOptions() {
      return {
        filter: this.filterTickers,
        page: this.page,
      };
    },
  },

  methods: {
    selectTicker(selectedCurrency) {
      this.ticker = selectedCurrency;
      this.addAndUpdate();
    },

    formatPrice(price) {
      if (price === "-") return price;
      return price > 1 ? price.toFixed(2) : price.toPrecision(3);
    },

    updateTicker(tickerName, price) {
      this.arrayTickers
        .filter((t) => t.name === tickerName)
        .forEach((t) => {
          t.price = price;
        });

      // if (this.selectedTicker?.name === tickerName) {
      //   this.arrGraph.push(exchangeData.USD);
      // }
    },

    addAndUpdate() {
      const currentTicker = {
        name: this.ticker.toUpperCase(),
        price: "-",
      };

      this.isEmpty = currentTicker.name === "";

      this.isExist = this.arrayTickers.some(
        (currency) => currency.name === currentTicker.name
      );

      if (!this.isExist && !this.isEmpty) {
        this.arrayTickers = [...this.arrayTickers, currentTicker];

        subscribeOnTicker(currentTicker.name, (newPrice) =>
          this.updateTicker(currentTicker.name, newPrice)
        );

        this.ticker = "";
        this.filterTickers = "";
        this.filterCurrencies = [];
      }
    },

    handlerRemove(tickerToRemove) {
      this.arrayTickers = this.arrayTickers.filter((t) => t !== tickerToRemove);

      if (this.selectedTicker === tickerToRemove) {
        this.selectedTicker = null;
      }

      unsubscribeFromTicker(tickerToRemove.name);
    },

    chooseCurrency(current) {
      this.selectedTicker = current;
    },

    closeGraph() {
      this.selectedTicker = null;
    },

    async GET_COINS(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.log(`Error catch: ${error}`);
        throw error;
      }
    },
  },

  async created() {
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );
    const API_URL =
      "https://min-api.cryptocompare.com/data/all/coinlist?summary=true";
    const tickersList = localStorage.getItem("crypto-list");

    try {
      const res = await this.GET_COINS(API_URL);
      this.coinsList = res.Data;
    } catch (error) {
      console.log(error);
    }

    const URL_KEYS = ["filter", "page"];

    URL_KEYS.forEach((key) => {
      if (windowData[key]) {
        this[key] = windowData[key];
      }
    });

    //////
    if (tickersList) {
      this.arrayTickers = JSON.parse(tickersList);
      this.arrayTickers.forEach((ticker) =>
        subscribeOnTicker(ticker.name, (newPrice) =>
          this.updateTicker(ticker.name, newPrice)
        )
      );
    }

    setInterval(this.updateTicker, 5000);
  },
};
</script>

<style src="./assets/tailwind.css"></style>
