/*************************************************
 *  Cycling animation of 5 bars being sorted by  *
 *  alternating sorting algorithms. Heights are  *
 *  randomized with each iteration.              *
 *************************************************/

var sort_algs = ['bubbleSort','insertionSort'], // <-\
    alg_altr  = 0,                              //  <--- Management of sorting algorithm rotation.
    altr_cap  = 1;                              // <-/

// HTML ids for bars to be animated.
var sort_bars = [ 'sort_bar_1',
                  'sort_bar_2',
                  'sort_bar_3',
                  'sort_bar_4',
                  'sort_bar_5'
                ];

var original_bar_heights = [ 0 , 0 , 0 , 0 , 0 ],
    sorted_bar_heights   = [ 0 , 0 , 0 , 0 , 0 ];

var swap_pairs     = [ ], // Pairs of all swapped bar heights / cycle.
    higher_element = [ ], // Bar to be moved to the right.
    lower_element  = [ ]; // Bar to be moved to the left.

var swap_counter  = 0,  // Total swapped / cycle. Coefficient for next_run_time.
    test_counter  = 0,  // Manages number of iterations in animateSwap.
    next_run_time = 0;  // Time to wait to start the next cycle.

/*
 * Program Lifecycle
 * */
(function initialize( )
{
    reset( ); // See below

    next_run_time = swap_counter * 1000 + 1000; // Time for animations + 1000ms wait time.

    // If the new heights needed to be sorted.
    if( original_bar_heights != sorted_bar_heights )
        animateSwap( ); // ANIMATE DEM SORTATIONS

    else{ next_run_time = 500; } // If bars happen to be already sorted, wait 500ms and restart.

    setTimeout( initialize , next_run_time );

})( );

/*
 * Get new random bar heights, sort them, save results, reset fields, ect..
 * */
function reset( )
{
    swap_counter = 0; //   <-\
    test_counter = 0; //    <--- Reset fields
    swap_pairs = [ ]; //   <-/

    for( var i = 0; i < 5; i++ ) // For each of the 5 bars
    {
        var bar_height = Math.floor( Math.random( ) * 500 ); // Get a random height.
        var element = document.getElementById( sort_bars[i] ); // Get the bar.

        element.style.height = String(bar_height) + 'px';    // Set its height.
        element.style.marginTop = String( 500 - bar_height ) + 'px'; // Refit the top margin.

        original_bar_heights[i] = bar_height; // Save     heights     sorting.
        sorted_bar_heights[i]   = bar_height; //      the         for
    }
    // Have we already cycled through the sorting algorithms?
    alg_altr += alg_altr != altr_cap? 1:-1; // No? CONTINUE! Yes? RESET!

    // Perform the sort!
    var sort_out = eval ( sort_algs[ alg_altr ] + "(sorted_bar_heights, swap_pairs, swap_counter)" );

    sorted_bar_heights = sort_out[0]; // <-\
    swap_pairs = sort_out[1];         //  <--- Set the values returned by the sorting algorithm.!
    swap_counter = sort_out[2];       // <-/
}

/*
 * Animate..
 * */
function animateSwap( )
{
    if( test_counter < swap_counter ) // IFLOOP™
    {
        higher_element = sort_bars[ swap_pairs[ test_counter ][0] ]; // This one is going right.
        lower_element  = sort_bars[ swap_pairs[ test_counter ][1] ]; // This one is going left.

        // Difference in higher/lower_element height.
        diff = Math.abs( getElemHeight(higher_element) - getElemHeight(lower_element) );

        // I SAID ANIMATE
        anim(higher_element , lower_element);

        test_counter++; // Excellent. One more animation down!
        setTimeout( animateSwap , 1000 );
    }
}

// This method was preceded by a very long, ugly line of code in animateSwap.
function getElemHeight(element)
{
    return parseInt( document.getElementById(element).style.height )
}

/* 
 * Performs the animation, called by animateSwap.
 * */
function anim( higher_element , lower_element )
{
    $("div#" + higher_element ).animate(
        {
            marginTop: ("+=" + String( diff ) + 'px' ),
            height: ( "-=" + String( diff ) + 'px' )
        }, 1000);

    $("div#" + lower_element ).animate(
        {
            marginTop: ("-=" + String( diff ) + 'px' ),
            height: ( "+=" + String( diff ) + 'px' )
        }, 1000);

}
