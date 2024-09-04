import { useQuery, useQueryClient, useMutation } from 'react-query';
import { AccountType, Card } from '@type/index';
import { API_ENDPOINTS } from "@framework/utils/endpoints";
import client from '@framework/utils/index'
import { useUI } from "@contexts/ui.context";
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { useUser } from '@framework/auth';

export function useAccounts(params?: any, options?: any) {
  const { isAuthorized } = useUser();

  const { data, isLoading, error } = useQuery<AccountType[], Error>(
    [API_ENDPOINTS.ACCOUNTS, params],
    () => client.account.getAll(),
    {
      enabled: isAuthorized,
      ...options,
    }
  );

  return {
    cards: data ?? [],
    isLoading,
    error,
  };
}

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { closeModal } = useUI();

  const { mutate, isLoading, error } = useMutation(client.account.delete, {
    onSuccess: () => {
      closeModal();
      toast.success(`${t('common:card-successfully-deleted')}`);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ACCOUNTS);
    },
  });

  return {
    deleteCard: mutate,
    isLoading,
    error,
  };
};

export function useAddAccounts(method_key?: any) {


  //const queryClient = useQueryClient();
  const { mutate, isLoading, error } = useMutation(
    client.account.create,
    {
      onSuccess: () => {
    
        toast.success(`${('common:account-successfully-add')}`, {
          toastId: 'success',
        });
      },
      onError: (error) => {
        const {
          response: { data },
        }: any = error ?? {};
        toast.error(`${(data?.message)}`, {
          toastId: 'error',
        });
      },
      // Always refetch after error or success:
      onSettled: () => {
      //  queryClient.invalidateQueries(API_ENDPOINTS.CARDS);
      },
    }
  );

  return {
    addNewCard: mutate,
    isLoading,
    error,
  };
}


export function useEditccounts(method_key?: any) {
    const { t } = useTranslation();
    const { closeModal } = useUI();
    const queryClient = useQueryClient();
    const { mutate, isLoading, error } = useMutation(
      client.account.update,
      {
        onSuccess: () => {
          closeModal();
          toast.success(`${t('common:account-successfully-add')}`, {
            toastId: 'success',
          });
        },
        onError: (error) => {
          const {
            response: { data },
          }: any = error ?? {};
          toast.error(`${t(data?.message)}`, {
            toastId: 'error',
          });
        },
        // Always refetch after error or success:
        onSettled: () => {
          queryClient.invalidateQueries(API_ENDPOINTS.CARDS);
        },
      }
    );
  
    return {
      addNewCard: mutate,
      isLoading,
      error,
    };
  }

