import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './utils/endpoints';
import {
  WithdrawQueryOptions,
  GetParams,
  WithdrawPaginator,
  Withdraw,
} from '@/types';

import client from '@framework/utils/index'
import { mapPaginatorData } from './utils/data-mappers';

export const useCreateWithdrawMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(client.withdrawClient.create, {
    onSuccess: () => {
      router.push(`/my-account/withdraws`);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.WITHDRAWS);
    },
  });
};



export const useWithdrawQuery = ({ id }: { id: string }) => {
  const { data, error, isLoading } = useQuery<Withdraw, Error>(
    [API_ENDPOINTS.WITHDRAWS, { id }],
    () => client.withdrawClient.get({ id })
  );

  return {
    withdraw: data,
    error,
    isLoading,
  };
};

export const useWithdrawsQuery = (
  params: Partial<WithdrawQueryOptions>,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<WithdrawPaginator, Error>(
    [API_ENDPOINTS.WITHDRAWS, params],
    ({ queryKey, pageParam }) =>
      client.withdrawClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
      ...options,
    }
  );

  return {
    withdraws: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
