// *****************************************************************
// This is a very simple implementation of a Tag System (see
// https://en.wikipedia.org/wiki/Tag_system).
//
// As long as you're familiar with tag systems, this code should
// be easy to use. The only potentially unusual part of this
// implementation is the halting_condition parameter. Most tag
// systems halt when the tape is empty. This is the default
// behavior, but I have generalized the halting condition to be
// any boolean-valued function of the tape. For example, if you
// want the machine to halt when the tape has a length of 0 or 1,
// then you could set halting_condition = (tape => tape.length < 2).
//
// There isn't any purpose to this program beyond my recreational
// curiosity. I learned about tag systems while casually studing
// the Collatz conjecture, and I thought it would be fun to create
// my own. If you have any desire to use this code, feel free.
// No credit necessary. <3 :)
//
// Enjoy!
// - Nick G. Toth
//
// *****************************************************************
function TagSystem( deletion_number // :: Positive Integer
                    // e.g. 2 for a 2-tag system.

,                   production_rules // :: {Character : String}
                    // A json object mapping each symbol in the alphabet to a corresponding string over the alphabet.
                    // Note: The alphabet isn't passed explicitly in this implementation, but it is assumed that the alphabet is

,                   halting_condition = (tape => tape.length === 0) // :: String -> Boolean
                    // A function of a string (namely, the tape) which decides when to halt.
                    // i.e. the tag system halts iff halting_condition(tape) returns true.
){

  // We store the tape as a json object so that we can perform queue operations in constant time.
  this.tape = {}

  // Variables for managing the queue.
  this.tape_head = 0; this.tape_tail = 0;


  // Copies some initial string onto the tape.
  // Warning: This will overwrite any existing tape content.
  this.initialize = (new_tape_string => {
    this.tape = {}
    for(var i = 0; i < new_tape_string.length; ++i)
    { this.tape[i] = new_tape_string[i] }
    this.tape_head = 0
    this.tape_tail = new_tape_string.length-1
  })


  // Applies one transition to the tape. Returns the new tape as a string.
  this.transition = (_ => {

    // If the halting condition is already satisfied, this returns the contents of the tape immediately.
    if(halting_condition(this.stringifyTape())){ return this.stringifyTape() }

    // Gets the first element on the tape
    let head = this.tape[this.tape_head];

    // Dequeues the first deletion_number elements from the tape.
    var i = 0
    do { delete this.tape[this.tape_head + i]; }
    while(deletion_number > ++i)
    this.tape_head += deletion_number

    // Applies the transition corresponding to head, and enqueues the returned symbols.
    let new_symbols = production_rules[head], num_new_symbols = new_symbols.length
    if(new_symbols === undefined){ return Error("Error -- There is no production rule for the symbol: ", head) }
    for(i = 0; i < num_new_symbols; ++i)
    { this.tape[this.tape_tail+i+1] = new_symbols[i] }
    this.tape_tail += num_new_symbols

    // Return the new tape.
    return this.stringifyTape()
  })


  // Applies transitions to the tape until the halting condition is satisfied, or some
  // maximum number of transitions have been applied. This maximum is determined by an
  // optional argument, max_iters. Returns a list containing the stringified tape at
  // each transition.
  this.run = ((max_iters = 10000) => {
    let tape_values = [this.stringifyTape()] // List of tapes returned by this function.
    let iter = 0; // For counting up to max_iters.

    do { tape_values.push(this.transition()) }
    while(max_iters > ++iter && !halting_condition(tape_values[tape_values.length-1]))

    return tape_values;
  })


  // Converts the contents of the tape to a string, and returns the result.
  this.stringifyTape = (_ => {
    let tape_string = ""
    for(var i = this.tape_head; i <= this.tape_tail; ++i)
    { tape_string = tape_string.concat(this.tape[i]) }
    return tape_string
  })

}



// The Collatz Problem represented as a 2-Tag System.
// See the wikipedia article for more information.
function CollatzTagSystem( n // A numerical input, as you would enter into the usual Collatz function, namely collatz(n)=(3n+1) if n is odd else n/2.
){
  // Create a 2-tag system representing the Collatz function.
  let cts = new TagSystem( 2
                         , {'a':"bc", 'b':"a", 'c':"aaa"}
                         , (tape => tape.length < 2)) // Halts if the tape reaches a size of 1.

  let input = 'a'.repeat(n)
  cts.initialize(input)
  let transitions = cts.run()

  return transitions
}


// Test
const c3_ground_truth_transitions = ["aaa", "abc", "cbc", "caaa", "aaaaa", "aaabc", "abcbc", "cbcbc", "cbcaaa", "caaaaaa", "aaaaaaaa", "aaaaaabc", "aaaabcbc", "aabcbcbc", "bcbcbcbc", "bcbcbca", "bcbcaa", "bcaaa", "aaaa", "aabc", "bcbc", "bca", "aa", "bc", "a"],
      c3_transitions = CollatzTagSystem(3);
console.log("c3_transitions = ", c3_transitions)
console.log("c3_transitions = c3_ground_truth_transitions?", JSON.stringify(c3_ground_truth_transitions)==JSON.stringify(c3_transitions))
