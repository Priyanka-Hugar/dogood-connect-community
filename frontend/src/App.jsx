import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import AppShell from '@/components/layout/AppShell';
import Welcome from '@/pages/Welcome';
import JoinDoGood from '@/pages/JoinDoGood';
import Home from '@/pages/Home';
import Gallery from '@/pages/Gallery';
import AddPost from '@/pages/AddPost';
import Messages from '@/pages/Messages';
import Chat from '@/pages/Chat';
import Profile from '@/pages/Profile';
import Community from '@/pages/Community';
import Settings from '@/pages/Settings';
import { auth } from '@/lib/api';

// Simple guard: redirect to /Welcome if no token stored
function RequireAuth({ children }) {
  if (!auth.isAuthenticated()) {
    return <Navigate to="/Welcome" replace />;
  }
  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/Welcome" replace />} />
          <Route path="/Welcome" element={<Welcome />} />
          <Route path="/JoinDoGood" element={<JoinDoGood />} />
          <Route path="/Chat/:id" element={<Chat />} />
          <Route element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }>
            <Route path="/Home" element={<Home />} />
            <Route path="/Gallery" element={<Gallery />} />
            <Route path="/AddPost" element={<AddPost />} />
            <Route path="/Messages" element={<Messages />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Community" element={<Community />} />
            <Route path="/Settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App