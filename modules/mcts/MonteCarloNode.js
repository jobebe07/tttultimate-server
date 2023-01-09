export default class MonteCarloNode {
    /**
   * Create a new MonteCarloNode in the search tree.
   * @param {MonteCarloNode} parent - The parent node.
   * @param {Play} play - Last play played to get to this state.
   * @param {State} state - The corresponding state.
   * @param {Play[]} unexpandedPlays - The node's unexpanded child plays.
   */
    constructor(parent, play, state, unexpandedPlays) {

        this.play = play
        this.state = state    // Monte Carlo stuff
        this.n_plays = 0
        this.n_wins = 0    // Tree stuff
        this.parent = parent
        this.children = new Map()
        for (let play of unexpandedPlays) {
            this.children.set(play.hash(), { play: play, node: null })
        }
    }

    /** Get the MonteCarloNode corresponding to the given play. */
    childNode(play) {
        // TODO
        // return MonteCarloNode
    }  /** Expand the specified child play and return the new child node. */
    expand(play, childState, unexpandedPlays) {
        // TODO
        // return MonteCarloNode
    }  /** Get all legal plays from this node. */
    allPlays() {
        // TODO
        // return Play[]
    }  /** Get all unexpanded legal plays from this node. */
    unexpandedPlays() {
        // TODO
        // return Play[]
    }  /** Whether this node is fully expanded. */
    isFullyExpanded() {
        // TODO
        // return bool
    }  /** Whether this node is terminal in the game tree, 
        NOT INCLUSIVE of termination due to winning. */
    isLeaf() {
        // TODO
        // return bool
    }
    
    /** Get the UCB1 value for this node. */
    getUCB1(biasParam) {
        // TODO
        // return number
    }
}