import { useState, useEffect, useCallback } from 'react';
import { ApiResponse } from '../types/api.types';

// Estado de la petición API
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Opciones para el hook
interface UseApiOptions {
  immediate?: boolean; // Ejecutar inmediatamente al montar
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

// Hook principal para manejar peticiones API
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) {
  const { immediate = false, onSuccess, onError } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  // Función para ejecutar la petición
  const execute = useCallback(
    async (...args: any[]) => {
      setState((prev: ApiState<T>) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiFunction(...args);
        
        if (response.success && response.data) {
          setState({
            data: response.data,
            loading: false,
            error: null,
          });
          
          onSuccess?.(response.data);
          return response.data;
        } else {
          const errorMessage = response.message || 'Error en la petición';
          setState({
            data: null,
            loading: false,
            error: errorMessage,
          });
          
          onError?.(errorMessage);
          throw new Error(errorMessage);
        }
      } catch (error: any) {
        const errorMessage = error.message || 'Error de conexión';
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
        
        onError?.(errorMessage);
        throw error;
      }
    },
    [apiFunction, onSuccess, onError]
  );

  // Función para limpiar el estado
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  // Función para refrescar datos
  const refresh = useCallback(
    (...args: any[]) => {
      return execute(...args);
    },
    [execute]
  );

  // Ejecutar inmediatamente si se especifica
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
    refresh,
    isIdle: !state.loading && !state.data && !state.error,
    isSuccess: !state.loading && !!state.data && !state.error,
    isError: !state.loading && !!state.error,
  };
}

// Hook específico para listas con paginación
export function useApiList<T>(
  apiFunction: (filters?: any) => Promise<ApiResponse<T[]>>,
  options: UseApiOptions & { 
    initialFilters?: any;
    autoRefresh?: number; // ms para auto-refresh
  } = {}
) {
  const { initialFilters, autoRefresh, ...apiOptions } = options;
  const [filters, setFilters] = useState(initialFilters || {});

  const {
    data,
    loading,
    error,
    execute,
    reset,
    refresh,
    isIdle,
    isSuccess,
    isError,
  } = useApi(() => apiFunction(filters), apiOptions);

  // Auto-refresh si se especifica
  useEffect(() => {
    if (autoRefresh && autoRefresh > 0) {
      const interval = setInterval(() => {
        if (!loading) {
          refresh();
        }
      }, autoRefresh);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, loading, refresh]);

  // Ejecutar cuando cambien los filtros
  useEffect(() => {
    execute();
  }, [filters, execute]);

  const updateFilters = useCallback((newFilters: any) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters || {});
  }, [initialFilters]);

  return {
    data: data || [],
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refresh,
    reset,
    isIdle,
    isSuccess,
    isError,
  };
}

// Hook para operaciones CRUD
export function useApiCrud<T>(baseService: {
  getAll: (filters?: any) => Promise<ApiResponse<T[]>>;
  getById: (id: string) => Promise<ApiResponse<{ item: T }>>;
  create: (data: any) => Promise<ApiResponse<{ item: T }>>;
  update: (id: string, data: any) => Promise<ApiResponse<{ item: T }>>;
  delete: (id: string) => Promise<ApiResponse<void>>;
}) {
  // Estados para cada operación
  const [listState, setListState] = useState<ApiState<T[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const [itemState, setItemState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const [mutationState, setMutationState] = useState<{
    loading: boolean;
    error: string | null;
  }>({
    loading: false,
    error: null,
  });

  // Cargar lista
  const loadList = useCallback(async (filters?: any) => {
    setListState((prev: ApiState<T[]>) => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await baseService.getAll(filters);
      if (response.success && response.data) {
        setListState({
          data: response.data,
          loading: false,
          error: null,
        });
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      setListState({
        data: null,
        loading: false,
        error: error.message,
      });
      throw error;
    }
  }, [baseService]);

  // Cargar item por ID
  const loadItem = useCallback(async (id: string) => {
    setItemState((prev: ApiState<T>) => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await baseService.getById(id);
      if (response.success && response.data) {
        setItemState({
          data: response.data.item,
          loading: false,
          error: null,
        });
        return response.data.item;
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      setItemState({
        data: null,
        loading: false,
        error: error.message,
      });
      throw error;
    }
  }, [baseService]);

  // Crear item
  const create = useCallback(async (data: any) => {
    setMutationState({ loading: true, error: null });
    
    try {
      const response = await baseService.create(data);
      if (response.success && response.data) {
        setMutationState({ loading: false, error: null });
        
        // Actualizar lista si existe
        if (listState.data) {
          setListState((prev: ApiState<T[]>) => ({
            ...prev,
            data: prev.data ? [...prev.data, response.data!.item] : [response.data!.item],
          }));
        }
        
        return response.data.item;
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      setMutationState({ loading: false, error: error.message });
      throw error;
    }
  }, [baseService, listState.data]);

  // Actualizar item
  const update = useCallback(async (id: string, data: any) => {
    setMutationState({ loading: true, error: null });
    
    try {
      const response = await baseService.update(id, data);
      if (response.success && response.data) {
        setMutationState({ loading: false, error: null });
        
        // Actualizar en la lista si existe
        if (listState.data) {
          setListState((prev: ApiState<T[]>) => ({
            ...prev,
            data: prev.data?.map(item => 
              (item as any)._id === id ? response.data!.item : item
            ) || null,
          }));
        }
        
        // Actualizar item actual si coincide
        if (itemState.data && (itemState.data as any)._id === id) {
          setItemState((prev: ApiState<T>) => ({
            ...prev,
            data: response.data!.item,
          }));
        }
        
        return response.data.item;
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      setMutationState({ loading: false, error: error.message });
      throw error;
    }
  }, [baseService, listState.data, itemState.data]);

  // Eliminar item
  const remove = useCallback(async (id: string) => {
    setMutationState({ loading: true, error: null });
    
    try {
      const response = await baseService.delete(id);
      if (response.success) {
        setMutationState({ loading: false, error: null });
        
        // Remover de la lista si existe
        if (listState.data) {
          setListState((prev: ApiState<T[]>) => ({
            ...prev,
            data: prev.data?.filter(item => (item as any)._id !== id) || null,
          }));
        }
        
        // Limpiar item actual si coincide
        if (itemState.data && (itemState.data as any)._id === id) {
          setItemState({
            data: null,
            loading: false,
            error: null,
          });
        }
        
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      setMutationState({ loading: false, error: error.message });
      throw error;
    }
  }, [baseService, listState.data, itemState.data]);

  return {
    // Estados
    list: listState,
    item: itemState,
    mutation: mutationState,
    
    // Operaciones
    loadList,
    loadItem,
    create,
    update,
    remove,
    
    // Utilidades
    isLoading: listState.loading || itemState.loading || mutationState.loading,
    hasError: !!(listState.error || itemState.error || mutationState.error),
    error: listState.error || itemState.error || mutationState.error,
  };
}

// Hook para debounce en búsquedas
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook para manejo de estado de búsqueda
export function useSearch<T>(
  searchFunction: (term: string, filters?: any) => Promise<ApiResponse<T[]>>,
  debounceDelay: number = 300
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  const {
    data: results,
    loading,
    error,
    execute,
  } = useApi(
    () => searchFunction(debouncedSearchTerm, filters),
    { immediate: false }
  );

  // Ejecutar búsqueda cuando cambie el término debounced o los filtros
  useEffect(() => {
    if (debouncedSearchTerm.length >= 2) {
      execute();
    }
  }, [debouncedSearchTerm, filters, execute]);

  const updateFilters = useCallback((newFilters: any) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters }));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setFilters({});
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilters,
    results: results || [],
    loading,
    error,
    clearSearch,
    hasResults: (results || []).length > 0,
    isEmpty: debouncedSearchTerm.length >= 2 && !loading && (results || []).length === 0,
  };
}