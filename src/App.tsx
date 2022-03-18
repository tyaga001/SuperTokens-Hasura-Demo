import React from "react";
import "./App.scss";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { ApolloClient, InMemoryCache, ApolloProvider, DefaultOptions } from "@apollo/client";
import AppRoutes from "./shared/components/routes/AppRoutes";
const defaultOptions: DefaultOptions = {
    watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "ignore",
    },
    query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
    },
};

function App() {
    const { accessTokenPayload } = useSessionContext();
    const client = new ApolloClient({
        uri: `${process.env.REACT_APP_API_GRAPHQL_URL}`,
        cache: new InMemoryCache(),
        headers: {
            Authorization: `Bearer ${accessTokenPayload?.jwt}`,
            "Content-Type": "application/json",
        },
        defaultOptions,
    });
    return (
        <div className="App">
            <ApolloProvider client={client}>
                <AppRoutes />
            </ApolloProvider>
        </div>
    );
}

export default App;
