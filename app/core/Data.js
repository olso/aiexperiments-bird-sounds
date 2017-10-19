/*
Copyright 2016 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import birdCoordsRaw from "../data/tsne/grid.30.30.2d.sorted.tsv";
import filenamesRaw from "../data/names.txt";
import birdSuggestionsRaw from "../data/autosuggest_bird.txt";

import Config from "./Config";

const birdCoords = (() => {
  const data = birdCoordsRaw.split("\n");
  for (let i = 0; i < data.length; i += 1) {
    const row = data[i].split("\t");
    data[i] = [parseFloat(row[0]), parseFloat(row[1]), parseFloat(row[2])];
  }
  return data;
})();

const filenames = (() => {
  const data = filenamesRaw.split("\n");
  for (let i = 0; i < data.length; i += 1) {
    data[i] = data[i].toUpperCase();
  }
  return data;
})();

const birdSuggestions = (() => birdSuggestionsRaw.split("\n"))();

class Data {
  // constructor() {}
  videoId = "31PWjb7Do1s";
  totalPoints = birdCoords.length;
  filterStates = null;
  filteredList = [];

  static getBird(index) {
    return {
      x: birdCoords[index][0],
      y: birdCoords[index][1],
      index: birdCoords[index][2]
    };
  }

  static getBirdIndex(index) {
    return birdCoords[index][2];
  }

  static getBirdX(index) {
    return birdCoords[index][0];
  }

  static getBirdY(index) {
    return birdCoords[index][1];
  }

  static getTotalPoints() {
    return this.totalPoints;
  }

  static randomizeFilterStates() {
    const total = Data.getTotalPoints();
    let randomState;

    for (let i = 0; i < total; i += 1) {
      randomState =
        (Math.random() * 4 || 0) === 0
          ? Config.filterVisible
          : Config.filterHidden;
      Data.setFilterState(i, randomState);
    }
  }

  static createFilterStates(state = Config.filterVisible) {
    Data.filterStates = [];
    for (let i = 0; i < Data.getTotalPoints(); i += 1) {
      Data.setFilterState(i, state);
    }
  }

  static setFilterState(index, state) {
    Data.filterStates[index] = state;
  }

  static resetFilterStates() {
    for (let i = 0; i < Data.getTotalPoints(); i += 1) {
      Data.setFilterState(i, Config.filterVisible);
    }
  }

  filter(value) {
    const term = value.toUpperCase();

    /* single word */
    if (term.split(" ").length === 1) {
      let name;
      const separators = [" ", "-", "\\(", "\\)"].join("|");
      for (let i = 0; i < filenames.length; i += 1) {
        this.filterStates[i] = Config.filterHidden;
        if (!filenames[i].indexOf(term)) {
          name = filenames[i].split(new RegExp(separators, "g"));
          for (let j = name.length - 1; j >= 0; j -= 1) {
            if (name[j].indexOf(term) === 0) {
              this.filterStates[i] = Config.filterVisible;
              break;
            }
          }
        }
      }

      /* multi word */
    } else {
      for (let i = 0; i < filenames.length; i += 1) {
        this.filterStates[i] = Config.filterHidden;
        if (!filenames[i].indexOf(term)) {
          this.filterStates[i] = Config.filterVisible;
        }
      }
    }
  }

  static getSuggestions(value) {
    let suggestions;
    if (!value) {
      suggestions = Config.emptySuggestions;
      return suggestions;
    }

    const term = value.toUpperCase();
    let name;
    suggestions = [];

    const separators = [" ", "-", "\\(", "\\)"].join("|");

    // inline search
    for (let i = 0; i < birdSuggestions.length; i += 1) {
      name = birdSuggestions[i].split(new RegExp(separators, "g"));
      for (let j = name.length - 1; j >= 0; j -= 1) {
        if (name[j].indexOf(term) === 0) {
          suggestions.push(birdSuggestions[i]);
          break;
        }
      }
    }

    return suggestions;
  }
}

export default Data;
