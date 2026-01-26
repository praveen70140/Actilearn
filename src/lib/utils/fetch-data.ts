export async function fetchDataUntilCondition(
  url: string,
  breakConditionFunction: (data: any) => boolean,
) {
  let fetchedData = null;
  // FIXME: Prevent infinite non-terminating loop
  let notOkCount = 0;
  let totalCount = 1;
  while (true) {
    try {
      const response = await fetch(url + `&t=${totalCount}`, {
        cache: 'no-store',
      });
      if (!response.ok) {
        notOkCount++;
        if (notOkCount >= 5) {
          break;
        } else {
        }
      }

      fetchedData = await response.json();
      if (breakConditionFunction(fetchedData)) {
        break;
      }
      totalCount++;

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Fetch error:', error);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return fetchedData;
}
