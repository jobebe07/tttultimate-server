// Setup

import MonteCarlo from "./modules/mcts/MonteCarlo.js"
import MonteCarloField from "./modules/mcts/MonteCarloField.js"

let game = new MonteCarloField()
let mcts = new MonteCarlo(game)
let state = game.start()
let winner = game.winner(state)// From initial state, take turns to play game until someone wins

// From initial state, play games until end

while (!winner) {

    console.log("player: " + state.player)

    mcts.runSearch(state, 300)

    let stats = mcts.getStats(state)
    console.log(stats)

    let play = mcts.bestPlay(state, "robust")
    console.log("chosen play: " + play)
    state = game.nextState(state, play)
    winner = game.winner(state)
}

console.log("winner: " + winner)
console.log(game.getFieldVisual(state))