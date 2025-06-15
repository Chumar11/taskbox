import logo from "./logo.svg";
import "./App.css";
import AppRouter from "./routes/AppRouter";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./conrext/AuthContext";
import { BoardProvider } from "./conrext/BoardContext";
import { BordviewProvider } from "./conrext/BordviewContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BoardProvider>
          <BordviewProvider>
          <AppRouter />
          </BordviewProvider>
        </BoardProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
