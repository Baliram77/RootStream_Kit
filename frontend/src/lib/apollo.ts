import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { fetchWithTimeout } from "@/lib/apolloLink";
import { getPublicEnv } from "@/services/env";

const { envioGraphqlUrl } = getPublicEnv();

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: envioGraphqlUrl,
    fetchOptions: { method: "POST" },
    fetch: fetchWithTimeout,
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-and-network", errorPolicy: "all" },
    query: { errorPolicy: "all" },
  },
});

