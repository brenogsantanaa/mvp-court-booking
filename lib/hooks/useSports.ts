import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useSports() {
  const { data, error, isLoading } = useSWR('/api/sports', fetcher);

  return {
    data,
    isLoading,
    error,
  };
}

