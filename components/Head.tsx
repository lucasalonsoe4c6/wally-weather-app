import React from 'react'
import Head from 'next/head';

type Props = {
    title: string
};

export default function CustomHead({ title }: Props) {
    return (
        <Head>
            <title>{title + " - WallyWeatherApp"}</title>
            <meta name="description" content="Technical Test" />
            <meta name="author" content="Lucas Alonso" />
            <meta charSet="UTF-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}
