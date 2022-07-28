import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';
import { GlobalProvider } from '../context';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <GlobalProvider>
            <Component {...pageProps} />
        </GlobalProvider>
    )
}

export default MyApp
