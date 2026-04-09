"use client";

import { toast } from "@payloadcms/ui";
import React, { Fragment, useCallback, useState } from "react";

import "./index.scss";

const SuccessMessage: React.FC = () => (
  <div>
    Database seeded! You can now{" "}
    <a target="_blank" href="/">
      visit your website
    </a>
  </div>
);

const DisabledMessage: React.FC = () => (
  <div>Database seeding is disabled while the app is being migrated away from Payload.</div>
);

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (seeded) {
        toast.info("Database already seeded.");
        return;
      }
      if (loading) {
        toast.info("Seeding already in progress.");
        return;
      }
      if (error) {
        toast.error(`An error occurred, please refresh and try again.`);
        return;
      }

      setLoading(true);

      try {
        toast.promise(
          new Promise((resolve, reject) => {
            try {
              fetch("/api/admin/seed", { method: "POST", credentials: "include" })
                .then(async (res) => {
                  if (res.ok) {
                    resolve(true);
                    setSeeded(true);
                  } else if (res.status === 410) {
                    const data = (await res.json().catch(() => null)) as { message?: string } | null;
                    reject(new Error(data?.message || "Database seeding is disabled."));
                  } else {
                    reject(new Error("An error occurred while seeding."));
                  }
                })
                .catch((error) => {
                  reject(new Error(error as string));
                });
            } catch (error) {
              reject(new Error(error as string));
            }
          }),
          {
            loading: "Seeding with data....",
            success: <SuccessMessage />,
            error: <DisabledMessage />
          },
        );
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        setError(error);
      }
    },
    [loading, seeded, error],
  );

  let message = "";
  if (loading) message = " (seeding...)";
  if (seeded) message = " (done!)";
  if (error) message = ` (error: ${error})`;

  return (
    <Fragment>
      <button className="seedButton" onClick={handleClick}>
        Seed your database
      </button>
      {message}
    </Fragment>
  );
};
