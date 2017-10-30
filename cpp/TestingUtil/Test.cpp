/* ***************************************************************
\\ File Name:  Test.cpp
// Created By: Nick G. Toth
\\ E-Mail:     ntoth@pdx.edu
// Date:       Sept 3rd, 2017
\\
// Overview: This is a unit test file for TestingUtil (A basic set
\\ of general unit testing tools). See TestingUtil.cpp for more
// information.
\\
// ***************************************************************/

#include "TestingUtil.h"


std::string TEST_MENU_FILENAME = "TestMenu.txt";

// Function to test the 3 argument function timer.
int timeMe(std::string a, bool b, double c)
{ std::cout << "\n\tfunction timer test function running." << std::endl; return 666; }

int main()
{
	using namespace std;
	using namespace tu;

	cout << "\n  Testing menu.." << endl;

	std::unique_ptr<std::string[]> test_menu = generateMenu(TEST_MENU_FILENAME);
	menuController(test_menu);
	
	cout << "\n  Menu test complete.." << endl
		 << "\n  Testing function timer." << endl;

	double exe_time = 0;

	executionTime<int, string, bool, double>(exe_time, timeMe, "str", true, 0.0);

	cout << "\n  Function timer test complete.." << endl
		 << "\n  Tested function ran in: " << exe_time << " ns.." << endl;

	cout << endl << endl;

	return 0;
}
