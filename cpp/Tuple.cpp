/* ****************************************************************
// File: Tuple.cpp
// Name: Nick G. Toth
// Date: April 26th, 2017.
//
// Overview: This file contains a generic tuple implementation -
// especially for use with the zip and unzip functions defined at
// the end of this file. Note that the tuple is constant. More
// specifically, the data pointed to by the tuple is constant.
// Currently, you can create tuples using this class in one of
// three ways. First, you can set initial values with the
// parameterized constructor. Second, you can create tuples with
// the default constructor, which sets the tuples data pointers
// to nullptr. Once you decide to initialize the pointers, you
// can call the tuple's setter functions, which, of course, can
// not be used more than once. Third, you could use the copy
// constructor. By passing in a variable of the same type, you
// can use the fst, snd and extract functions to retrieve the
// first, second or both elements, respectively. Note that because
// the tuple stores pointers to its data, if you haven't initialized
// the data, fst and snd will not set the variable arguments.
//
// ****************************************************************/

#include <iostream>
#include <list> // For zip & unzip functions - See bottom of file.

// If nullptr has not already been defined..
#ifndef nullptr
// Define it as 0.
#define nullptr 0
#endif // nullptr

// If TUPLE has not already been defined..
#ifndef TUPLE
// Define it as the following class..
#define TUPLE


/* ************************************************
// This is a generic and functional Tuple ADT. The
// Tuple has two pointers to data members of
// generic types. As detailed in the documentation
// below, the Tuple can be initialized using either
// the initializing constructor, or the Tuple setter
// methods. Each of the data members has a getter
// method for retrieving their contents.
// 
// ************************************************/
template<typename A, typename B>
class Tuple
{
  public:

    /* ************************************************
    // Sets data pointers to null. Not that creation of
    // a Tuple with this constructor will require the
    // use of set_fst and set_snd or set_tup to
    // initialize the data. This is important for
    // creating arrays of tuples.
    // 
    // ************************************************/
    Tuple(void) : first(nullptr),
                  second(nullptr)
    { return; }



    /* ************************************************
    // Allocates, initializes data members using the
    // function parameters. If tuples are called with
    // this constructor, they are premanently set to
    // whatever values are passing in! If you want to
    // assign a Tuple its value later, use the default
    // constructor and the setter methods.
    //
    // @param fst: The value to copy into the memory
    // pointed to by first.
    //
    // @param snd: The value to copy into the memory
    // pointed to by second.
    //
    // ************************************************/
    Tuple(const A & fst, const B & snd) : first( new A(fst) ),
                                          second( new B(snd) )
    { return; }



    /* ************************************************
    // Allocates, initializes Tuple members with the
    // data contained in an existing Tuple.
    //
    // @param tup: The Tuple to be copied.
    //
    // ************************************************/
    Tuple(const Tuple & tup)
    {
      // Set first to the first element in the given tuple.
      first = new A( * tup.first );
      // Set second to the second element in the given tuple.
      second = new B( * tup.second );

      return;
    }



    /* ************************************************
    // Deallocate all data.
    //
    // ************************************************/
    ~Tuple(void)
    {
      // If first isn't null..
      if(first)
        // Deallocate it.
        delete first;

      // If second isn't null..
      if(second)
        // Deallocate it.
        delete second;

      // Nullify data.
      first = nullptr;
      second = nullptr;

      return;
    }



    /* ************************************************
    // Retrieves the data pointed to by first. Assuming
    // the first member has been allocated memory, its
    // contents will be assigned to fst. If, however,
    // the first member is null, there will be no
    // assignment.
    //
    // @param fst: Location where the contents of first
    // will be copied.
    //
    // @return: true if the first element isn't null.
    //
    // ************************************************/
    bool fst(A & fst) const
    {
      // If the first pointer is not null..
      if(first)
      {
        // Store second into b.
        fst = *first;
        // Report success.
        return true;
      }

      // Otherwise, report failure.
      return false;
    }



    /* ************************************************
    // Retrieves the data pointed to by second.
    // Assuming the second member has been allocated
    // memory, its contents will be assigned to snd.
    // If, however, the second member is null, there
    // will be no assignment.
    // 
    // @param snd: Location where the contents of
    // second will be copied.
    //
    // @return: true if the second element isn't null.
    //
    // ************************************************/
    bool snd(B & snd) const
    {
      // If the first pointer is not null..
      if(second)
      {
        // Store second into b.
        snd = *second;
        // Report success.
        return true;
      }

      // Otherwise, report failure.
      return false;
    }



    /* ************************************************
    // Retrieves the data pointed to by first and
    // second. Essentially, extract combines fst and
    // snd into one method. If one or both of the data
    // pointers are null, there will be no assignment.
    // If you want to get the data from a partially
    // initialized Tuple, use fst and snd.
    //
    // @param fst: Location where the contents of
    // first will be copied.
    // 
    // @param snd: Location where the contents of
    // second will be copied.
    //
    // @return: true if data pointers are not null.
    //
    // ************************************************/
    bool extract(A & fst, B & snd) const
    {
      // If the data pointers are not null..
      if(first && second)
      {
        // Store first into a.
        fst = * first;
        // Store second into b.
        snd = * second;
        // Report success.
        return true;
      }

      // Otherwise, report failure.
      return false;
    }



    /* ************************************************
    // Allocates, initializes the data pointed to by
    // first and second. This method will only work if
    // the Tuple was created with the default
    // constructor - which sets the data pointers to
    // nullptr.
    // 
    // @param fst: The value to copy into the memory
    // pointed to by first.
    //
    // @param snd: The value to copy into the memory
    // pointed to by second.
    //
    // @return: true if Tuple setup is successful.
    //
    // ************************************************/
    bool set_tup(const A & fst, const B & snd)
    {
      // If either first or second are not null..
      if(first || second)
        // Return false - indicating the assignment failure.
        return false;

      // Otherwise..

      // Allocate memory for and assign the first data member.
      first = new A(fst);
      // Allocate memory for and assign the second data member.
      second = new B(snd);

      // Return true - indicating the assignment success.
      return true;
    }



    /* ************************************************
    // Allocates, initializes the data pointed to by
    // first. See the comment above set_tup for more
    // information.
    // 
    // @param fst: The value to copy into the memory
    // pointed to by first.
    //
    // @return: true if the first member setup is
    // successful.
    //
    // ************************************************/
    bool set_fst(const A & fst)
    {
      // If first is not null..
      if(first)
        // Return false - indicating the assignment failure.
        return false;

      // Otherwise..

      // Allocate memory for and assign the first data member.
      first = new A(fst);

      // Return true - indicating the assignment success.
      return true;
    }



    /* ************************************************
    // Allocates, initializes the data pointed to by
    // second. See the comment above set_tup for more
    // information.
    //
    // @param snd: The value to copy into the memory
    // pointed to by second.
    //
    // @return: true if the second member setup is
    // successful.
    //
    // ************************************************/
    bool set_snd(const B & snd)
    {
      // If second is not null..
      if(second)
        // Return false - indicating the assignment failure.
        return false;

      // Otherwise..

      // Allocate memory for and assign the second data member.
      second = new B(snd);

      // Return true - indicating the assignment success.
      return true;
    }



    /* ************************************************
    // displays the data pointed to by first and second.
    // Note that this method simply prints out the
    // dereferenced pointers. This function is very
    // unsafe and mostly here for testing. Should
    // probably only be using this if data is primitive.
    //
    // @return: true if data pointers are not null.
    //
    // ************************************************/
    bool display(void)
    {
      // If either of the data pointers are NULL..
      if(!first || !second)
        // Report failure.
        return false;

      // Otherwise..
      
      // Print out the data pointed to by first and second.
      std::cout << std::boolalpha
          << "\n\tTuple Data :: "
          << *first << " and "
          << *second << std::endl;

      // Report success.
      return true;
    }


  private:

    // Intuitively, first is the first data member.
    const A * first;

    // As you might expect, second is the second data member.
    const B * second;

};
#endif // TUPLE



/* ****************************************************
// Zips up the data from a list of type A data and a
// list of type B data into a single list of type
// Tuple<A,B>.
//
// @param fst_list: The list of type A from which data
// will be copied into the first data member of the
// Tuple at the corresponding index of zip_list.
// 
// @param snd_list: The list of type B from which data
// will be copied into the second data member of the
// Tuple at the corresponding index of zip_list.
//
// @param zip_list: The list to be filled with Tuples
// of data from fst_list and snd_list.
//
// @return: true if zip is successful.
//
// ****************************************************/
template<typename A, typename B>
bool zip(std::list<A> & fst_list, std::list<B> & snd_list, std::list< Tuple<A,B> > & zip_list)
{
  // Store the size of the first list.
  int fst_size = fst_list.size();

  // If the lists are not the same size..
  if(fst_size == 0 || fst_size != snd_list.size() )
    // Report the failure.
    return false;

  // Create iterator for the first list.
  typename std::list<A>::iterator fst_iter = fst_list.begin();
  // Create iterator for the second list.
  typename std::list<B>::iterator snd_iter = snd_list.begin();

  // While the first iterator has not reached the end of the first list..
  // implying that neither iterator has hit the end of its list..
  while(fst_iter != fst_list.end())
  {
    // Push a new Tuple with the data pointed to by the first
    // and second list iterators to the front of the zip_list.
    zip_list.push_front( Tuple<A,B>( *fst_iter , *snd_iter ) );

    // Advance the first and second list iterators.
    std::advance(fst_iter, 1);
    std::advance(snd_iter, 1);
  }

  // Report success.
  return true;
}



/* ************************************************
// Unzips the data from a list of type Tuple<A,B>
// into two lists of type A and type B.
//
// @param zip_list: The list containing Tuples from
// which the first data members will be copied into
// fst_list, and the second data members will be
// copied into snd_list.
// 
// @param fst_list: The list to be filled with the
// first data members of each Tuple in zip_list.
// 
// @param snd_list: The list to be filled with the
// second data members of each Tuple in zip_list.
//
// @return: true if unzip is successful.
//
// ************************************************/
template<typename A, typename B>
bool unzip( std::list< Tuple<A,B> > & zip_list, std::list<A> & fst_list, std::list<B> & snd_list)
{
  // Create iterator for the zipped list.
  typename std::list< Tuple<A,B> >::iterator zip_iter = zip_list.begin();

  // Temporary storage for fst_list data
  A fst;
  // Temporary storage for snd_list data
  B snd;

  // While the zipped list iterator has not
  // reached the end of the zipped list..
  while(zip_iter != zip_list.end())
  {
    // Try to store the data pointed to by the zip_list iterator
    // into the fst and snd temp objects. If the transfer is successful..
    if( zip_iter->fst(fst) && zip_iter->snd(snd))
    {
      // Push a new A with the data in fst into the front of the fst_list.
      fst_list.push_front( A(fst) );
      // Push a new B with the data in snd into the front of the snd_list.
      snd_list.push_front( B(snd) );
    }
    // If the transfer fails, report the failure.
    else return false;

    // Advance the zipped list iterator.
    std::advance(zip_iter, 1);
  }

  // Report the successful transfer of every element
  // in the Tuple list into the fst and snd lists.
  return true;
}
