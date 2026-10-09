import React, { createContext, useContext, useEffect, useState } from "react";
import {
  CmsStoreData,
  fetchPublicContent,
  fetchCmsContent,
  getSessionToken,
} from "../services/cmsService";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PHOTOS,
  DEFAULT_COURSES,
  DEFAULT_FACILITIES,
  DEFAULT_CONTACT,
  DEFAULT_SETTINGS,
} from "../server/defaultData";

interface CmsContextValue {
  content: CmsStoreData;
  isLoading: boolean;
  refresh: () => Promise<void>;
  isPreviewMode: boolean;
}

const defaultContent: CmsStoreData = {
  photos: DEFAULT_PHOTOS,
  categories: DEFAULT_CATEGORIES,
  courses: DEFAULT_COURSES,
  facilities: DEFAULT_FACILITIES,
  contact: DEFAULT_CONTACT,
  settings: DEFAULT_SETTINGS,
};

const CmsContext = createContext<CmsContextValue>({
  content: defaultContent,
  isLoading: false,
  refresh: async () => {},
  isPreviewMode: false,
});

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<CmsStoreData>(defaultContent);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  const loadData = async () => {
    setIsLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const previewParam = urlParams.get("preview") === "true";
    const hasToken = !!getSessionToken();

    if (previewParam && hasToken) {
      setIsPreviewMode(true);
      const res = await fetchCmsContent();
      if (res.success && res.draft) {
        setContent(res.draft);
        setIsLoading(false);
        return;
      }
    }

    setIsPreviewMode(false);
    const pub = await fetchPublicContent();
    setContent(pub);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <CmsContext.Provider
      value={{
        content,
        isLoading,
        refresh: loadData,
        isPreviewMode,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export function useCms(): CmsContextValue {
  return useContext(CmsContext);
}
