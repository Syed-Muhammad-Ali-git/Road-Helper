import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface LiveCoords {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface UseLiveLocationOptions {
  onSuccess?: (coords: LiveCoords) => void;
  onError?: (err: string) => void;
}

export interface LiveLocationState {
  coords: LiveCoords | null;
  permission: "prompt" | "granted" | "denied" | "unsupported";
  isWatching: boolean;
  error: string | null;
  requestPermission: () => void;
  stop: () => void;
}

export function useLiveLocation(options?: UseLiveLocationOptions): LiveLocationState {
  const [coords, setCoords] = useState<LiveCoords | null>(null);
  const [permission, setPermission] = useState<
    LiveLocationState["permission"]
  >("prompt");
  const [error, setError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const supported = typeof navigator !== "undefined" && "geolocation" in navigator;

  const stop = useCallback(() => {
    if (!supported) return;
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setIsWatching(false);
    }
  }, [supported]);

  const startWatching = useCallback(() => {
    if (!supported) {
      setPermission("unsupported");
      setError("Geolocation is not supported on this device/browser.");
      return;
    }

    stop();
    setError(null);
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPermission("granted");
        const c = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        setCoords(c);
        optionsRef.current?.onSuccess?.(c);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setPermission("denied");
        const msg = err.message || "Unable to access location.";
        setError(msg);
        optionsRef.current?.onError?.(msg);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10_000,
        timeout: 15_000,
      },
    );
    setIsWatching(true);
  }, [supported, stop]);

  const requestPermission = useCallback(() => {
    startWatching();
  }, [startWatching]);

  useEffect(() => {
    // Start watching lazily only when requested by UI.
    return () => stop();
  }, [stop]);

  return { coords, permission, isWatching, error, requestPermission, stop };
}

