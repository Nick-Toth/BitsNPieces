/* ****************************************************
// File: Test.cpp
// Name: Nick G. Toth
// Date: April 26th, 2017.
//
// Overview: This is a test file for the Tuple class
// implemented in Tuple.cpp in this same directory.
// To use the test file, run the program executable
// with an integer argument to initialize the list
// of tuples.
//
// ****************************************************/

#include <string> // For atoi. (char[] => integer).

#include "Zipper.cpp" // Includes <list> and <iostream>


// Example of Tuple.
void tupTest(const unsigned short MAX_TUPS);
// Example of zipper functions with Tuple.
void zipperTest(const unsigned short MAX_TUPS);


int main(int argc, char **argv)
{
  // If the program is started with insufficient arguments (1)..
  if(argc < 2)
  {
    // Print an error message.
    std::cout << "\n  Error :: Insufficient Arguments!" << std::endl
              << "  Please Initialize The Tuple List.." << std::endl
              << std::endl;

    // Return error code 1.
    return 1;
  }

  // Set the MAX_TUPS of the tuple list to the first main argument.
  const unsigned short MAX_TUPS = atoi(argv[1]);

  // Run the Tuple test function.
  tupTest(MAX_TUPS);

  // Run the Zipper test function.
  zipperTest(MAX_TUPS);

  // Fin.
  return 0;
}



/* ********************************************
// tupTest simply creates a list of MAX_TUPS
// <short, char> Tuples, displays them, and
// deletes them. 
//
// ********************************************/
void tupTest(const unsigned short MAX_TUPS)
{
  // Create a pointer to a list of short integer & character tuple pointers.
  std::list< Tuple<short, char> > *tup_lst = new std::list< Tuple<short, char> >;

  // Create a tuple object for poping and displaying.
  Tuple<short, char> temp_tup;

  // General index counter.
  short g_index = 0;

  // Print header message.
  std::cout << "\n  Starting Tuple Test with a List of "
            << MAX_TUPS << " Tuples!" << std::endl;

  // Push MAX_TUPS new Tuples onto the back of the list with fst values
  // 1 through MAX_TUPS + 1 and snd values 'a' through 'a' + MAX_TUPS.
  for(; g_index < MAX_TUPS; ++g_index)
    tup_lst->push_back(Tuple<short, char>(g_index + 1, (static_cast<char>('a' + g_index ))));

  // Display alert that list will be printed & erased.
  std::cout << "\n    Printing & Erasing All Tuples.." << std::endl;

  // Create an iterator for traversing the zipped_list
  std::list< Tuple<short, char> >::iterator zip_iter = tup_lst->begin();

  // Traverse the zipped_list
  while(zip_iter != tup_lst->end())
  {
    // Call the Tuple display method on the current zipped_list Tuple
    zip_iter->display();

    // Advance the zipped_list iterator to the next Tuple.
    std::advance(zip_iter, 1);
  }

  // Print exit message.
  std::cout << "\n\n  Ending Tuple Test"
            << std::endl << std::endl;

  // Delete the Tuple list.
  delete tup_lst;

  return;
}



/* ********************************************
// zipperTest creates 2 arrays (shorts , shorts)
// of size MAX_TUPS, and uses the zipper
// function to create a list of <short, short>
// Tuples. Please forgive the absurd length of
// this function.. yuck.
//
// ********************************************/
void zipperTest(const unsigned short MAX_TUPS)
{
  // General index counter.
  short g_index = 0;

  // Stores the boolean returned by the zipper function.
  // true if the zip succeeded. Otherwise false.
  bool did_zip = false;

  // Print header message.
  std::cout << "\n  Starting Zipper Test with Two Lists of "
            << MAX_TUPS << " shorts!" << std::endl;

  // Create a pointer to a linked list of shorts.
  std::list<short> *s_list_1 = new std::list<short>;
  // Create a pointer to another linked list of shorts.
  std::list<short> *s_list_2 = new std::list<short>;

  // From 0 to MAX_TUPS..
  for(; g_index < MAX_TUPS; ++g_index)
  {
    // Insert 1 greater than g_index into the first short list.
    s_list_1->push_back(g_index + 1);
    // Insert MAX_TUPS - g_index into the second short list.
    s_list_2->push_back( MAX_TUPS - g_index );
  }

  // Create a pointer list of <short, short> Tuples for the zipper function.
  std::list< Tuple<short, short> > * zipped_list = new std::list< Tuple<short, short> >;

  // Zip the short lists into the zipped_list.
  // Store the function's output in did_zip.
  did_zip = zip( *s_list_1, *s_list_2, *zipped_list );

  // Display zip success/failure.
  std::cout << std::boolalpha << "\n    Did Zip => " << did_zip
            << std::endl;

  // Delete the short lists.
  delete s_list_1;
  delete s_list_2;

  // If the zip was successful..
  if(did_zip)
  {
    // Display alert that list will be printed..
    std::cout << "\n    Printing Zipped List.." << std::endl;

    // Create an iterator for traversing the zipped_list
    std::list< Tuple<short, short> >::iterator zip_iter = zipped_list->begin();

    // Traverse the zipped_list
    while(zip_iter != zipped_list->end())
    {
      // Call the Tuple display method on the current zipped_list Tuple
      zip_iter->display();

      // Advance the zipped_list iterator to the next Tuple.
      std::advance(zip_iter, 1);
    }
  }

  // Reallocate the short lists.
  s_list_1 = new std::list<short>;
  s_list_2 = new std::list<short>;

  // Unzip the zipped list into opposite of the original short list.
  did_zip = unzip( *zipped_list, *s_list_2, *s_list_1 );

  // Display unzip success/failure.
  std::cout << std::boolalpha << "\n    Did Unzip => " << did_zip
            << std::endl;

  // If the unzip was successful..
  if(did_zip)
  {
    // Reset g_index for printing list indices.
    g_index = 0;

    // Display alert that list will be printed..
    std::cout << "\n\n    Printing Unzipped Lists.." << std::endl;

    // Create an iterator for traversing the first short list
    std::list<short>::iterator fst_iter = s_list_1->begin();
    // Create an iterator for traversing the second short list
    std::list<short>::iterator snd_iter = s_list_2->begin();

    // Traverse the short lists
    while(fst_iter != s_list_1->end())
    {
      // Print out the contents of the lists pointed to by their iterators.
      std::cout << "\n      First Short List [" << g_index << "]  => "
                << * fst_iter << std::endl
                << "      Second Short List [" << g_index << "] => "
                << * snd_iter << std::endl;

      // Advance the short list iterators.
      std::advance(fst_iter, 1);
      std::advance(snd_iter, 1);

      // Increment the index counter.
      ++g_index;
    }
  }

  // Display exit message.
  std::cout << "\n\n  Ending Zipper Test"
            << std::endl << std::endl;

  // Delete everything.
  delete zipped_list;
  delete s_list_1;
  delete s_list_2;

  return;
}
