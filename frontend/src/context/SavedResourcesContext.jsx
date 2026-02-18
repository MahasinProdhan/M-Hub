import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext.jsx";
import {
  fetchSavedResources,
  saveResource,
  unsaveResource,
} from "../services/savedResources.js";

const SavedResourcesContext = createContext(null);

const getKey = (resourceType, resourceId) => `${resourceType}:${String(resourceId)}`;

const normalizeResource = (resource) => {
  if (!resource || typeof resource !== "object") return null;
  return {
    ...resource,
    _id: resource._id ? String(resource._id) : "",
  };
};

const normalizeSavedItem = (item) => {
  if (!item || !item.resourceType || !item.resourceId) return null;

  return {
    resourceType: item.resourceType,
    resourceId: String(item.resourceId),
    resource: normalizeResource(item.resource),
  };
};

export const SavedResourcesProvider = ({ children }) => {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [pendingMap, setPendingMap] = useState({});

  const savedKeys = useMemo(
    () => new Set(savedItems.map((item) => getKey(item.resourceType, item.resourceId))),
    [savedItems],
  );

  const setPending = useCallback((key, value) => {
    setPendingMap((prev) => {
      if (value) {
        return { ...prev, [key]: true };
      }

      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const refreshSavedResources = useCallback(async () => {
    if (!isLoggedIn) {
      setSavedItems([]);
      setInitialized(true);
      return;
    }

    setLoading(true);

    try {
      const items = await fetchSavedResources();
      const normalizedItems = items.map(normalizeSavedItem).filter(Boolean);
      setSavedItems(normalizedItems);
    } catch (error) {
      if (!error?.isAuthExpired) {
        toast.error(error.message || "Failed to load saved materials");
      }
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (authLoading) return;
    refreshSavedResources();
  }, [authLoading, refreshSavedResources]);

  const isSaved = useCallback(
    (resourceType, resourceId) => savedKeys.has(getKey(resourceType, resourceId)),
    [savedKeys],
  );

  const isResourcePending = useCallback(
    (resourceType, resourceId) => Boolean(pendingMap[getKey(resourceType, resourceId)]),
    [pendingMap],
  );

  const toggleSavedResource = useCallback(
    async ({ resourceType, resourceId, resource = null }) => {
      const normalizedId = String(resourceId || "");
      if (!resourceType || !normalizedId) return;

      const key = getKey(resourceType, normalizedId);
      if (pendingMap[key]) return;

      const currentlySaved = savedKeys.has(key);
      const existingItem = savedItems.find(
        (item) => getKey(item.resourceType, item.resourceId) === key,
      );
      const optimisticItem =
        existingItem ||
        normalizeSavedItem({
          resourceType,
          resourceId: normalizedId,
          resource,
        });

      setPending(key, true);

      setSavedItems((prev) => {
        const withoutItem = prev.filter(
          (item) => getKey(item.resourceType, item.resourceId) !== key,
        );

        if (currentlySaved) {
          return withoutItem;
        }

        if (!optimisticItem) {
          return withoutItem;
        }

        return [optimisticItem, ...withoutItem];
      });

      try {
        if (currentlySaved) {
          await unsaveResource({ resourceType, resourceId: normalizedId });
          toast.success("Removed from saved materials");
        } else {
          const savedItemFromServer = await saveResource({
            resourceType,
            resourceId: normalizedId,
          });

          const normalizedSavedItem = normalizeSavedItem(savedItemFromServer);
          if (normalizedSavedItem) {
            setSavedItems((prev) => {
              const withoutItem = prev.filter(
                (item) => getKey(item.resourceType, item.resourceId) !== key,
              );
              return [normalizedSavedItem, ...withoutItem];
            });
          }

          toast.success("Saved to materials");
        }
      } catch (error) {
        setSavedItems((prev) => {
          const withoutItem = prev.filter(
            (item) => getKey(item.resourceType, item.resourceId) !== key,
          );

          if (currentlySaved && optimisticItem) {
            return [optimisticItem, ...withoutItem];
          }

          return withoutItem;
        });

        if (!error?.isAuthExpired) {
          toast.error(error.message || "Failed to update saved materials");
        }
      } finally {
        setPending(key, false);
      }
    },
    [pendingMap, savedItems, savedKeys, setPending],
  );

  return (
    <SavedResourcesContext.Provider
      value={{
        savedItems,
        loading,
        initialized,
        refreshSavedResources,
        isSaved,
        isResourcePending,
        toggleSavedResource,
      }}
    >
      {children}
    </SavedResourcesContext.Provider>
  );
};

export const useSavedResources = () => {
  const context = useContext(SavedResourcesContext);

  if (!context) {
    throw new Error(
      "useSavedResources must be used within a SavedResourcesProvider",
    );
  }

  return context;
};
