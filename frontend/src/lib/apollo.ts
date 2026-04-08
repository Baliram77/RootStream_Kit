import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { fetchWithTimeout } from "@/lib/apolloLink";
import { getPublicEnv } from "@/services/env";

export function createApolloClient() {
  const { envioGraphqlUrl } = getPublicEnv();
  return new ApolloClient({
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
}

