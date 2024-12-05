import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad) {
      const savedPosition = sessionStorage.getItem(`scrollPos-${pathname}`);

      requestAnimationFrame(() => {
        if (savedPosition !== null) {
          const scrollAttempts = () => {
            const scrolled = window.scrollTo({
              top: parseInt(savedPosition),
              behavior: "instant",
            });

            if (!scrolled) {
              window.scrollTo(0, parseInt(savedPosition));
            }
          };

          scrollAttempts();
          setTimeout(scrollAttempts, 50);
          setTimeout(scrollAttempts, 100);

          sessionStorage.removeItem(`scrollPos-${pathname}`);
        } else {
          window.scrollTo({
            top: 0,
            behavior: "instant",
          });
        }
      });

      setIsInitialLoad(false);
    } else {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }

    const handleBeforeUnload = () => {
      const currentScroll =
        window.pageYOffset || document.documentElement.scrollTop;
      sessionStorage.setItem(`scrollPos-${pathname}`, currentScroll.toString());
    };

    const handlePageHide = () => {
      const currentScroll =
        window.pageYOffset || document.documentElement.scrollTop;
      sessionStorage.setItem(`scrollPos-${pathname}`, currentScroll.toString());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [pathname, isInitialLoad]);

  return null;
}
