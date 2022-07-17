import {
	ApolloClient,
	ApolloProvider,
	createHttpLink,
	InMemoryCache,
} from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App/App';
import './global.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

const link = createHttpLink({
	uri: process.env.REACT_APP_API_URL || '/api/graphql',
	credentials: 'include',
});

const client = new ApolloClient({
	link,
	cache: new InMemoryCache(),
});

root.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</ApolloProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
