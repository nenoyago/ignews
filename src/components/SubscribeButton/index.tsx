import { useState } from 'react';
import { useSession, signIn } from 'next-auth/client';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';

import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';

import styles from './styles.module.scss';

type UseSessionProps = [SessionProps, boolean];

interface SessionProps extends Session {
  activeSubscription: object | null;
}

export function SubscribeButton() {
  const [session] = useSession() as UseSessionProps;
  const [redirectingToCheckout, setRedirectingToCheckout] = useState(false);

  const router = useRouter();

  async function handleSubscribe() {
    if (!session) {
      signIn('github');
      return;
    }

    if (session?.activeSubscription) {
      router.push('/posts');
      return;
    }

    // create checkout session
    try {
      setRedirectingToCheckout(true);
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    } finally {
      setRedirectingToCheckout(false);
    }
  }

  return (
    <button type="button" className={styles.subscribeButton} onClick={handleSubscribe} disabled={redirectingToCheckout}>
      {redirectingToCheckout ? 'One moment...' : 'Subscribe now'}
    </button>
  );
}
