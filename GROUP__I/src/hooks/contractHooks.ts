import { useState } from "react";
import { type PropertyFormData } from "../types";

export interface UseCreatePropertyReturn {
  createProperty: (data: PropertyFormData) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  reset: () => void;
}

export function useCreateProperty(): UseCreatePropertyReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
  };

  const createProperty = async (_data: PropertyFormData) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setIsSuccess(true);
    } catch (e: any) {
      setIsError(true);
      setError(e?.message ?? "Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { createProperty, isLoading, isSuccess, isError, error, reset };
}

export interface UseListPropertyReturn {
  listProperty: (propId: number) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  reset: () => void;
}

export function useListProperty(): UseListPropertyReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
  };

  const listProperty = async (_propId: number) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setIsSuccess(true);
    } catch (e: any) {
      setIsError(true);
      setError(e?.message ?? "Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { listProperty, isLoading, isSuccess, isError, error, reset };
}

export interface UseUnlistPropertyReturn {
  unlistProperty: (propId: number) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  reset: () => void;
}

export function useUnlistProperty(): UseUnlistPropertyReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
  };

  const unlistProperty = async (_propId: number) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setIsSuccess(true);
    } catch (e: any) {
      setIsError(true);
      setError(e?.message ?? "Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { unlistProperty, isLoading, isSuccess, isError, error, reset };
}

export interface UseDeletePropertyReturn {
  deleteProperty: (propId: number) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  reset: () => void;
}

export function useDeleteProperty(): UseDeletePropertyReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
  };

  const deleteProperty = async (_propId: number) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setIsSuccess(true);
    } catch (e: any) {
      setIsError(true);
      setError(e?.message ?? "Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteProperty, isLoading, isSuccess, isError, error, reset };
}

export interface UseBuyerApproveReturn {
  buyerApprove: (amount: bigint) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  reset: () => void;
}

export function useBuyerApprove(): UseBuyerApproveReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
  };

  const buyerApprove = async (_amount: bigint) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 2000));
      setIsSuccess(true);
    } catch (e: any) {
      setIsError(true);
      setError(e?.message ?? "Approval failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { buyerApprove, isLoading, isSuccess, isError, error, reset };
}

export interface UseBuyPropertyReturn {
  buyProperty: (propId: number) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  reset: () => void;
}

export function useBuyProperty(): UseBuyPropertyReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
  };

  const buyProperty = async (_propId: number) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 2500));
      setIsSuccess(true);
    } catch (e: any) {
      setIsError(true);
      setError(e?.message ?? "Purchase failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { buyProperty, isLoading, isSuccess, isError, error, reset };
}

export interface UseGetAllPropertiesReturn {
  fetchAllProperties: () => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

export function useGetAllProperties(): UseGetAllPropertiesReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllProperties = async () => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
    } catch (e: any) {
      setIsError(true);
      setError(e?.message ?? "Fetch failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchAllProperties, isLoading, isError, error };
}

export interface UseGetListedPropertiesReturn {
  fetchListedProperties: () => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

export function useGetListedProperties(): UseGetListedPropertiesReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchListedProperties = async () => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
    } catch (e: any) {
      setIsError(true);
      setError(e?.message ?? "Fetch failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchListedProperties, isLoading, isError, error };
}

export interface UseGetPropertyReturn {
  fetchProperty: (propId: number) => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

export function useGetProperty(): UseGetPropertyReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = async (_propId: number) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
    } catch (e: any) {
      setIsError(true);
      setError(e?.message ?? "Fetch failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchProperty, isLoading, isError, error };
}
