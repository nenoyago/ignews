import { GetStaticProps } from 'next';
import Head from 'next/head';

import { SubscribeButton } from '../components/SubscribeButton';

import { stripe } from '../services/stripe';

import styles from './home.module.scss';

// Client-side
// Server-side
// Static Site Generation

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | Ignews</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about <br /> the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>For {product.amount} month</span>
          </p>

          <SubscribeButton />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1IgHZjLyoPX7JBKbClbYfL9z');

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};