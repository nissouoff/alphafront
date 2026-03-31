import * as api from "./api";
import type { Landing, Order } from "./api";

export function useLandings(type?: "landing" | "boutique" | "all") {
  return {
    data: null,
    isLoading: false,
    error: null,
    refetch: async () => {
      return await api.getLandings(type);
    },
  };
}

export function useLanding(id: string) {
  return {
    data: null,
    isLoading: false,
    error: null,
    refetch: async () => {
      return await api.getLanding(id);
    },
  };
}

export function useOrders(options?: { limit?: number; landingSlug?: string }) {
  return {
    data: null,
    isLoading: false,
    error: null,
    refetch: async () => {
      return await api.getOrders(options?.limit, options?.landingSlug);
    },
  };
}

export function useLandingOrders(landingSlug: string) {
  return {
    data: null,
    isLoading: false,
    error: null,
    refetch: async () => {
      const result = await api.getOrders();
      return {
        orders: result.orders.filter((o) => o.landingSlug === landingSlug),
      };
    },
  };
}

export function useUpdateOrderStatus() {
  return {
    mutate: async ({
      orderId,
      status,
      returnLoss,
      blockReason,
    }: {
      orderId: string;
      status: string;
      returnLoss?: string;
      blockReason?: string;
    }) => {
      return await api.updateOrderStatus(orderId, status, returnLoss, blockReason);
    },
  };
}

export function useDeleteOrder() {
  return {
    mutate: async (orderId: string) => {
      return await api.deleteOrder(orderId);
    },
  };
}

export function useUpdateLanding() {
  return {
    mutate: async ({ id, data }: { id: string; data: Partial<Landing> }) => {
      return await api.updateLanding(id, data);
    },
  };
}

export function usePublishLanding() {
  return {
    mutate: async ({ id, publish }: { id: string; publish: boolean }) => {
      return publish ? await api.publishLanding(id) : await api.unpublishLanding(id);
    },
  };
}

export function useDeleteLanding() {
  return {
    mutate: async (id: string) => {
      return await api.deleteLanding(id);
    },
  };
}
