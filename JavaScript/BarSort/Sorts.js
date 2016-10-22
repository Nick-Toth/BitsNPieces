/***********************************************
 *  Sorting algorithms for BarSort animation.  *
 *  I may add more sorting algorithms at some  *
 *  point, but probably not.                   *
 ***********************************************/

function bubbleSort(arr , sp , sc)
{
    var swapped;
    do
    {
        swapped = false;

        for (var i = 0; i < arr.length - 1; ++i)
        {
            if (arr[i] > arr[i + 1])
            {
                var temp = arr[i];

                arr[i] = arr[i + 1];
                arr[i + 1] = temp;

                sp[sc] = [ i , i + 1 ];
                sc++;

                swapped = true;
            }
        }
    } while (swapped);
    return [arr , sp , sc];
}

function insertionSort(arr,sp,sc)
{
    for (var i = 0; i < arr.length; i++)
    {
        var cmp = arr[i];

        for (var j = i; j > 0 && cmp < arr[j - 1]; j--)
        {
            arr[j] = arr[j - 1];
            sp[sc] = [j-1 , j];
            sc++;
        }
        arr[j] = cmp;
    }
    return [arr , sp , sc];
}
