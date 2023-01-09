import MonteCarlo from "./modules/mcts/MonteCarlo"
import MonteCarloField from "./modules/mcts/MonteCarloField"

export default class MonteCarloGame {
    constructor() {
        let game = new MonteCarloField()
        let mcts = new MonteCarlo(game)
        let state = game.start()
        let winner = game.winner(state)// From initial state, take turns to play game until someone wins
        while (winner === null) {
            mcts.runSearch(state, 1)
            let play = mcts.bestPlay(state)
            state = game.nextState(state, play)
            winner = game.winner(state)
        }
        console.log(winner)
    }
}