import useSWR from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // @ts-ignore
    error.info = await res.json().catch(() => ({ message: res.statusText }));
    // @ts-ignore
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export function useSports() {
  const { data, error, isLoading } = useSWR('/api/sports', fetcher);

  return {
    data,
    isLoading,
    error,
  };
}

