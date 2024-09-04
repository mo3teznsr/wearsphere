import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import client from '@framework/utils/index';
import { useQuery } from 'react-query';
import moment from 'moment';
export const usePaymentStatuses=(props={start:moment().subtract(1,'months').format('YYYY-MM-DD'),end:moment().add(1,'months').format('YYYY-MM-DD')})=>{
    return client.account.getPaymentStates(props)
  }