import type { Administrator } from "@/types/cms";

export type AccessArgs<T> = {
  req: {
    user?: T | null;
  };
};

type IsAuthenticated = (args: AccessArgs<Administrator>) => boolean;

/**
 * Native access control for authenticated administrators
 */
export const authenticated: IsAuthenticated = ({ req: { user } }) => {
  return Boolean(user?.collection === "administrators");
};
