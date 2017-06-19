/* ******************************************************
// Name:  Nick G. Toth
// Email: ntoth@pdx.edu
// File:  MergeTextFiles.cpp
// Date:  April 23, 2017
//
// Overview: This program is used to copy over a set of
// files into a single file. The files loaded into this
// file must have numeric names spaced evenly by 1, with
// a .txt extension.. i.e. 1.txt, 2.txt, .. , 5.txt. When
// running the program, an argument of the name of the
// last file to be loaded, sans extension.. If you want
// to load 10 files, for example, the argument should
// simply be 10. The files will be loaded into a new file
// called AllFiles.txt.
//
// ******************************************************/

#include <iostream>
#include <fstream>

#include <cstdlib>
#include <cstring>
#include <string>


// The name of the output file.
const char OUTFILENAME[] = "AllFiles.txt";

// The max length for a line in any input file.
const short LINEBUFSIZE = 1024;

// Takes the number of files to scan.
int main(int argc, char *argv[])
{
  // If no arguments are provided..
  if(argc < 2)
  {
    // Print an alert for invalid argument list..
    std::cout << "\nInvalid Argument!" << std::endl
              << "Please provide the number of files to scan.."
              << std::endl << std::endl;

    // Return with error code 1.
    return 1;
  }

              // The number of files to scan.
  const short NUMFILES = std::atoi( argv[1] ),
              // The maxumum size of a filename.
              FILENAMELEN = std::strlen( argv[1] );

                 // Index counter for allocation & deallocation.
  unsigned short index = 0,
                 // Index counter for reading files.
                 next_index = 0;

  // If the argument is less than 1..
  if(NUMFILES < 1)
  {
    // Print an alert for invalid argument.
    std::cout << "\nInvalid Argument!" << std::endl
              << "Entry must be greater than 0.."
              << std::endl << std::endl;

    // Return with error code 1.
    return 1;
  }

  // Print message with number of files to be scanned.
  std::cout << "Scanning " << NUMFILES << " files.." << std::endl;

  // Create/open an output file named OUTFILENAME to write all other files to.
  std::ofstream out_file(OUTFILENAME);

       // Buffer for each line of input files.
  char * line_buffer = new char[LINEBUFSIZE],
       // Names of all of the files to be loaded.
       ** filenames = new char * [NUMFILES];

	// Init filenames
  for(;index < NUMFILES; ++index )
  {
    // Allocate memory for next filename
    filenames[index] = new char[FILENAMELEN + 5];
    // Set the current filename to index + 1 and the .txt extension.
    std::strcpy(filenames[index], (std::to_string(index + 1) + ".txt").c_str() );
  } index = 0;

  // Print out some whitespace.
  std::cout << std::endl << std::endl;

  // While there are unscanned files in the range 1..NUMFILES..
  while(next_index < NUMFILES)
  {
    // Print message for next file being coppied.
    std::cout << "Copying file #" << (next_index + 1) << std::endl;

    // Write the section number.
    out_file << "\nFILE #" << (next_index + 1)
             << std::endl << std::endl << std::endl;

    // Open next input file.
    std::ifstream in_file(filenames[next_index]);

    // Copy every line in the input file.
    while(in_file.good())
    {
      // Read input file contents to line_buffer
      in_file.get(line_buffer, LINEBUFSIZE, '\n');
      in_file.ignore(128, '\n');

      // Write line_buffer contents to out_file.
      out_file << line_buffer << std::endl;
    }

    // Close the input file.
    in_file.close();
    // Increment the file index counter.
    ++next_index;

    // Write some whitespace to the file between chapters.
    out_file << "\n\n\n";
  }

  // Close the output file.
  out_file.close();

  // Delete each filename
  for(;index < NUMFILES; ++index)
    delete[] filenames[index];

  // Delete array of filenames.
  delete[] filenames;
  filenames = NULL;

  // Delete the line buffer.
  delete[] line_buffer;

  return 0;
}
