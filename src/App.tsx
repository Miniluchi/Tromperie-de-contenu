import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ActionPage } from "./pages/ActionPage";
import { navigationItems } from "./data/navigation";
import { thumbnailItems } from "./data/thumbnails";
import type { PageContent } from "./types";

const conceptPageContent: PageContent = {
  title: "STOP à la tromperie sur vos contenus",
  backgroundClass: "bg-black"
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              content={conceptPageContent}
              navigationItems={navigationItems}
              thumbnailItems={thumbnailItems}
            />
          } 
        />
        <Route path="/action" element={<ActionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
