import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import MeetingList from './MeetingList';
import ChangePassword from "./ChangePassword";
import { ErrorPopup } from "./ErrorPopup";
import ProtectedRoute from "./ProtectedRoute";
import MeetingStart from './MeetingStart';
import NotFound from './NotFound';
import "./Helper/disableConsole";
import DemoExpired from './Helper/DemoExpired';
import DemoAlreadyUsed from './Helper/DemoAlreadyUsed';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <MeetingList />
          </ProtectedRoute>
        } />
        <Route path="/live/:encodedmeetingId" element={
          <ProtectedRoute>
            <MeetingStart />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ProtectedRoute> <ChangePassword /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
        <Route path="/demo-expired" element={<DemoExpired />} />
        <Route path="/demo-already-used" element={<DemoAlreadyUsed />} />

      </Routes>
    </Router>
    <ErrorPopup />
    </>
  );
}

export default App;
