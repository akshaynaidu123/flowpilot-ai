import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getSession } from "@/lib/auth";

export default function HomeRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const session = getSession();

    navigate(
      session ? "/dashboard" : "/login",
      { replace: true }
    );
  }, [navigate]);

  return null;
}